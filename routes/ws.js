/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs            = require('fs');
var Lazy          = require('lazy');
var uuid          = require('uuid');
var async         = require('async');
var crypto        = require('crypto');
var moment        = require('moment');
var mkdirp        = require('mkdirp');
var winston       = require('winston');
var formidable    = require('formidable');
var Readable      = require('stream').Readable;
var config        = require('../config.json');
var ECFilter      = require('../lib/ecfilter.js');
var ECHandler     = require('../lib/echandler.js');
var statusCodes   = require('../statuscodes.json');
var initializer   = require('../lib/requestinitializer.js');
var ReportManager = require('../lib/reportmanager.js');
var rgf           = require('../lib/readgrowingfile.js');
var uuidRegExp    = /^\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/;

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
    if (!app.ezJobs[rid] || !app.ezJobs[rid].ecsPath) {
      res.writeHead(404, {});
      res.end();
      return;
    }

    var ext = app.ezJobs[rid].contentType.split('/')[1];
    res.writeHead(200, {
      'Content-Type': app.ezJobs[rid].contentType,
      'Content-Disposition': 'attachment; filename="' + name + '.' + ext + '"'
    });

    if (app.ezJobs[rid].ecsStream) {
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
      console.log('Requesting deferred result ECs file');
      // if job is finished (ECs are all writing it the temp file)
      // use a basic pipe between the file and the http response
      fs.createReadStream(app.ezJobs[rid].ecsPath).pipe(res);
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
  // this route is usfule cause sometime PUT is not allowed by reverse proxies
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
      'Job-ID': ezRID,
      'Job-Date': moment().format(),
      'nb-ecs':                   0,
      'nb-lines-input':           0,
      'nb-lines-ignored':         0,
      'nb-lines-unknown-domains': 0,
      'nb-lines-unknown-format':  0,
      'nb-lines-unqualified-ecs': 0,
      'nb-lines-pkb-miss-ecs':    0
    };
    var report = new ReportManager(logPath + '/report.json', baseReport);
    report.cycle(10);

    res.set('Job-ID', ezRID);
    res.set('Job-Traces', logRoute + '/job-traces.log');
    res.set('Job-Unknown-Formats', logRoute + '/job-unknown-formats.log');
    res.set('Job-Ignored-Domains', logRoute + '/job-ignored-domains.log');
    res.set('Job-Unknown-Domains', logRoute + '/job-unknown-domains.log');
    res.set('Job-Unqualified-ECs', logRoute + '/job-unqualified-ecs.log');
    res.set('Job-PKB-Miss-ECs', logRoute + '/job-pkb-miss-ecs.log');

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

    var logStreams = {
      unknownFormats: fs.createWriteStream(logPath + '/job-unknown-formats.log'),
      ignoredDomains: fs.createWriteStream(logPath + '/job-ignored-domains.log'),
      unknownDomains: fs.createWriteStream(logPath + '/job-unknown-domains.log'),
      unqualifiedECs: fs.createWriteStream(logPath + '/job-unqualified-ecs.log'),
      pkbMissECs:     fs.createWriteStream(logPath + '/job-pkb-miss-ecs.log')
    }
    
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
      res.status(400);
      res.end();
      return;
    }

    initializer.init(app, req, res, logger, function (err, init) {
      if (err) {
        res.set(statusHeader, err.ezStatus);
        res.set(msgHeader, statusCodes[err.ezStatus]);
        res.status(err.status);
        res.end();
        return;
      }
      if (init.unzipReq) {
        init.unzipReq.on('error', function (err) {
          logger.error('Error while unziping request data');
          if (!res.headerSent) {
            res.set(statusHeader, 4002);
            res.set(msgHeader, statusCodes['4002']);
            res.status(400);
          }
          res.end();
        });
      }
      logger.info('Starting response');
      var request  = init.unzipReq ? init.unzipReq : req;
      var response = init.zipRes   ? init.zipRes   : res;

      var logParser = init.logParser;

      var writer = init.writer;
      var ecFilter = new ECFilter();
      // Takes "raw" ECs and returns those which can be sent
      var handler = new ECHandler(logger, logStreams, report);
      
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
                logStreams.unknownDomains.write(line + '\n');
                report.inc('nb-lines-unknown-domains');
              }
            } else {
              logger.silly('The domain is ignored');
              logStreams.ignoredDomains.write(line + '\n');
              report.inc('nb-lines-ignored-domains');
            }
          } else {
            logger.silly('Line was ignored');
            report.inc('nb-lines-ignored');
          }
        } else {
          logger.silly('Line format was not recognized');
          logStreams.unknownFormats.write(line + '\n');
          report.inc('nb-lines-unknown-format');
          if (!treatedLines) {
            badBeginning = true;
            lazy.emit('end');
            logger.warn('Couln\'t recognize first line : aborted.');
          }
        }
        report.inc('nb-lines-input');
      }

      // to handle HTML form upload
      var form = new formidable.IncomingForm();
      // to handle stream spliting line by line
      var lazy;
      // start parsing the req object (required to get the "part")
      if (req.is('multipart/form-data')) {
        // form multipart stream
        logger.info('Handling a multipart encoded upload');
        form.parse(request);
        lazy = new Lazy();
      } else {
        // basic stream
        logger.info('Handling a not encoded upload')
        lazy = new Lazy(request);
      }
      // for each part (one part is one sent file by the HTML form)
      // connect the input stream to the lazy line by line reader
      form.onPart = function (part) {
        part.addListener('data', function (chunk) {
          lazy.emit('data', chunk);
        });
      };
      // when the HTML form upload is finished
      // tell that the HTTP response can be closed
      form.on('end', function () {
        lazy.emit('end');
      });

      form.on('error', function (err) {
        logger.info('Form multipart error (nothing is done)')
        // todo: to something ?
        // to simulate an error, just send a long
        // multipart request and close the request during the process
        // ex:
        // curl -v -X POST --no-buffer --proxy "" \
        //      -F myfile=@./test/dataset/sd.2013-03-12.log http://localhost:59599/
        // then CTRL+C
      });

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

          // Merges asked fields with those extracted by logParser
          // (but doesn't if the fields replace the defaults)
          if (!init.outputFields) {
            init.outputFields = logParser.getFields();
          } else {
            if (!init.fieldsUsage || init.fieldsUsage !== 'replace') {
              init.outputFields = init.outputFields.concat(logParser.getFields());
            }
          }
          writer.start(init.outputFields, init.fieldsUsage);
        }
        writer.write(ec);
        writtenECs = true;
        report.inc('nb-ecs');
      });

      handler.on('drain', function () {
        if (endOfRequest) {
          // If request ended and no buffer left, terminate the response
          if (writerWasStarted) {
            writer.end();
          }


          logger.info("Terminating response");
          logger.info(report.get('nb-lines-input') + " lines were read");
          logger.info(report.get('nb-ecs') + " ECs were created");


          var streams = [];
          for (var stream in logStreams) {
            streams.push(logStreams[stream]);
          }

          var closeWinston = function (callback) {
            logger.info('Closing trace loggers');
            logger.transports.file._stream.on('close', callback);
            logger.clear();
          };
          
          // Can take a very long time when processing a big log file (>300k lines)
          // TODO manage reject logs better
          var closeLogStreams = function (callback) {
            var stream = streams.pop();
            if (stream) {
              stream.end(function () { closeLogStreams(callback); });
            } else {
              closeWinston(callback);
            }
          }

          var finalizeReport = function (callback) {
            logger.info('Finalizing report file');
            report.finalize(function () {
              logger.info('Closing reject log streams');
              closeLogStreams(callback);
            });
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