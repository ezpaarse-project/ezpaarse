'use strict';

var fs             = require('graceful-fs');
var path           = require('path');
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
var io             = require('./socketio.js').io;
var PressureMaster = require('./pressuremaster.js');
var ReportManager  = require('./reportmanager.js');
var StreamHandler  = require('./streamhandler.js');
var LinesProcessor = require('./lineprocessor.js');
var Splitter       = require('./splitter.js').Splitter;

var predefFile = path.join(__dirname, '../resources/predefined-settings.json');

/**
 * Create a Job instance that handles the entire process
 */
var Job = function (req, res, jobID, options) {
  var self      = this;
  req._jobID    = jobID;
  ezJobs[jobID] = self;
  options       = options || {};

  io().to('admin').emit('jobs', Object.keys(ezJobs));

  function deleteJob() {
    delete ezJobs[jobID];
    io().to('admin').emit('jobs', Object.keys(ezJobs));
  }

  var writerStarted       = false;
  var deniedWriterStarted = false;
  var writtenECs          = false;
  var statusHeader        = 'ezPAARSE-Status';
  var msgHeader           = 'ezPAARSE-Status-Message';
  var nbFiles             = 0;

  // to read the input stream line by line
  var splitter       = new Splitter();
  var pressureMaster = new PressureMaster(splitter);

  /**
   * Check if predefined settings are requested and override the headers
   */
  function setPredefSettings(callback) {
    var predefKey = req.get('ezPAARSE-Predefined-Settings');

    if (!predefKey) { return callback(); }

    fs.readFile(predefFile, function (err, content) {
      if (err) { return callback(err); }

      var predef;
      try {
        predef = JSON.parse(content)[predefKey];
      } catch (e) {
        return callback(e);
      }

      if (predef && predef.headers) {
        for (var name in predef.headers) {
          if (!req.headers.hasOwnProperty(name)) {
            req.headers[name.toLowerCase()] = predef.headers[name];
          }
        }
      }

      callback();
    });
  }

  /**
   * Define all job parameters and call start()
   */
  function init() {

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
        'nb-lines-unordered-ecs':   0,
        'nb-lines-ignored-hosts':   0,
        'nb-lines-robots-ecs':      0,
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
      'unordered-ecs',
      'filtered-ecs',
      'ignored-hosts',
      'robots-ecs'
    ];

    var rejectHeader = (req.header('Reject-Files') || '').toLowerCase();
    var rejects;

    if (rejectHeader == 'all') {
      rejects = rejectList;
    } else {
      rejects = rejectHeader.split(',').map(function (reject) { return reject.trim(); });
    }

    var reject;
    for (var i = rejects.length - 1; i >= 0; i--) {
      reject = rejects[i].trim();
      if (rejectList.indexOf(reject) == -1) {
        rejects.splice(i, 1);
      } else {
        baseReport.rejets['url-' + reject] = logRoute + '/lines-' + reject + '.log';
      }
    }

    self.rejects       = rejects;
    self.jobID         = jobID;
    self.shortID       = jobID.substr(0, 8);
    self.jobPath       = logPath;//temp job directory
    self.socket        = io().sockets.connected[req.header('Socket-ID')];
    self.report        = new ReportManager(path.join(logPath, '/report.json'), {
      baseReport: baseReport,
      socket: self.socket,
      updateThrottle: 1000,
      writeThrottle: 4000
    });
    self.resIsDeferred = options.resIsDeferred || false;
    self.aborted       = false;
    self.cleanOnly     = (req.header('clean-only') || '').toLowerCase() == 'true';
    self.filterRedirs  = (req.header('ezpaarse-filter-redirects')||'true').toLowerCase() == 'true';
    self.outputFields  = { added: [], removed: [] };
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
      'Lines-Unordered-ECs':    logRoute + '/lines-unordered-ecs.log',
      'Lines-Filtered-ECs':     logRoute + '/lines-filtered-ecs.log',
      'Lines-Ignored-Hosts':    logRoute + '/lines-ignored-hosts.log',
      'Lines-Robots-ECs':       logRoute + '/lines-robots-ecs.log'
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
    self.logger.info('New job with ID: %s', jobID);

    self.logStreams = new StreamHandler();
    self.rejects.forEach(function (reject) {
      self.logStreams.add(reject, logPath + '/lines-' + reject + '.log');
    });

    fs.readdir(path.join(__dirname, 'init'), function (err, files) {
      if (err) {
        return closeStreams(function () {
          res.status(500).end();
          deleteJob();
        });
      }

      var initializer = new Stackware();

      files.forEach(function (initFile) {
        var initFunction = require(path.join(__dirname, 'init', initFile));
        initializer.use(initFunction);
      });

      initializer.use(function (req, res, job, next) {
        var mwDir   = path.join(__dirname, '/middlewares');
        var mwNames = config.EZPAARSE_MIDDLEWARES;

        job.middlewares = [];
        job.saturated   = new Set();

        var i = 0;
        (function loadNext() {
          var mwName = mwNames[i++];
          if (!mwName) { return next(); }

          var saturate = function () {
            job.saturated.add(mwName);
            pressureMaster.addPressure('job');
          };
          var drain = function () {
            job.saturated.delete(mwName);
            if (job.saturated.size === 0) { pressureMaster.removePressure('job'); }
          };

          var mw = require(path.join(mwDir, mwName + '.js'))(req, res, job, saturate, drain);

          if (mw instanceof Promise) {
            mw.then(function (m) {
              job.middlewares.push(m);
              loadNext();
            }).catch(function (err) {
              next(err);
            });
          } else if (mw instanceof Error) {
            next(mw);
          } else {
            job.middlewares.push(mw);
            loadNext();
          }
        })();
      });

      initializer.use(function errorHandler(err, req, res, job, next) {
        var ezCode = self.headers[statusHeader] = err.code;
        var msg    = self.headers[msgHeader]    = err.message || statusCodes[ezCode];

        self.report.set('general', 'status', ezCode);
        self.report.set('general', 'status-message', msg);

        if (self.socket) { self.socket.emit('joberror', ezCode, msg); }

        res.writeHead(err.status || 500, self.headers);
        closeStreams(function () {
          res.end();
          deleteJob();
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
      if (self.socket) { self.socket.emit('joberror', 4003, statusCodes['4003']); }
      res.status(400);
    }

    var reports = self.counterReporter.getReports(self.counterFormat);
    for (var type in reports) {
      fs.writeFileSync(path.join(self.jobPath, type + '.' + self.counterFormat), reports[type]);
    }

    self.report.set('general', 'Job-Done', true);
    self.logger.info("Terminating response");
    self.logger.info("%d lines were read", self.report.get('general', 'nb-lines-input'));
    self.logger.info("%d ECs were created", self.report.get('general', 'nb-ecs'));

    var totalLines     = self.report.get('general', 'nb-lines-input');
    var ignoredLines   = self.report.get('rejets', 'nb-lines-ignored');
    var pertinentLines = totalLines - ignoredLines;

    if (pertinentLines > self.alertConfig.activationThreshold) {
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
          deleteJob();
        });
      }, self.socket);
    };

    // If an email is requested
    if (!self.notifications.mail.length || !config.EZPAARSE_ADMIN_MAIL) {
      return finalize();
    }

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
   * Read request stream and send lines to linesProcessor
   * Write the resulting ECs and terminate response using the functions above
   */
  function start() {

    self.logger.info('Starting response');
    req.on('close', function () { self._stop(); });

    var linesProcessor = new LinesProcessor(self);

    linesProcessor.on('ec', writeEvent);
    linesProcessor.on('denied', writeDeniedEvent);
    linesProcessor.on('end', terminateResponse);

    pressureMaster.watch(self.writer, 'writer');
    pressureMaster.watch(self.deniedWriter, 'deniedWriter');
    pressureMaster.watch(self.logStreams, 'loggers');
    pressureMaster.watch(linesProcessor, 'lineprocessor');

    var uploadError = function (err, code, status) {
      var codeString = code.toString();

      if (self.aborted) { return; }

      self.logger.error('Upload error [%s]', err.message);
      // tells there is no more part to handle
      partHandlingQueue.push(null);

      if (!res.headersSent) {
        res.set(statusHeader, code);
        res.set(msgHeader, statusCodes[codeString]);
        res.status(status || 400);
      }

      self.report.set('general', 'status', code);
      self.report.set('general', 'status-message', statusCodes[codeString]);
      self._stop();

      if (self.socket) { self.socket.emit('joberror', code, statusCodes[codeString]); }
    };

    // queue to handle parts one by one
    // 1 means that it handles parts one by one ! (no mixed data)
    var partHandlingQueue = async.queue(function handlePart(part, callback) {

      // if this is the last part, close the splitter
      if (!part) {
        self.logger.info('Upload: finished reading all parts');
        splitter.end();
        return callback();
      }

      part.on('error', function (err) {
        uploadError(err, 4007);
      });

      // Last part is empty and has no filename
      if (part.byteCount) { self.report.set('files', ++nbFiles, part.filename || 'unknown name'); }

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
        uploadError(new Error('Content encoding not supported'), 4005, 406);
        return callback();
      }

      var stream = part;

      self.logger.info('Reading a new part [%s][%s]',
        part.filename || 'N/A', contentType || 'N/A');

      if (isGzip) {
        self.logger.info('Part detected as GZIP');

        var unzip = require('zlib').createUnzip();

        unzip.on('error', function (err) {
          uploadError(new Error('Error while unziping request data:' + err), 4002, 400);
        });

        stream = part.pipe(unzip);
      }

      stream.on('end', function () {
        self.logger.info('Finished reading part [%s]', part.filename);
        callback();
      });

      stream.pipe(iconv.decodeStream(self.inputCharset)).pipe(splitter, { end: false });
    }, 1);

    if (is(req, ['multipart/form-data'])) {
      // multipart stream handling (ex: HTML multifile form upload)
      self.logger.info('Handling a multipart stream upload');

      // to parse multipart data it the HTTP body, we use the multiparty module
      var form = new multiparty.Form({
        autoFiles: false, // input files are not stored in a tmp folder
      });
      form.on('part', function (part) {
        partHandlingQueue.push(part);
      });

      form.on('close', function () {
        self.logger.info('Upload: form closed');
        // tells there is no more part to handle
        partHandlingQueue.push(null);
      });
      form.on('error', function (err) {
        uploadError(err, 4007);
      });
      // launch the multipart parsing
      form.parse(req);
    } else {
      // handle a not multipart stream: log data are embeded directly in the HTTP body
      self.logger.info('Handling a direct stream upload');
      partHandlingQueue.push(req);
      // tells there is no more part to handle
      partHandlingQueue.push(null);
    }

    // read input stream line by line
    splitter.on('readable', function () {
      var line;
      while (null != (line = splitter.read())) {
        if (line) { linesProcessor.push(line); }
      }
    });

    splitter.on('error', function (err) {
      uploadError(err, err.code == 'ENOBREAKS' ? 4022 : 5000);
    });

    splitter.on('end', function () {
      // when the input stream is closed,
      // tell that the response stream can be closed
      self.logger.info('No more data in the request');
      self.endOfRequest = true;
      linesProcessor.drain();
    });
  }

  /**
   * Initiate the job by getting eventual predefined settings and calling init().
   * Once initialized, the job will automatically start.
   */
  self._run = function () {
    setPredefSettings(function (err) {
      if (err) {
        res.status(500).end();
      } else {
        init();
      }
    });
  };

  /**
   * Stop the splitter
   * Used to stop the job prematurely
   * Should be use only for error cases
   */
  self._stop = function () {
    if (!self.aborted) {
      self.aborted = true;
      splitter.end();
    }
  };
};

module.exports = Job;
