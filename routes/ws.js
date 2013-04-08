/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs          = require('fs');
var MatchStream = require('match-stream');
var async       = require('async');
var crypto      = require('crypto');
var Readable    = require('stream').Readable;
var initializer = require('../lib/requestinitializer.js');
var ECFilter    = require('../lib/ecfilter.js');
var ECHandler   = require('../lib/echandler.js');
var config      = require('../config.json');
var winston     = require('winston');

module.exports = function (app, domains, ignoredDomains) {
  /**
   * POST log
   */
  app.post('/', function (req, res) {
    var loglevel = req.header('LogLevel') || 'error';

    var logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          level: loglevel,
          colorize: 'true'
        }),
        new (winston.transports.File)({
          level: loglevel,
          dirname: __dirname + '/../logs',
          filename: 'debug.log' // should be sessionized
        })
      ]
    });
    
    var countLines  = 0;
    var countECs    = 0;

    var endOfRequest      = false;
    var writerWasStarted  = false;
    var treatedLines      = false;
    var writtenECs        = false;
    var badBeginning      = false;
    var statusHeader = 'ezPAARSE-Status';
    
    
    if (req.get('Content-length') === 0) {
      // If no content in the body, terminate the response
      logger.warn("No content sent by the client");
      res.set(statusHeader, 4001);
      res.status(400);
      res.end();
      return;
    }

    initializer.init(logger, req, res,
                     function (err, unzipReq, zipRes, anonymize, logParser, writer) {
      if (err) {
        res.set(statusHeader, err.ezStatus);
        res.status(err.status);
        res.end();
        return;
      }
      if (unzipReq) {
        unzipReq.on('error', function (err) {
          logger.error('Error while unziping request data');
          if (!res.headerSent) {
            res.set(statusHeader, 4002);
            res.status(400);
          }
          res.end();
        });
      }
      logger.info('Starting response');
      var request  = unzipReq ? unzipReq : req;
      var response = zipRes   ? zipRes   : res;

      var ecFilter = new ECFilter(ignoredDomains);
      // Takes "raw" ECs and returns those which can be sent
      var handler = new ECHandler(logger);
      
      var processLine = function (line) {
        if (badBeginning) {
          return;
        }
        var ec = logParser.parse(line);
        if (ec) {
          treatedLines = true;
          if (ecFilter.isValid(ec)) {
            if (ec.host && anonymize.host) {
              ec.host = crypto.createHash(anonymize.host).update(ec.host).digest("hex");
            }
            if (ec.login && anonymize.login) {
              ec.login = crypto.createHash(anonymize.login).update(ec.login).digest("hex");
            }
            var parser = domains[ec.domain];
            if (parser) {
              handler.push(ec, parser);
            } else {
              logger.silly('No parser found for : ' + ec.domain);
            }
          } else {
            logger.silly('Line was ignored');
          }
        } else {
          logger.silly('Line format was not recognized');
          if (!treatedLines) {
            badBeginning = true;
            matchstream.end();
            logger.warn('Couln\'t recognize first line : aborted.');
          }
        }
        countLines++;
      }

      var line = '';
      var matchstream = new MatchStream({ pattern: '\n', consume: true},
        function (buf, matched, extra) {
        line += buf.toString();
        if (matched) {
          processLine(line.trim());
          line = '';
        }
      }).once('finish', function () {
        endOfRequest = true;
        // Workaround: when the file does not end with \n,
        // process remaining data in the buffer of matchstream
        line = matchstream._bufs.buffers[0];
        if (line) {
          processLine(line);
        }
        if (!treatedLines) {
          logger.warn('End of request but no line treated');
          try {
            res.set(statusHeader, 4003);
          } catch (e) {}
          res.status(400);
          res.end();
        } else if (handler.queue.length() === 0) {
          handler.queue.drain();
        }
      });
      
      request.pipe(matchstream);

      handler.on('ec', function (ec) {
        if (!writerWasStarted) {
          writerWasStarted = true;
          res.status(200);
          writer.start();
        }
        writer.write(ec);
        writtenECs = true;
        countECs++;
      });

      handler.on('drain', function () {
        if (endOfRequest) {
          // If request ended and no buffer left, terminate the response
          if (writerWasStarted) {
            writer.end();
          }
          res.end();
          logger.info("Terminating response");
          logger.info(countLines + " lines were read");
          logger.info(countECs + " ECs were created");
        }
      });
    });
  });
  
  /**
   * GET route on /result/:folder/:filename
   * Used to download results
   */
  app.get(/^\/results\/([a-zA-Z0-9]+)\/([^ ]+)$/, function (req, res) {
    var folder     = __dirname + '/../tmp/' + req.params[0];
    var resultFile = folder + '/' + req.params[1];
    if (fs.existsSync(resultFile)) {
      res.sendfile(req.params[1], {root: folder}, function (err) {
        if (err) {
          res.status(500);
          res.end();
        }
      });
    } else {
      res.status(404);
      res.end();
    }
  });

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