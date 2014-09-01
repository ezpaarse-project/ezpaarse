'use strict';

var fs             = require('graceful-fs');
var path           = require('path');
var Lazy           = require('lazy');
var async          = require('async');
var is             = require('type-is');
var iconv          = require('iconv-lite');
var mkdirp         = require('mkdirp');
var moment         = require('moment');
var winston        = require('winston');
var multiparty     = require('multiparty');
var Stackware      = require('stackware');
var config         = require('./config.js');
var statusCodes    = require('../statuscodes.json');
var pkg            = require('../package.json');
var ezJobs         = require('./jobs.js');
var mailer         = require('./mailer.js');
var io             = require('./socketio.js');
var PressureMaster = require('./pressuremaster.js');
var ReportManager  = require('./reportmanager.js');
var StreamHandler  = require('./streamhandler.js');
var LineProcessor  = require('./lineprocessor.js');

var predefSettings = require('../predefined-settings.json');

/**
 * Create a Job instance that handles the entire process
 */
var Job = function (req, res, jobID, options) {
  var self      = this;
  req._jobID    = jobID;
  ezJobs[jobID] = self;
  options       = options || {};

  // Remove the job from memory when response is closed
  res.on('finish', function () { delete ezJobs[jobID]; });

  var writerStarted       = false;
  var deniedWriterStarted = false;
  var writtenECs          = false;
  var statusHeader        = 'ezPAARSE-Status';
  var msgHeader           = 'ezPAARSE-Status-Message';
  var nbFiles             = 0;

  // to read the input stream line by line
  var lazy = new Lazy();

  /**
   * Define all job parameters and call start()
   */
  function init() {

    // Fill request headers with predefined settings if any
    var predef = predefSettings[req.get('ezPAARSE-Predefined-Settings')];
    if (predef && predef.headers) {
      for (var name in predef.headers) {
        if (!req.headers.hasOwnProperty(name)) {
          req.headers[name.toLowerCase()] = predef.headers[name];
        }
      }
    }

    var logRoute = req.ezBaseURL + '/' + jobID;
    var loglevel = req.header('Traces-Level')
                 || (config.EZPAARSE_ENV == 'production' ? 'info' : 'verbose');
    var logPath  = path.join(__dirname, '/../tmp/jobs/', jobID.charAt(0), jobID.charAt(1), jobID);
    mkdirp.sync(logPath);

    var baseReport = {
      'general': {
        'ezPAARSE-version': pkg.name + ' ' + pkg.version,
        'Job-ID':           jobID,
        'Job-Date':         moment().format(),
        'Job-Done':         false,
        'result-file-ecs':  logRoute,
        'URL-Traces':       logRoute + '/job-traces.log',
        'nb-ecs':           0,
        'nb-denied-ecs':    0,
        'nb-lines-input':   0,
        'Rejection-Rate':   '0 %',
        'Job-Duration':     '0 s',
        'process-speed':    '0 lignes/s',
        'client-user-agent': req.headers['user-agent']
      },
      'rejets': {
        'nb-lines-ignored':         0,
        'nb-lines-duplicate-ecs':   0,
        'nb-lines-ignored-domains': 0,
        'nb-lines-unknown-domains': 0,
        'nb-lines-unknown-formats': 0,
        'nb-lines-unqualified-ecs': 0,
        'nb-lines-pkb-miss-ecs':    0,
        'nb-lines-unordered-ecs':   0
      },
      'stats': {
        'platforms': 0,
        'mime-PDF':  0,
        'mime-HTML': 0
      }
    };


    var rejectList = [
      'ignored-domains',
      'unknown-domains',
      'unknown-formats',
      'unqualified-ecs',
      'pkb-miss-ecs',
      'duplicate-ecs',
      'unordered-ecs'
    ];
    var rejects = req.header('Reject-Files');
    rejects     = rejects ? rejects.toLowerCase().split(',') : rejectList;

    var reject;
    for (var i = rejects.length - 1; i >= 0; i--) {
      reject = rejects[i];
      if (rejectList.indexOf(reject) == -1) {
        rejects.splice(i, 1);
      } else {
        baseReport.rejets['url-' + reject] = logRoute + '/lines-' + reject + '.log';
      }
    }

    var bufferSize = parseInt(req.header('ezpaarse-buffer-size'));

    self.rejects       = rejects;
    self.jobID         = jobID;
    self.jobPath       = logPath;//temp job directory
    self.report        = new ReportManager(path.join(logPath, '/report.json'), baseReport);
    self.resIsDeferred = options.resIsDeferred || false;
    self.aborted       = false;
    self.socket        = io.getSocket(req.header('Socket-ID'));
    self.cleanOnly     = (req.header('clean-only') || '').toLowerCase() == 'true';
    self.bufferSize    = isNaN(bufferSize) ? 100 : bufferSize;
    self.noEnrich      = (req.header('ezpaarse-enrich') || '').toLowerCase() == 'false';
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
          colorize: true,
          timestamp: true
        }),
        new (winston.transports.File)({
          level: loglevel,
          stream: fs.createWriteStream(path.join(logPath, '/job-traces.log'))
        }),
        new (winston.transports.IOLogger)({
          level: loglevel,
          socket: self.socket
        })
      ]
    });
    self.logger.info('New job with ID: ' + jobID);

    self.logStreams = new StreamHandler();
    self.rejects.forEach(function (reject) {
      self.logStreams.add(reject, logPath + '/lines-' + reject + '.log');
    });

    fs.readdir(path.join(__dirname, 'init'), function (err, files) {
      if (err) {
        closeStreams(function () {
          res.send(500);
        });
        return;
      }
      var initializer = new Stackware();

      files.forEach(function (initFile) {
        var middleware = require(path.join(__dirname, 'init', initFile));
        initializer.use(middleware);
      });

      initializer.use(function errorHandler(err, req, res, job, next) {
        self.headers[statusHeader] = err[1];
        self.headers[msgHeader]    = statusCodes[err[1]];
        self.report.set('general', 'status', err[1]);
        self.report.set('general', 'status-message', statusCodes[err[1]]);
        self.socket.emit('joberror', err[1], statusCodes[err[1]]);
        res.writeHead(err[0], self.headers);
        closeStreams(function () {
          res.end();
        });
      });

      initializer.use(function () {
        // Add URL of denied ECs to headers and report
        // we can't do it before because we need the extension
        self.headers['Denied-ECs'] = logRoute + '/denied-ecs.' + self.fileExtension;
        self.report.set('general', 'url-denied-ecs', self.headers['Denied-ECs']);

        // Define writer charset using the one we get in the header
        self.writer.charset = self.outputCharset;

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

      initializer.process(req, res, self);
    });
  }

  /**
   * Write an EC using the writer
   * @param  {Object} ec
   */
  var writeEvent = function (ec) {
    if (!writerStarted) {
      writerStarted = true;
      res.status(200);
      self.writer.writeHead(self.outputFields);

      for (var prop in ec) {
        self.report.set('first_event', prop, ec[prop]);
      }
    }

    self.writer.write(ec);
    writtenECs = true;
    self.report.inc('general', 'nb-ecs');
  };

  /**
   * Write a denied EC using the writer
   * @param  {Object} ec
   */
  var writeDeniedEvent = function (ec) {
    if (!deniedWriterStarted) {
      deniedWriterStarted = true;
      self.deniedWriter.writeHead(self.outputFields);
    }

    self.deniedWriter.write(ec);
    self.report.inc('general', 'nb-denied-ecs');
  };

  /**
   * Close all streams, finalize report and close response
   */
  function terminateResponse() {
    // If request ended and no buffer left, terminate the response
    if (writerStarted)       { self.writer.writeEnd(); }
    if (deniedWriterStarted) { self.deniedWriter.writeEnd(); }

    if (!self.parsedLines) {
      self.logger.warn('No line treated in the request');
    }
    if (self.badBeginning) {
      if (!res.headersSent) {
        res.set(statusHeader, 4003);
        res.set(msgHeader, statusCodes['4003']);
      }
      self.report.set('general', 'status', 4003);
      self.report.set('general', 'status-message', statusCodes['4003']);
      self.socket.emit('joberror', 4003, statusCodes['4003']);
      res.status(400);
    }

    var reports = self.counterReporter.getReports(self.counterFormat);
    for (var type in reports) {
      fs.writeFileSync(path.join(self.jobPath, type + '.' + self.counterFormat), reports[type]);
    }

    self.report.set('general', 'Job-Done', true);
    self.logger.info("Terminating response");
    self.logger.info(self.report.get('general', 'nb-lines-input') + " lines were read");
    self.logger.info(self.report.get('general', 'nb-ecs') + " ECs were created");

    var totalLines     = self.report.get('general', 'nb-lines-input');
    var ignoredLines   = self.report.get('rejets', 'nb-lines-ignored');
    var pertinentLines = totalLines - ignoredLines;

    if (pertinentLines > config.EZPAARSE_ALERTS.activationThreshold) {
      // Looks for alerts
      self.notifiers['unknown-domains'].alerts(self);
      self.notifiers['missing-title-ids'].alerts(self);

      self.alerts.forEach(function (alert, index) {
        self.report.set('alerts', 'alert-' + (index + 1), alert);
      });
    }

    var finalize = function () {
      self.logger.info('Finalizing report file');
      self.report.finalize(function () {
        closeStreams(function () {
          res.end();
        });
      }, self.socket);
    };

    // If an email is requested
    if (self.notifications.mail.length && config.EZPAARSE_ADMIN_MAIL) {
      var locals = {
        job: self,
        ezBaseURL: req.ezBaseURL
      };
      mailer.generate('job-notification', locals, function (err, html, text) {
        if (err) {
          self.report.set('notifications', 'mail-status', 'fail');
          finalize();
          return;
        }

        mailer.mail()
          .subject('[ezPAARSE] Your job is completed')
          .html(html)
          .text(text)
          .from(config.EZPAARSE_ADMIN_MAIL)
          .to(self.notifications.mail.join(','))
          .attach('report.json', JSON.stringify(self.report.getJson(), null, 2))
          .send(function (err) {
            self.report.set('notifications', 'mail-status', err ? 'fail' : 'success');
            finalize();
          });
      });
    } else {
      finalize();
    }
  }

  /**
   * Close all stream objects in the job
   */
  function closeStreams(callback) {
    var stack = new Stackware();

    stack.use(function closeRejects(next) {
      self.logger.info('Closing reject log streams');
      self.logStreams.closeAll(next);
    });

    stack.use(function closeDenied(next) {
      self.logger.info('Closing denied stream');
      if (self.deniedStream) {
        self.deniedStream.end(next);
      } else {
        next();
      }
    });

    stack.use(function closeMainStream(next) {
      self.logger.info('Closing result stream');
      if (self.ecsStream) {
        self.ecsStream.end(function () {
          self.ecsStream = null;
          next();
        });
      } else {
        next();
      }
    });

    stack.use(function closeWinston(next) {
      self.logger.info('Closing trace loggers');

      if (self.logger.transports.file) {
        self.logger.transports.file._stream.on('close', next);
      } else {
        next();
      }
      self.logger.clear();
    });


    stack.use(function errorHandler(err, next) { callback(); });
    stack.use(function () { callback(); });
    stack.process();
  }

  /**
   * Read request stream and send lines to lineProcessor
   * Write the resulting ECs and terminate response using the functions above
   */
  function start() {

    self.logger.info('Starting response');
    self.report.cycle(1, self.socket);
    var request = self.unzipReq ? self.unzipReq : req;
    // var response = self.zipRes ? self.zipRes : res;
    request.on('close', function () { self._stop(); });

    var lineProcessor = new LineProcessor(req);

    lineProcessor.on('ec', writeEvent);
    lineProcessor.on('denied', writeDeniedEvent);
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

        pressureMaster.watch(self.writer, 'writer');
        pressureMaster.watch(self.deniedWriter, 'deniedWriter');
        pressureMaster.watch(self.logStreams, 'loggers');
        pressureMaster.watch(lineProcessor, 'lineprocessor');

        pressureMaster.on('data', function (data) {
          lazy.emit('data', iconv.decode(data, self.inputCharset));
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
        if (!res.headersSent) {
          res.set(statusHeader, 4005);
          res.set(msgHeader, statusCodes[4005]);
          res.status(406);
        }
        self.report.set('general', 'status', 4005);
        self.report.set('general', 'status-message', statusCodes[4005]);
        self._stop();
        self.socket.emit('joberror', 4005, statusCodes['4005']);
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
          if (!res.headersSent) {
            res.set(statusHeader, 4002);
            res.set(msgHeader, statusCodes['4002']);
            res.status(400);
          }
          self.report.set('general', 'status', 4002);
          self.report.set('general', 'status-message', statusCodes['4002']);
          self._stop();
          self.socket.emit('joberror', 4002, statusCodes['4002']);
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

    if (is(req, ['multipart/form-data'])) {
      console.log('MULTIPART');
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
        if (!self.aborted) {
          self.logger.error('Request upload: form error [' + err + ']');
          // tells there is no more part to handle
          partHandlingQueue.push({ part: null });
          if (!res.headersSent) {
            res.set(statusHeader, 4007);
            res.set(msgHeader, statusCodes['4007']);
            res.status(400);
          }
          self.report.set('general', 'status', 4007);
          self.report.set('general', 'status-message', statusCodes['4007']);
          self._stop();
          self.socket.emit('joberror', 4007, statusCodes['4007']);
        }
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
    if (!self.aborted) {
      self.aborted = true;
      lazy.emit('end');
    }
  };
};

module.exports = Job;
