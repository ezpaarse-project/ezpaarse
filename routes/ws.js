/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var debug       = require('debug')('log');
var fs          = require('fs');
var byline      = require('byline');
var async       = require('async');
var crypto      = require('crypto');
var initializer = require('../lib/requestinitializer.js');
var ECFilter    = require('../lib/ecfilter.js');
var ECHandler   = require('../lib/echandler.js');
var config      = require('../config.json');

module.exports = function (app, domains, ignoredDomains) {
  
  /**
   * POST log
   */
  app.post(/^\/ws(\/)?$/, function (req, res) {
    debug("Req : " + req);
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
      debug("No content sent by the client");
      res.set(statusHeader, 4001);
      res.status(400);
      res.end();
      return;
    }

    initializer.init(req, res, function (err, unzipReq, zipRes, anonymize, logParser, writer) {
      if (err) {
        res.set(statusHeader, err.ezStatus);
        res.status(err.status);
        res.end();
        return;
      }

      if (unzipReq) {
        unzipReq.on('error', function (err) {
          debug('Error while unziping request data');
          if (!res.headerSent) {
            res.set(statusHeader, 4002);
            res.status(400);
          }
          res.end();
        });
      }

      var request  = unzipReq ? unzipReq : req;
      var response = zipRes   ? zipRes   : res;

      var ecFilter = new ECFilter(ignoredDomains);
      // Takes "raw" ECs and returns those which can be sent
      var handler = new ECHandler(writer);
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
    
      handler.on('saturated', function () {
        stream.pause();
      });

      handler.on('drain', function () {
        if (!endOfRequest) {
          // If request was paused, resume it
          stream.resume();
        } else {
          // If request ended and no buffer left, terminate the response
          if (writerWasStarted) {
            writer.end();
          }
          res.end();
          debug("Terminating response");
          debug(countLines + " lines were read");
          debug(countECs + " ECs were created");
        }
      });

      // Cookieparser bug workaround (TODO: Fix  with node 0.10.1)
      req.readable = true;
      var stream = byline.createStream(request);

      stream.on('end', function () {
        endOfRequest = true;
        if (!treatedLines) {
          try {
            res.set(statusHeader, 4003);
          } catch (e) {}
          res.status(400);
          res.end();
        } else if (handler.queue.length() === 0) {
          handler.queue.drain();
        }
      });

      stream.on('data', function (line) {
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
              debug('No parser found for : ' + ec.domain);
            }
          } else {
            debug('Line was ignored');
          }
        } else {
          debug('Line format was not recognized');
          if (!treatedLines) {
            badBeginning = true;
            stream.end();
            debug('Couln\'t recognize first line : aborted.');
          }
        }
        countLines++;
      });
    });
  });
  
  /**
   * GET route on /ws/result/:folder/:filename
   * Used to download results
   */
  app.get(/^\/ws\/results\/([a-zA-Z0-9]+)\/([^ ]+)$/, function (req, res) {
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
   * GET route on /ws/
   */
  app.get(/^\/ws(\/)?$/, function (req, res) {
    res.render('ws');
  });
  
  /**
   * GET route on /ws/datasets/
   * Returns a list of all datasets
   */
  app.get(/^\/ws\/datasets(\/)?$/, function (req, res) {
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