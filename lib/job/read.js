'use strict';

const zlib     = require('zlib');
const iconv    = require('iconv-lite');
const parse    = require('co-busboy');
const csvParse = require('csv').parse;
const is       = require('type-is');
const Boom     = require('boom');
const Splitter = require('../splitter.js').Splitter;

const LinesProcessor = require('../lineprocessor.js');

const gzipTypes = new Set([
  'application/gzip',
  'application/x-gzip',
  'application/x-gunzip',
  'application/gzipped',
  'application/gzip-compressed',
  'application/x-compressed',
  'application/x-compress',
  'gzip/document'
]);

const csvTypes = new Set([
  'text/csv',
  'text/x-csv',
  'application/csv',
  'application/x-csv',
  'text/comma-separated-values',
  'text/x-comma-separated-values',
  'application/vnd.ms-excel'
]);

module.exports = function* read(req, res) {
  const self = this;

  this.logger?.info('Starting response');

  req.on('close', () => {
    if (!req.complete) {
      this.logger?.error('Request aborted, stopping job...');
      this._stop();
    }
  });

  const linesProcessor = new LinesProcessor(this);

  /**
   * Write ECs
   */
  linesProcessor.on('ec', ec => {
    if (self.aborted) { return; }

    if (!this.writerStarted) {
      this.writerStarted = true;
      res.status(200);
      this.writer.writeHead(this.outputFields);

      for (const prop in ec) {
        this.report.set('first_event', prop, ec[prop]);
      }
    }

    this.writer.write(ec);
    this.report.inc('general', 'nb-ecs');
  });

  /**
   * Write denied ECs
   */
  linesProcessor.on('denied', ec => {
    if (self.aborted) { return; }

    if (!this.deniedWriterStarted) {
      this.deniedWriterStarted = true;
      this.deniedWriter.writeHead(this.outputFields);
    }

    this.deniedWriter.write(ec);
    this.report.inc('general', 'nb-denied-ecs');
  });

  this.writer.on('saturated',       () => { this.addPressure('writer'); });
  this.deniedWriter.on('saturated', () => { this.addPressure('deniedWriter'); });
  this.logStreams.on('saturated',   () => { this.addPressure('loggers'); });
  linesProcessor.on('saturated',    () => { this.addPressure('lineprocessor'); });

  this.writer.on('drain',       () => { this.removePressure('writer'); });
  this.deniedWriter.on('drain', () => { this.removePressure('deniedWriter'); });
  this.logStreams.on('drain',   () => { this.removePressure('loggers'); });
  linesProcessor.on('drain',    () => { this.removePressure('lineprocessor'); });

  let needHeartbeat = true;

  if (!is(req, ['multipart/form-data'])) {
    // handle a not multipart stream: log data are embeded directly in the HTTP body
    this.logger?.info('Handling a raw stream upload');
    yield readInputStream(req);
    this.logger?.info('Finished reading request');
    return drain();
  }

  this.logger?.info('Handling a multipart upload');

  // to parse multipart data in the HTTP body, we use co-busboy
  const parts = parse(req, {
    autoFields: true,
    fileSize: Infinity
  });

  let nbFiles = 0;
  let part;
  while (part = yield parts) { // eslint-disable-line no-cond-assign
    this.report.set('files', ++nbFiles, part.filename || 'N/A');

    this.logger?.info(`Reading file [${part.filename || 'N/A'}][${part.mimeType || 'N/A'}]`);
    yield readInputStream(part);
    this.logger?.info(`Finished reading file [${part.filename}]`);
  }

  this.logger?.info('Finished reading multipart request');
  return drain();


  /**
   * Stop the splitter and wait for the line processor to drain
   * @return {Promise}
   */
  function drain() {
    return new Promise(resolve => {
      if (linesProcessor.ended) {
        return resolve();
      }

      self.logger?.verbose('Waiting for line processor to drain');
      linesProcessor.on('end', () => {
        self.logger?.verbose('Line processor drained');
        resolve();
      });
      linesProcessor.drain();
    });
  }

  /**
   * Read a stream and pipe it to the line splitter
   * Can be either a raw request or a file provided by busboy
   * @param  {Object} source  the stream to read
   * @return {Promise}
   */
  function readInputStream(source) {
    const headers         = source.headers || {};
    const filename        = source.filename || '';
    const contentType     = headers['content-type'] || source.mimeType || '';
    const contentEncoding = headers['content-encoding'] || '';
    const isGzip          = gzipTypes.has(contentType) || contentEncoding === 'gzip';
    const isCsv           = csvTypes.has(contentType) || filename.endsWith('.csv');

    return new Promise((resolve, reject) => {

      // only accepted encoding is gzip
      if (contentEncoding && contentEncoding != 'gzip') {
        return reject(self.error(4005, 406));
      }

      let readStream = source;

      if (isGzip) {
        self.logger?.info('Part detected as GZIP');

        const unzip = zlib.createUnzip();

        unzip.on('error', err => {
          uploadError(new Error(`Error while unziping request data: ${err}`), 4002, 400);
        });

        readStream = source.pipe(unzip);

      }

      let stream;

      if (isCsv) {
        self.logger?.info('Part detected as CSV');
        stream = source.pipe(csvParse({
          'delimiter': ';',
          'relax_column_count': true,
          'columns': (columns) => {
            self.csvColumns = columns;
            return columns;
          },
        }));
      } else {
        stream = readStream
          .pipe(iconv.decodeStream(self.inputCharset))
          .pipe(new Splitter());
      }

      self.onPause  = function () { stream.pause(); };
      self.onResume = function () { stream.resume(); };
      self.onAbort  = function (err) {
        linesProcessor.end();
        readStream.unpipe();
        return reject(err || new Boom('Job aborted'));
      };

      // read input stream line by line
      let lineIndex = 0;
      let timeout = undefined;
      stream.on('data', line => {
        if (line) {
          linesProcessor.push(line);
          lineIndex += 1;
        }

        // Regularly send dots to prevent the client from timing out
        if (needHeartbeat && self.parsedLines) {
          (self.logger || console).verbose(
            `Job [${self.jobID}] is still processing (currently at line [${lineIndex}])`
          );
          if (self.resIsDeferred) {
            res.write('.');
          }
          needHeartbeat = false;
          timeout = setTimeout(() => { needHeartbeat = true; }, 20000);
        }
      });

      stream.on('error', err => {
        if (timeout) { clearTimeout(timeout); }
        reject(err.code === 'ENOBREAKS' ? self.error(4022, 400) : err);
      });

      stream.on('end', (v) => {
        if (timeout) { clearTimeout(timeout); }
        return resolve(v);
      });

      function uploadError(err, code, status) {
        self.logger?.error(`Upload error [${err.message}]`);
        err.code   = code;
        err.status = status;
        reject(err);
      }
    });
  }
};
