'use strict';

var fs             = require('fs');
var path           = require('path');
var Lazy           = require('lazy');
var async          = require('async');
var mkdirp         = require('mkdirp');
var moment         = require('moment');
var winston        = require('winston');
var multiparty     = require('multiparty');
var config         = require('../config.json');
var statusCodes    = require('../statuscodes.json');
var ezJobs         = require('./jobs.js');
var io             = require('../lib/socketio.js');
var PressureMaster = require('./pressuremaster.js');
var ReportManager  = require('./reportmanager.js');
var StreamHandler  = require('./streamhandler.js');
var initializer    = require('./requestinitializer.js');
var LineProcessor  = require('./lineprocessor.js');

/**
 * Create a Job instance that handles the entire process
 */
var Job = function (req, res, jobID, options) {
  var self      = this;
  req._jobID    = jobID;
  ezJobs[jobID] = self;
  options       = options || {};

  var writerWasStarted          = false;
  var writtenECs                = false;
  var statusHeader              = 'ezPAARSE-Status';
  var msgHeader                 = 'ezPAARSE-Status-Message';
  var nbFiles                   = 0;

  // to read the input stream line by line
  var lazy = new Lazy();

  function init() {
    
    var logRoute = req.ezBaseURL + '/' + jobID;
    var loglevel = req.header('Traces-Level')
                 || (config.EZPAARSE_ENV == 'production' ? 'info' : 'verbose');
    var logPath  = path.join(__dirname, '/../tmp/jobs/', jobID.charAt(0), jobID.charAt(1), jobID);
    mkdirp.sync(logPath);

    var baseReport = {
      'general': {
        'Job-ID':           jobID,
        'Job-Date':         moment().format(),
        'Job-Done':         false,
        'result-file-ecs':  logRoute,
        'URL-Traces':       logRoute + '/job-traces.log',
        'nb-ecs':           0,
        'nb-lines-input':   0,
        'Rejection-Rate':   '0 %',
        'Job-Duration':     '0 s',
        'process-speed':    '0 lignes/s'
      },
      'rejets': {
        'nb-lines-ignored':         0,
        'nb-lines-duplicate-ecs':   0,
        'nb-lines-ignored-domains': 0,
        'nb-lines-unknown-domains': 0,
        'nb-lines-unknown-format':  0,
        'nb-lines-unqualified-ecs': 0,
        'nb-lines-pkb-miss-ecs':    0,
        'nb-lines-unordered-ecs':   0,
        'url-ignored-domains':      logRoute + '/lines-ignored-domains.log',
        'url-unknown-domains':      logRoute + '/lines-unknown-domains.log',
        'url-unknown-formats':      logRoute + '/lines-unknown-formats.log',
        'url-unqualified-ecs':      logRoute + '/lines-unqualified-ecs.log',
        'url-pkb-miss-ecs':         logRoute + '/lines-pkb-miss-ecs.log',
        'url-duplicate-ecs':        logRoute + '/lines-duplicate-ecs.log',
        'url-unordered-ecs':        logRoute + '/lines-unordered-ecs.log'
      },
      'stats': {
        'platforms': 0,
        'mime-PDF':  0,
        'mime-HTML': 0
      }
    };

    self.jobID         = jobID;
    self.jobPath       = logPath;//temp job directory
    self.report        = new ReportManager(path.join(logPath, '/report.json'), baseReport);
    self.resIsDeferred = options.resIsDeferred || false;
    self.socket        = io.getSocket(req.header('Socket-ID'));
    self.headers       = {
      'Job-ID':                 jobID,
      'Job-Report':             logRoute + '/job-report.json',
      'Job-Traces':             logRoute + '/job-traces.log',
      'Lines-Unknown-Formats':  logRoute + '/lines-unknown-formats.log',
      'Lines-Ignored-Domains':  logRoute + '/lines-ignored-domains.log',
      'Lines-Unknown-Domains':  logRoute + '/lines-unknown-domains.log',
      'Lines-Unqualified-ECs':  logRoute + '/lines-unqualified-ecs.log',
      'Lines-PKB-Miss-ECs':     logRoute + '/lines-pkb-miss-ecs.log',
      'Lines-Duplicate-ECs':    logRoute + '/lines-duplicate-ecs.log',
      'Lines-Unordered-ECs':    logRoute + '/lines-unordered-ecs.log'
    };

    self.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          level: loglevel,
          colorize: 'true'
        }),
        new (winston.transports.File)({
          level: loglevel,
          stream: fs.createWriteStream(path.join(logPath, '/job-traces.log'))
        })
      ]
    });
    self.logger.info('New job with ID: ' + jobID);

    self.logStreams = new StreamHandler()
    .add('unknownFormats', logPath + '/lines-unknown-formats.log')
    .add('ignoredDomains', logPath + '/lines-ignored-domains.log')
    .add('unknownDomains', logPath + '/lines-unknown-domains.log')
    .add('unqualifiedECs', logPath + '/lines-unqualified-ecs.log')
    .add('pkbMissECs',     logPath + '/lines-pkb-miss-ecs.log')
    .add('duplicateECs',   logPath + '/lines-duplicate-ecs.log')
    .add('unorderedECs',   logPath + '/lines-unordered-ecs.log');


    initializer.init(req, res, self.logger, function (err) {
      if (err) {
        self.headers[statusHeader] = err.ezStatus;
        self.headers[msgHeader]    = statusCodes[err.ezStatus];
        self.report.set('general', 'status', err.ezStatus);
        self.report.set('general', 'status-message', statusCodes[err.ezStatus]);
        res.writeHead(err.status, self.headers);
        res.end();
        return;
      }

      res.set(self.headers);
      if (self.socket) { self.socket.emit('headers', self.headers); }

      self.report.set('dedoublonnage', 'activated', self.deduplication.use);
      if (self.deduplication.use) {
        self.report.set('dedoublonnage', 'strategy', self.deduplication.strategy);
        for (var letter in self.deduplication.fieldnames) {
          self.report.set('dedoublonnage', 'fieldname-' + letter,
            self.deduplication.fieldnames[letter]);
        }
        for (var type in self.deduplication.intervals) {
          self.report.set('dedoublonnage', 'window-' + type,
            self.deduplication.intervals[type]);
        }
      }

      start();
    });
  }

  var writeEvent = function (ec) {
    self.writer.write(ec);
    writtenECs = true;
    self.report.inc('general', 'nb-ecs');
  };

  var writeFirstEvent = function (ec) {
    writeFirstEvent = writeEvent;
    writerWasStarted = true;
    res.status(200);

    // Add or remove user fields from those extracted by logParser
    // We can't do it before because logParser needs to process one line to autodetect the format
    var outputFields        = self.outputFields    || {};
    outputFields.added      = outputFields.added   || [];
    outputFields.removed    = outputFields.removed || [];
    self.outputFields.added = outputFields.added.concat(self.logParser.getFields());

    self.writer.start(self.outputFields);
    writeEvent(ec);
  };

  function terminateResponse() {
    // If request ended and no buffer left, terminate the response
    if (writerWasStarted) {
      self.writer.end();
    }
    if (!self.parsedLines) {
      self.logger.warn('No line treated in the request');
      try {
        res.set(statusHeader, 4003);
        res.set(msgHeader, statusCodes['4003']);
        self.report.set('general', 'status', 4003);
        self.report.set('general', 'status-message', statusCodes['4003']);
      } catch (e) {}
      res.status(400);
    }
    self.logger.info("Terminating response");
    self.logger.info(self.report.get('general', 'nb-lines-input') + " lines were read");
    self.logger.info(self.report.get('general', 'nb-ecs') + " ECs were created");

    var closeWinston = function (callback) {
      self.logger.info('Closing trace loggers');
      self.logger.transports.file._stream.on('close', callback);
      self.logger.clear();
    };

    var finalizeReport = function (callback) {
      self.logger.info('Finalizing report file');
      
      self.report.set('general', 'Job-Done', true);

      self.report.finalize(function () {
        self.logger.info('Closing reject log streams');
        self.logStreams.closeAll(function () { closeWinston(callback); });
      }, self.socket);
    };

    finalizeReport(function () {
      res.end();
      if (self.ecsStream) {
        // todo: clear the job from the memory
        //       but have to think when is the best time for that
        //       maybe we should wait as long as the folderreaper ?
        self.ecsStream.end();
        self.ecsStream = null;
      }
    });
  }

  function start() {
    self.logger.info('Starting response');
    self.report.cycle(1, self.socket);
    var request = self.unzipReq ? self.unzipReq : req;
    // var response = self.zipRes ? self.zipRes : res;

    var lineProcessor = new LineProcessor(req);
    lineProcessor.on('ec', function (ec) { writeFirstEvent(ec); });
    lineProcessor.on('end', terminateResponse);

    // function used to handled a log file (a part)
    var partHandlingFunction = function (data, callback) {
      var part = data.part;
      
      // if this is the latest part, tell it to lazy
      if (!part) {
        self.logger.info('Request upload: finished reading all parts');
        lazy.emit('end');
        callback();
        return;
      }
      // Last part is empty and has no filename
      if (part.byteCount) { self.report.set('files', ++nbFiles, part.filename || 'unknown name'); }
      var pipeInputStreamToLazy = function (inputStream, part, cbEndRead) {
        var pressureMaster = new PressureMaster(inputStream);

        self.logStreams.on('saturated', function () {
          pressureMaster.addPressure('loggers');
        });
        self.logStreams.on('drain', function () {
          pressureMaster.removePressure('loggers');
        });

        lineProcessor.on('saturated', function () {
          pressureMaster.addPressure('lineprocessor');
        });
        lineProcessor.on('drain', function () {
          pressureMaster.removePressure('lineprocessor');
        });

        pressureMaster.on('data', function (data) {
          lazy.emit('data', data);
        });
        pressureMaster.on('end', function () {
          self.logger.info('Request upload: finished reading part ' + part.filename);
          cbEndRead();
        });
      };
      
      // check if this part is gzip encoded
      var contentType = (part.headers && part.headers['content-type'])
                        ? part.headers['content-type'] : '';
      var contentEncoding = (part.headers && part.headers['content-encoding'])
                        ? part.headers['content-encoding'] : '';
      var isGzip = [
        'application/gzip',
        'application/x-gzip',
        'application/x-gunzip',
        'application/gzipped',
        'application/gzip-compressed',
        'application/x-compressed',
        'application/x-compress',
        'gzip/document'
      ].indexOf(contentType) != -1 || ['gzip'].indexOf(contentEncoding) != -1;
      
      // only accepted encoding is gzip
      if (contentEncoding && contentEncoding != 'gzip') {
        self.logger.error('Content encoding not supported');
        if (!res.headerSent) {
          res.set(statusHeader, 4005);
          res.set(msgHeader, statusCodes[4005]);
          self.report.set('general', 'status', 4005);
          self.report.set('general', 'status-message', statusCodes[4005]);
          res.status(406);
        }
        res.end();
        callback();
        return;
      }

      if (isGzip) {
        // Gziped
        self.logger.info('Request upload: start reading a gziped encoded part [' +
                    part.filename + '] [' + contentType + ']');
        // it also exists createGunzip, createInflate maybe useful ? ...
        var unzip = require('zlib').createUnzip();
        unzip.on('error', function (err) {
          self.logger.error('Error while unziping request data:' + err);
          if (!res.headerSent) {
            res.set(statusHeader, 4002);
            res.set(msgHeader, statusCodes['4002']);
            self.report.set('general', 'status', 4002);
            self.report.set('general', 'status-message', statusCodes['4002']);
            res.status(400);
          }
          res.end();
          callback();
          return;
        });
        part.pipe(unzip);
        pipeInputStreamToLazy(unzip, part, callback);
        
      } else {
        // Not gziped
        self.logger.info('Request upload: start reading a not encoded part [' +
                    part.filename + '] [' + contentType + ']');
        // PassThrough stream is a workaround because if
        // "part" is directly given to pipeInputStreamToLazy
        // data are strangely not readed
        var PassThrough = require('stream').PassThrough;
        var passthrough = new PassThrough();
        part.pipe(passthrough);
        pipeInputStreamToLazy(passthrough, part, callback);
      }
    };
    // queue to handle parts one by one
    // 1 means that it handles parts one by one ! (no mixed data)
    var partHandlingQueue = async.queue(partHandlingFunction, 1);
    
    if (req.is('multipart/form-data')) {
      // multipart stream handling (ex: HTML multifile form upload)
      self.logger.info('Handling a multipart stream upload');
    
      // to parse multipart data it the HTTP body, we use the multiparty module
      var form = new multiparty.Form({
        autoFiles: false, // input files are not stored in a tmp folder
      });
      form.on('part', function (part) {
        partHandlingQueue.push({ part: part });
      });
      
      form.on('close', function () {
        self.logger.info('Request upload: form closed');
        // tells there is no more part to handle
        partHandlingQueue.push({ part: null });
      });
      form.on('error', function (err) {
        self.logger.error('Request upload: form error [' + err + ']');
        // tells there is no more part to handle
        partHandlingQueue.push({ part: null });
        if (!res.headerSent) {
          res.set(statusHeader, 4007);
          res.set(msgHeader, statusCodes['4007']);
          self.report.set('general', 'status', 4007);
          self.report.set('general', 'status-message', statusCodes['4007']);
          res.status(400);
        }
        res.end();
      });
      // launch the multipart parsing
      form.parse(request);
    } else {
      // handle a not multipart stream: log data are embeded directly in the HTTP body
      self.logger.info('Handling a direct stream upload');
      partHandlingQueue.push({ part: request });
      // tells there is no more part to handle
      partHandlingQueue.push({ part: null });
    }

    // read input stream line by line
    lazy.lines
        .map(String)
        .map(function (line) {
          lineProcessor.push(line);
        });
    lazy.on('end', function () {
      // when the input stream is closed,
      // tell that the response stream can be closed
      self.logger.info('No more data in the request');
      self.endOfRequest = true;
      lineProcessor.drain();
    });
  }

  /**
   * Initiate the job by calling init().
   * Once initialized, the job will automatically start.
   */
  self._run = init;

  /**
   * Tell lazy to stop reading the request
   * Used to stop the job prematurely
   * Should be use only for error cases
   */
  self._stop = function () {
    lazy.emit('end');
  };
};

module.exports = Job;