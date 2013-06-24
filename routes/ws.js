/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs            = require('fs');
var Lazy          = require('lazy');
var uuid          = require('uuid');
var path          = require('path');
var mime          = require('mime');
var async         = require('async');
var crypto        = require('crypto');
var moment        = require('moment');
var mkdirp        = require('mkdirp');
var stream        = require('stream');
var winston       = require('winston');
var multiparty    = require('multiparty');
var config        = require('../config.json');
var ECFilter      = require('../lib/ecfilter.js');
var ECHandler     = require('../lib/echandler.js');
var statusCodes   = require('../statuscodes.json');
var initializer   = require('../lib/requestinitializer.js');
var ReportManager = require('../lib/reportmanager.js');
var StreamHandler = require('../lib/streamhandler.js');
var rgf           = require('../lib/readgrowingfile.js');
var uuidRegExp    = /^\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/?$/;

module.exports = function (app, domains, ignoredDomains) {

  /**
   * Route used for deferred ECs downloads
   * ?filename=myname can be used to force a specific filename for the download
   * Example: /3e167f80-aa9f-11e2-b9c5-c7c7ad0be3cd
   */
  app.get(uuidRegExp, function (req, res) {
    var rid  = req.params[0];
    var name = req.query.filename ? req.query.filename : rid;

    // check if this job exists
    if (app.ezJobs[rid] && app.ezJobs[rid].ecsPath && app.ezJobs[rid].ecsStream) {
      console.log('Serving growing result file');
      var ext = mime.extension(app.ezJobs[rid].contentType);
      res.writeHead(200, {
        'Content-Type': app.ezJobs[rid].contentType,
        'Content-Disposition': 'attachment; filename="' + name + '.' + ext + '"'
      });

      console.log('Requesting deferred result ECs file (while response is generated)');
      // if job is still running (ECs are still writen in the temp file)
      // use the GrowingFile module to stream the result to the HTTP response
      rgf.readGrowingFile({
        sourceFilePath: app.ezJobs[rid].ecsPath,
        onData: function (data) {
          console.log('Data added to ECs temp file (' + data.length + ' bytes)');
          res.write(data);
        },
        isStillGrowing: function () {
          return !app.ezJobs[rid].ecsStreamEnd;
        },
        lastByteOfFile: function () {
          return app.ezJobs[rid].byteWriten;
        },
        endCallback: function () {
          console.log('ECs temp file completed');
          res.end();
        }
      });
    } else {
      console.log('Serving full result file');
      var jobDir = path.join(__dirname, '/../tmp/jobs/', rid.charAt(0), rid.charAt(1), rid);
      if (!fs.existsSync(jobDir)) {
        res.status(404);
        res.end();
        return;
      }
      fs.readdir(jobDir, function (err, files) {
        if (err) {
          res.status(500);
          res.end();
        }
        var reg = /^job-ecs\.([a-z]+)$/;
        var filename;
        for (var i in files) {
          filename = files[i];
          
          if (reg.test(filename)) {
            var ext = filename.split('.').pop();

            res.writeHead(200, {
              'Content-Type': mime.lookup(ext),
              'Content-Disposition': 'attachment; filename="' + name + '.' + ext + '"'
            });
            fs.createReadStream(path.join(jobDir, filename)).pipe(res);
            return;
          }
        }
        res.status(404);
        res.end();
      });
    }
  });

  /**
   * POST data to ezPAARSE
   * two way to start a job:
   *  - POST data on /
   *  - PUT  data on /:uuid
   *  - POST data on /:uuid?_METHOD=PUT
   * Notice: resIsDeferred = true means that the result will be stored in a
   * tmp file to make possible a deferred download
   */
  app.post('/', function (req, res) {
    var ezRID = uuid.v1();
    app.ezJobs[ezRID] = { resIsDeferred: false };
    startEzpaarseJob(req, res, ezRID);
  });
  app.put(uuidRegExp, function (req, res) {
    var ezRID = req.params[0];
    app.ezJobs[ezRID] = { resIsDeferred: true };
    startEzpaarseJob(req, res, ezRID);
  });
  // this route is useful because sometime PUT is not allowed by reverse proxies
  // PUT is replaced by a POST with a _METHOD=PUT as a query
  app.post(uuidRegExp, function (req, res) {
    var ezRID = req.params[0];
    if (req.query._METHOD == 'PUT') {
      app.ezJobs[ezRID] = { resIsDeferred: true };
      startEzpaarseJob(req, res, ezRID);
    } else {
      res.send(400, 'Please add _METHOD=PUT as a query in the URL (RESTful way)');
    }
  });

  /**
   * Start a new job (data comes from the req stream)
   */
  function startEzpaarseJob(req, res, ezRID) {

    // job is started
    app.ezJobs[ezRID] = app.ezJobs[ezRID] || {};
    req.ezRID         = ezRID;
    var socket        = app.io.sockets.socket(req.header('Socket-ID'));

    // Job traces absolute url is calculated from the client headers
    // if the client request is forwarded by a reverse proxy, the x-forwarded-host
    // variable is used.
    var logRoute = req.ezBaseURL + '/' + ezRID;
    var loglevel = req.header('Traces-Level') ||
                   (app.get('env') == 'production' ? 'info' : 'verbose');
    var logPath  = __dirname + '/../tmp/jobs/'
                             + ezRID.charAt(0) + '/'
                             + ezRID.charAt(1) + '/'
                             + ezRID;
    mkdirp.sync(logPath);

    var baseReport = {
      'general': {
        'Job-ID': ezRID,
        'Job-Date': moment().format(),
        'Job-Done': false,
        'result-file-ecs': logRoute,
        'URL-Traces': logRoute + '/job-traces.log',
        'nb-ecs':                   0,
        'nb-lines-input':           0,
        'Rejection-Rate':           '0 %',
        'Job-Duration':             '0 s',
        'process-speed':            '0 lignes/s'
      },
      'rejets': {
        'nb-lines-ignored':         0,
        'nb-lines-ignored-domains': 0,
        'nb-lines-unknown-domains': 0,
        'nb-lines-unknown-format':  0,
        'nb-lines-unqualified-ecs': 0,
        'nb-lines-pkb-miss-ecs':    0,
        'url-ignored-domains':      logRoute + '/lines-ignored-domains.log',
        'url-unknown-domains':      logRoute + '/lines-unknown-domains.log',
        'url-unknown-formats':      logRoute + '/lines-unknown-formats.log',
        'url-unqualified-ecs':      logRoute + '/lines-unqualified-ecs.log',
        'url-pkb-miss-ecs':         logRoute + '/lines-pkb-miss-ecs.log'
      },
      'stats': {
        'platforms':                0,
        'mime-PDF':                 0,
        'mime-HTML':                0
      }
    };
    var report = new ReportManager(logPath + '/report.json', baseReport);
    report.cycle(1, socket);

    res.set('Job-ID', ezRID);
    res.set('Job-Report', logRoute + '/job-report.json');
    res.set('Job-Traces', logRoute + '/job-traces.log');
    res.set('Lines-Unknown-Formats', logRoute + '/lines-unknown-formats.log');
    res.set('Lines-Ignored-Domains', logRoute + '/lines-ignored-domains.log');
    res.set('Lines-Unknown-Domains', logRoute + '/lines-unknown-domains.log');
    res.set('Lines-Unqualified-ECs', logRoute + '/lines-unqualified-ecs.log');
    res.set('Lines-PKB-Miss-ECs',    logRoute + '/lines-pkb-miss-ecs.log');

    var logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          level: loglevel,
          colorize: 'true'
        }),
        new (winston.transports.File)({
          level: loglevel,
          stream: fs.createWriteStream(logPath + '/job-traces.log')
        })
      ]
    });

    var loggersAreSaturated = false;
    var handlerIsSaturated  = false;
    var sh = new StreamHandler();
    sh.add('unknownFormats', logPath + '/lines-unknown-formats.log');
    sh.add('ignoredDomains', logPath + '/lines-ignored-domains.log');
    sh.add('unknownDomains', logPath + '/lines-unknown-domains.log');
    sh.add('unqualifiedECs', logPath + '/lines-unqualified-ecs.log');
    sh.add('pkbMissECs',     logPath + '/lines-pkb-miss-ecs.log');
    
    // register the temp job directory
    app.ezJobs[ezRID].jobPath = logPath;

    var endOfRequest      = false;
    var writerWasStarted  = false;
    var treatedLines      = false;
    var writtenECs        = false;
    var badBeginning      = false;
    var statusHeader      = 'ezPAARSE-Status';
    var msgHeader         = 'ezPAARSE-Status-Message';
    
    
    if (req.get('Content-length') === 0) {
      // If no content in the body, terminate the response
      logger.warn("No content sent by the client");
      res.set(statusHeader, 4001);
      res.set(msgHeader, statusCodes['4001']);
      report.set('general', 'status', 4001);
      report.set('general', 'status-message', statusCodes['4001']);
      res.status(400);
      res.end();
      return;
    }

    initializer.init(app, req, res, logger, function (err, init) {
      if (err) {
        res.set(statusHeader, err.ezStatus);
        res.set(msgHeader, statusCodes[err.ezStatus]);
        report.set('general', 'status', err.ezStatus);
        report.set('general', 'status-message', statusCodes[err.ezStatus]);
        res.status(err.status);
        res.end();
        return;
      }
//       if (init.unzipReq) {
//         init.unzipReq.on('error', function (err) {
//           logger.error('Error while unziping request data');
//           if (!res.headerSent) {
//             res.set(statusHeader, 4002);
//             res.set(msgHeader, statusCodes['4002']);
//             report.set('general', 'status', 4002);
//             report.set('general', 'status-message', statusCodes['4002']);
//             res.status(400);
//           }
//           res.end();
//         });
//       }
      logger.info('Starting response');
      var request  = init.unzipReq ? init.unzipReq : req;
      var response = init.zipRes   ? init.zipRes   : res;

      var logParser = init.logParser;

      var writer = init.writer;
      var ecFilter = new ECFilter();
      // Takes "raw" ECs and returns those which can be sent
      var handler = new ECHandler(logger, sh, init.ufSplitters, report);
      
      var terminateResponse = function () {
        // If request ended and no buffer left, terminate the response
        if (writerWasStarted) {
          writer.end();
        }

        logger.info("Terminating response");
        logger.info(report.get('general', 'nb-lines-input') + " lines were read");
        logger.info(report.get('general', 'nb-ecs') + " ECs were created");

        var closeWinston = function (callback) {
          logger.info('Closing trace loggers');
          logger.transports.file._stream.on('close', callback);
          logger.clear();
        };

        var finalizeReport = function (callback) {
          logger.info('Finalizing report file');
          
          report.set('general', 'Job-Done', true);

          report.finalize(function () {
            logger.info('Closing reject log streams');
            sh.closeAll(function () { closeWinston(callback); });
          }, socket);
        }

        finalizeReport(function () {
          res.end();
          if (app.ezJobs[req.ezRID].ecsStream) {
            // todo: clear the app.ezJobs[req.ezRID] from the memory
            //       but have to think when is the best time for that
            //       maybe we should wait as long as the folderreaper ?
            app.ezJobs[req.ezRID].ecsStream.end();
            app.ezJobs[req.ezRID].ecsStream = null;
          }
        });
      };

      var processLine = function (line) {
        if (badBeginning) {
          return;
        }
        var ec = logParser.parse(line);
        if (ec) {
          treatedLines = true;
          if (ecFilter.isValid(ec)) {
            if (ignoredDomains.indexOf(ec.domain) === -1) {
              if (ec.host && init.anonymize.host) {
                ec.host = crypto.createHash(init.anonymize.host).update(ec.host).digest("hex");
              }
              if (ec.login && init.anonymize.login) {
                ec.login = crypto.createHash(init.anonymize.login).update(ec.login).digest("hex");
              }
              var parser = domains[ec.domain];
              if (parser) {
                handler.push(ec, line, parser);
              } else {
                logger.silly('No parser found for : ' + ec.domain);
                sh.write('unknownDomains', line + '\n');
                report.inc('rejets', 'nb-lines-unknown-domains');
              }
            } else {
              logger.silly('The domain is ignored');
              sh.write('ignoredDomains', line + '\n');
              report.inc('rejets', 'nb-lines-ignored-domains');
            }
          } else {
            logger.silly('Line was ignored');
            report.inc('rejets', 'nb-lines-ignored');
          }
        } else {
          logger.silly('Line format was not recognized');
          sh.write('unknownFormats', line + '\n');
          report.inc('rejets', 'nb-lines-unknown-format');
          if (!treatedLines) {
            badBeginning = true;
            lazy.emit('end');
            logger.warn('Couln\'t recognize first line : aborted.', {line: line});
          }
        }
        report.inc('general', 'nb-lines-input');
      }

      // to handle stream spliting line by line
      var lazy = new Lazy();

      // function used to handled a log file (a part)
      var partHandlingFunction = function (data, callback) {
        var part   = data.part;
        var lazy   = data.lazy;
        var logger = data.logger;
        var sh     = data.sh;
        
        // if this is the latest part, tell it to lazy
        if (part === null) {
          logger.info('Request upload: finished reading all parts');
          lazy.emit('end');
          callback();
          return;
        }
        
        var pipeInputStreamToLazy = function (inputStream, part, cbEndRead) {
          var data = '';
          
          sh.on('saturated', function () {
            loggersAreSaturated = true;
          });
          sh.on('drain', function () {
            loggersAreSaturated = false;
            if (!handlerIsSaturated) {
              data = inputStream.read();
              if (data) {
                logger.silly('Request upload: reading data ' + part.filename + ' (drain)');
                lazy.emit('data', data);
              }
            }
          });

          handler.on('saturated', function () {
            handlerIsSaturated = true;
          });
          handler.on('drain', function () {
            if (!endOfRequest) {
              handlerIsSaturated = false;
              if (!loggersAreSaturated) {
                var data = inputStream.read();
                if (data) {
                  logger.silly('Request upload: reading data ' + part.filename + ' (drain)');
                  lazy.emit('data', data);
                }
              }
            }
          });

          inputStream.on('readable', function () {
            if (!handlerIsSaturated && !loggersAreSaturated) {
              data = inputStream.read();
              if (data) {
                logger.silly('Request upload: reading data ' + part.filename + ' (readable)');
                lazy.emit('data', data);
              }
            }
          });
          inputStream.on('end', function () {
            logger.info('Request upload: finished reading part ' + part.filename);
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
        ].indexOf(contentType) != -1 ||
        ['gzip'].indexOf(contentEncoding) != -1;
        
        // only accepted encoding is gzip
        if (contentEncoding && contentEncoding != 'gzip') {
          logger.error('Content encoding not supported');
          if (!res.headerSent) {
            res.set(statusHeader, 4005);
            res.set(msgHeader, statusCodes[4005]);
            report.set('general', 'status', 4005);
            report.set('general', 'status-message', statusCodes[4005]);
            res.status(406);
          }
          res.end();
          callback();
          return;
        }

        if (isGzip) {
          // Gziped
          logger.info('Request upload: start reading a gziped encoded part [' +
                      part.filename + '] [' + contentType + ']');
          // it also exists createGunzip, createInflate maybe useful ? ...
          var unzip = require('zlib').createUnzip();
          unzip.on('error', function (err) {
            logger.error('Error while unziping request data:' + err);
            if (!res.headerSent) {
              res.set(statusHeader, 4002);
              res.set(msgHeader, statusCodes['4002']);
              report.set('general', 'status', 4002);
              report.set('general', 'status-message', statusCodes['4002']);
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
          logger.info('Request upload: start reading a not encoded part [' +
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
        logger.info('Handling a multipart stream upload');
      
        // to parse multipart data it the HTTP body, we use the multiparty module
        var form = new multiparty.Form({
          autoFiles: false, // input files are not stored in a tmp folder
        });
        form.on('part', function (part) {
          partHandlingQueue.push({ part: part, lazy: lazy, logger: logger, sh: sh });
        });
        
        form.on('close', function () {
          logger.info('Request upload: form closed');
          // tells there is no more part to handle
          partHandlingQueue.push({ part: null, lazy: lazy, logger: logger, sh: sh });
        });
        form.on('error', function (err) {
          logger.error('Request upload: form error [' + err + ']');
          // tells there is no more part to handle
          partHandlingQueue.push({ part: null, lazy: lazy, logger: logger, sh: sh });
          if (!res.headerSent) {
            res.set(statusHeader, 4007);
            res.set(msgHeader, statusCodes['4007']);
            report.set('general', 'status', 4007);
            report.set('general', 'status-message', statusCodes['4007']);
            res.status(400);
          }
          res.end();
        });
        // launch the multipart parsing
        form.parse(request);
      } else {
        // handle a not multipart stream: log data are embeded directly in the HTTP body
        logger.info('Handling a direct stream upload');
        partHandlingQueue.push({ part: request, lazy: lazy, logger: logger, sh: sh });
        // tells there is no more part to handle
        partHandlingQueue.push({ part: null,    lazy: lazy, logger: logger, sh: sh });
      }

      // read input stream line by line
      lazy.lines
          .map(String)
          .map(function (line) {
            processLine(line);
          })
      lazy.on('end', function () {
        // when the input stream is closed,
        // tell that the response stream can be closed
        logger.info('No more data in the request');
        endOfRequest = true;
        if (!treatedLines) {
          logger.warn('No line treated in the request');
          try {
            res.set(statusHeader, 4003);
            res.set(msgHeader, statusCodes['4003']);
            report.set('general', 'status', 4003);
            report.set('general', 'status-message', statusCodes['4003']);
          } catch (e) {}
          res.status(400);
          res.end();
        } else if (handler.queue.length() === 0) {
          handler.queue.drain();
        }
      });

      handler.on('ec', function (ec) {
        if (!writerWasStarted) {
          writerWasStarted = true;
          
          res.status(200);

          // Add or remove user fields from those extracted by logParser
          var outputFields     = init.outputFields    || {};
          outputFields.added   = outputFields.added   || [];
          outputFields.removed = outputFields.removed || [];
          outputFields.added   = outputFields.added.concat(logParser.getFields());

          writer.start(outputFields);
        }
        writer.write(ec);
        writtenECs = true;
        report.inc('general', 'nb-ecs');
      });
      handler.on('drain', function () {
        if (endOfRequest) {
          terminateResponse();
        }
      });
    });
  }

  /**
   * GET route on /
   */
  app.get('/', function (req, res) {
    res.render('ws', { title: 'ezPAARSE - Web service' });
  });

  /**
   * GET route on /datasets/
   * Returns a list of all datasets
   */
  app.get(/^\/datasets(\/)?$/, function (req, res) {
    res.type('application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    
    var fillTree = function (tree, rootFolder, folder) {
      var absFolder = rootFolder + '/' + folder;
      var files = fs.readdirSync(absFolder);
      if (!files) {
        res.status(500);
        res.end();
        return tree;
      }

      files.forEach(function (f) {
        var file = folder + '/' + f;
        var absFile = rootFolder + '/' + file;
        var stats = fs.statSync(absFile);
        if (!stats) {
          return;
        }
        if (stats.isDirectory()) {
          tree = fillTree(tree, rootFolder, file);
        } else {
          // only list log files (.log or .log.gz)
          if (! /\.log$/.test(f) && ! /\.log\.gz$/.test(f)) {
            return;
          }
          var size  = stats.size;
          var unit  = '';
          if (size < 1024) {
            unit = 'octets';
          } else if ((size /= 1024).toFixed(2) < 1024) {
            unit = 'Ko';
          } else if ((size /= 1024).toFixed(2) < 1024) {
            unit = 'Mo';
          } else if ((size /= 1024).toFixed(2) < 1024) {
            unit = 'Go';
          }
          size = (Math.floor(size * 100) / 100) + ' ' + unit;
          tree[f] = {
            location: file,
            size: size
          }
        }
      });
      return tree;
    }
    if (config.EZPAARSE_LOG_FOLDER) {
      var rootFolder = __dirname + '/../' + config.EZPAARSE_LOG_FOLDER;
      if (fs.existsSync(rootFolder)) {
        var tree = {};
        tree = fillTree(tree, rootFolder, '.');
        res.status(200);
        res.write(JSON.stringify(tree, null, 2));
        res.end();
      } else {
        res.status(404);
        res.end();
      }
    } else {
      res.status(500);
      res.end();
    }
  });
};