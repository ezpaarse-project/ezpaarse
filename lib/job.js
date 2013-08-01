'use strict';

var fs            = require('fs');
var path          = require('path');
var Lazy          = require('lazy');
var async         = require('async');
var crypto        = require('crypto');
var mkdirp        = require('mkdirp');
var moment        = require('moment');
var winston       = require('winston');
var multiparty    = require('multiparty');
var config        = require('../config.json');
var ezJobs        = require('../lib/jobs.js');
var statusCodes   = require('../statuscodes.json');
var parserlist    = require('../lib/parserlist.js');
var ReportManager = require('../lib/reportmanager.js');
var StreamHandler = require('../lib/streamhandler.js');
var initializer   = require('../lib/requestinitializer.js');

// process chain
var ECFilter      = require('../lib/ecfilter.js');
var ECBuffer      = require('../lib/ecbuffer.js');
var ECParser      = require('../lib/ecparser.js');
var Deduplicator  = require('../lib/deduplicator.js');
var Enhancer      = require('../lib/enhancer.js');
var FieldSplitter = require('../lib/fieldsplitter.js');
var Organizer     = require('../lib/organizer.js');

/**
 * Create a Job instance that handles the entire process
 */
var Job = function (req, res, jobID, options) {
  var self      = this;
  req._jobID    = jobID;
  ezJobs[jobID] = self;
  options       = options || {};

  var loggersAreSaturated = false;
  var ecParserIsSaturated = false;
  var endOfRequest        = false;
  var writerWasStarted    = false;
  var parsedLines         = false;
  var writtenECs          = false;
  var badBeginning        = false;
  var statusHeader        = 'ezPAARSE-Status';
  var msgHeader           = 'ezPAARSE-Status-Message';
  var ecNumber            = 0;

  function init() {
    
    var logRoute = req.ezBaseURL + '/' + jobID;
    var loglevel = req.header('Traces-Level') || options.defaultTracesLevel || 'info';
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
    self.socket        = options.socket;
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
  }

  var writeFirstEvent = function (ec) {
    writeFirstEvent  = writeEvent;
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
  }

  function terminateResponse() {
    // If request ended and no buffer left, terminate the response
    if (writerWasStarted) {
      self.writer.end();
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
    }

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
    var request   = self.unzipReq ? self.unzipReq : req;
    var response  = self.zipRes   ? self.zipRes   : res;

    var logParser       = self.logParser;
    var ecFilter        = new ECFilter();
    var ecBuffer        = new ECBuffer(100);
    var ecParser        = new ECParser(self.logger, self.logStreams, self.report);
    var ecOrganizer1    = new Organizer();
    var ecDeduplicator  = new Deduplicator(self.deduplication);
    var ecEnhancer      = new Enhancer(self.logger, self.logStreams, self.report);
    var ecFieldSplitter = new FieldSplitter(self.ufSplitters);
    var ecOrganizer2    = new Organizer();
    var writer          = self.writer;

    ecBuffer.on('packet', ecParser.push);
    ecBuffer.on('drain', function () {
      if (endOfRequest) { ecParser.drain(); }
    });
    ecParser.on('ec', ecOrganizer1.push);
    ecParser.on('drain', function () {
      if (endOfRequest) {
        if (!self.deduplication.use) { ecOrganizer2.setLast(ecNumber); }
        ecDeduplicator.drain();
      }
    });
    ecOrganizer1.on('ec', function (ec) {
      if (self.deduplication.use) { ecDeduplicator.push(ec); }
      else                       { ecEnhancer.push(ec); }
    });
    ecDeduplicator.on('unique', ecEnhancer.push);
    ecDeduplicator.on('duplicate', function (ec) {
      self.report.inc('rejets', 'nb-lines-duplicate-ecs');
      self.logger.silly('Duplicate EC, not written');
      self.logStreams.write('duplicateECs', ec._meta.originalLine + '\n');
      ecOrganizer2.skip(ec._meta.lineNumber);
    });
    ecDeduplicator.on('error', function (err, ec) {
      self.logger.verbose('A log line is not chronological : ' + ec._meta.originalLine);
      self.report.set('general', 'status', 4014);
      self.report.set('general', 'status-message', statusCodes['4014']);
      self.report.inc('rejets', 'nb-lines-unordered-ecs');
      self.logStreams.write('unorderedECs', ec._meta.originalLine + '\n');
    });
    ecDeduplicator.on('drain', function (last) {
      if (self.deduplication.use) { ecOrganizer2.setLast(last); }
    });
    ecEnhancer.on('ec', function (ec) {
      ecFieldSplitter.split(ec);

      if (ec._isQualified()) {
        ecOrganizer2.push(ec);
      } else {
        ecOrganizer2.skip(ec._meta.lineNumber);
        self.logger.silly('Unqualified EC, not written');
        self.logStreams.write('unqualifiedECs', ec._meta.originalLine + '\n');
        self.report.inc('rejets', 'nb-lines-unqualified-ecs');
      }
    });
    ecOrganizer2.on('ec', function (ec) {
      writeFirstEvent(ec);
      // count masters values for reporting
      if (!self.report.get('stats', 'platform-' + ec.platform)) {
        self.report.inc('stats', 'platforms');
      }
      self.report.inc('stats', 'platform-' + ec.platform);
      if (ec.rtype) { self.report.inc('stats', 'rtype-' + ec.rtype); }
      if (ec.mime)  { self.report.inc('stats', 'mime-' + ec.mime); }
    });
    ecOrganizer2.on('drain', function () {
      terminateResponse();
    });

    var processLine = function (line) {
      if (badBeginning) {
        return;
      }
      line   = line.trim();
      var ec = logParser.parse(line);
      
      if (ec) {
        parsedLines = true;
        if (ecFilter.isValid(ec)) {
          if (config.EZPAARSE_IGNORED_DOMAINS.indexOf(ec.domain) === -1) {
            if (ec.host && self.anonymize.host) {
              ec.host = crypto.createHash(self.anonymize.host).update(ec.host).digest("hex");
            }
            if (ec.login && self.anonymize.login) {
              ec.login = crypto.createHash(self.anonymize.login).update(ec.login).digest("hex");
            }
            var parser = parserlist.get(ec.domain);
            if (parser) {
              ec._meta.originalLine = line;
              ec._meta.lineNumber   = ++ecNumber;
              ec.platform           = parser.platform;
              ecBuffer.push(ec, parser);
            } else {
              self.logger.silly('No parser found for : ' + ec.domain);
              self.logStreams.write('unknownDomains', line + '\n');
              self.report.inc('rejets', 'nb-lines-unknown-domains');
            }
          } else {
            self.logger.silly('The domain is ignored');
            self.logStreams.write('ignoredDomains', line + '\n');
            self.report.inc('rejets', 'nb-lines-ignored-domains');
          }
        } else {
          self.logger.silly('Line was ignored');
          self.report.inc('rejets', 'nb-lines-ignored');
        }
      } else {
        self.logger.silly('Line format was not recognized');
        self.logStreams.write('unknownFormats', line + '\n');
        self.report.inc('rejets', 'nb-lines-unknown-format');
        if (!parsedLines) {
          badBeginning = true;
          lazy.emit('end');
          self.logger.warn('Couldn\'t recognize first line : aborted.', {line: line});
        }
      }
      self.report.inc('general', 'nb-lines-input');
    }

    var processFirstLine = function (line) {
      processFirstLine = processLine;
      processLine(line);
      self.report.set('general', 'first-line', line);
      self.report.set('general', 'format-regex',
        logParser.getRegexp() || 'not found, build or auto-recognition failed');
    };

    // to handle stream spliting line by line
    var lazy = new Lazy();
    var nbFiles = 0;

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
        var data = '';
        
        self.logStreams.on('saturated', function () {
          loggersAreSaturated = true;
        });
        self.logStreams.on('drain', function () {
          loggersAreSaturated = false;
          if (!ecParserIsSaturated) {
            data = inputStream.read();
            if (data) {
              self.logger.silly('Request upload: reading data ' + part.filename + ' (drain)');
              lazy.emit('data', data);
            }
          }
        });

        ecParser.on('saturated', function () {
          ecParserIsSaturated = true;
        });
        ecParser.on('drain', function () {
          if (!endOfRequest) {
            ecParserIsSaturated = false;
            if (!self.loggersAreSaturated) {
              var data = inputStream.read();
              if (data) {
                self.logger.silly('Request upload: reading data ' + part.filename + ' (drain)');
                lazy.emit('data', data);
              }
            }
          }
        });

        inputStream.on('readable', function () {
          if (!ecParserIsSaturated && !self.loggersAreSaturated) {
            data = inputStream.read();
            if (data) {
              self.logger.silly('Request upload: reading data ' + part.filename + ' (readable)');
              lazy.emit('data', data);
            }
          }
        });
        inputStream.on('end', function () {
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
    }
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
          processFirstLine(line);
        });
    lazy.on('end', function () {
      // when the input stream is closed,
      // tell that the response stream can be closed
      self.logger.info('No more data in the request');
      endOfRequest = true;
      if (!parsedLines) {
        self.logger.warn('No line treated in the request');
        try {
          res.set(statusHeader, 4003);
          res.set(msgHeader, statusCodes['4003']);
          self.report.set('general', 'status', 4003);
          self.report.set('general', 'status-message', statusCodes['4003']);
        } catch (e) {}
        res.status(400);
        res.end();
      } else {
        ecBuffer.drain();
      }
    });
  }

  self._run = function () {
    init();
  };
};

module.exports = Job;