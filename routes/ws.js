/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var debug         = require('debug')('log');
var fs            = require('fs');
var byline        = require('byline');
var moment        = require('moment');
var crypto        = require('crypto');
var shell         = require('shelljs');
var async         = require('async');
var zlib          = require('zlib');
var LogParser     = require('../lib/logParser.js');
var Writer        = require('../lib/output/writer.js');
var Knowledge     = require('../lib/pkbManager.js');


function estValide(ec) {
  if (!ec.url || !ec.host || !ec.login) {
    return false;
  }
  // Filters images and javascript files
  if (/\.css|\.gif|\.GIF|\.jpg|\.JPG|favicon\.ico/.test(ec.url) || /\.js$/.test(ec.url)) {
    return false;
  }
  // Filters http codes other than 200 and 302
  if (ec.status && ['200', '302'].indexOf(ec.status) == -1) {
    return false;
  }
  return true;
}

module.exports = function (app, parsers, ignoredDomains) {
  
  /**
   * POST log
   */
  app.post(/^\/ws(\/)?$/, function (req, res) {
    debug("Req : " + req);
    var writer, zip, unzip;
    var status          = 200;
    var contentEncoding = req.header('content-encoding');
    var acceptEncoding  = req.header('accept-encoding');
    var logFormat       = req.header('ezPAARSE-LogFormat');
    var dateFormat      = req.header('ezPAARSE-DateFormat');
    var replacer        = req.header('ezPAARSE-Replacer');

    var knowledge       = new Knowledge();
    var logParser       = new LogParser(logFormat, dateFormat, replacer);
    var countLines      = 0;
    var countECs        = 0;

    var endOfRequest    = false;
    var headersSent     = false;
    var treatedLines    = false;
    var badBeginning    = false;

    // Array of EC buffers, used to parse multiple ECs using one process
    var ecBuffers       = {};
    var ecBufferSize    = 50;

    if (req.get('Content-length') === 0) {
      // If no content in the body, terminate the response
      status = 400;
      debug("No content sent by the client");
    }

    if (contentEncoding) {
      if (contentEncoding == 'gzip' || contentEncoding == 'deflate') {
          unzip = zlib.createUnzip();
          unzip.on('error', function (err) {
            debug('Error while unziping request');
            res.status(400);
            res.end();
            return;
          });
          req.pipe(unzip);
      } else {
        debug('Content encoding not supported');
        status = 406;
      }
    }

    if (acceptEncoding) {
      if (acceptEncoding == 'gzip') {
        res.set('Content-Encoding', 'gzip');
        zip = zlib.createGzip();
        zip.pipe(res);
      } else if (acceptEncoding == 'deflate') {
        res.set('Content-Encoding', 'deflate');
        zip = zlib.createDeflate();
        zip.pipe(res);
      } else {
        debug("Requested encoding not acceptable");
        status = 406;
      }
    }

    var request = unzip ? unzip : req;
    var response = zip ? zip : res;

    res.format({
      'text/csv': function () {
        debug("CSV requested");
        res.type('text/csv');
        writer = new Writer(response, 'csv');
      },
      'application/json': function () {
        debug("JSON requested");
        res.type('application/json');
        writer = new Writer(response, 'json');
      },
      'default': function () {
        debug("Requested format not acceptable");
        status = 406;
      }
    });

    if (!writer && status === 200) {
      status = 500;
      debug("Writer not found");
    }


    if (status != 200) {
      res.status(status);
      response.end();
      return;
    }

    var queue = async.queue(function (task, callback) {
      var buffer    = task.buffer;
      var domain    = buffer.shift();
      var parser    = domain.parser;
      var platform  = domain.platform;
      
      // Determine the language of the parser using de first line
      var firstLine = fs.readFileSync(parser, 'utf8').split('\n')[0];
      var match = /^\#\!\/usr\/bin\/env ([a-zA-Z]+)$/.exec(firstLine);
      var ec;

      knowledge.get(platform, function (pkb) {
        if (match && match[1] && match[1] == 'node') {
          var urls = [];
          for (var i = 0, l = buffer.length; i < l; i++) {
            urls.push(buffer[i].url);
          }
          var results = require(parser).parserExecute(urls);

          for (i = 0, l = results.length; i < l; i++) {
            var result = results[i];
            ec = buffer[i];

            if (result.type) {
              ec.type = result.type;
            }
            if (result.issn) {
              ec.issn = result.issn;
            } else if (result.pid) {
              var id;
              if (pkb) {
                id = pkb.get(result.pid);
                if (id) {
                  ec.issn = id.issn;
                  ec.eissn = id.eissn;
                } else {
                  debug('Could\'t find any ISSN from the editor id');
                }
              } else {
                debug('No knowledge base found for the platform : ' + platform);
              }
            } else {
              debug('The parser couldn\'t find any id in the given URL');
            }
            if (ec.issn || ec.eissn || ec.type) {
              if (!headersSent) {
                headersSent = true;
                res.status(200);
                writer.start();
              }
              writer.write(ec);
              countECs++;
            }
          }
          callback(null);

        } else {
          var child = shell.exec(parser, {async: true, silent: true});
          var stream = byline.createStream(child.stdout);

          stream.on('data', function (line) {
            if (ec) {
              var result;
              try {
                result = JSON.parse(line);
              } catch (e) {
                debug('The value returned by the parser couldn\'t be parsed to JSON');
              }
              if (result instanceof Object) {
                if (result.type) {
                  ec.type = result.type;
                }
                if (result.issn) {
                  ec.issn = result.issn;
                } else if (result.pid) {
                  var id;
                  if (pkb[platform]) {
                    id = pkb[platform][result.pid];
                    if (id) {
                      ec.issn = id.issn;
                      ec.eissn = id.eissn;
                    } else {
                      debug('Could\'t find any ISSN from the editor id');
                    }
                  } else {
                    debug('No knowledge base found for the platform : ' + platform);
                  }
                } else {
                  debug('The parser couldn\'t find any id in the given URL');
                }
                if (ec.issn || ec.eissn || ec.type) {
                  if (!headersSent) {
                    headersSent = true;
                    res.status(200);
                    writer.start();
                  }
                  writer.write(ec);
                  countECs++;
                }

              } else {
                debug('The value returned by the parser couldn\'t be parsed to JSON');
              }
              
              ec = buffer.pop();
              if (ec) {
                child.stdin.write(ec.url + '\n');
              } else {
                child.stdin.end();
              }
            }
          });
          
          child.on('exit', function (code) {
            if (code === 0) {
              debug('Process complete');
            } else {
              debug('The process failed');
            }
            callback(null);
          });
          ec = buffer.pop();
          if (ec) {
            child.stdin.write(ec.url + '\n');
          } else {
            child.stdin.end();
          }
        }
      });
    }, 10);
  
    var stream = byline.createStream(request);

    queue.saturated = function () {
      stream.pause();
    };

    queue.drain = function () {
      if (!endOfRequest) {
        // If request was paused, resume it
        stream.resume();
      } else if (Object.keys(ecBuffers).length === 0) {
        // If request ended and no buffer left, terminate the response
        writer.end();
        response.end();
        debug("Terminating response");
        debug(countLines + " lines were read");
        debug(countECs + " ECs were created");
      } else {
        for (var i in ecBuffers) {
          queue.push({buffer: ecBuffers[i]});
          delete ecBuffers[i];
        }
      }
    };

    stream.on('end', function () {
      endOfRequest = true;
      if (!treatedLines) {
        res.status = 400;
        res.end();
      } else {
        for (var i in ecBuffers) {
          queue.push({buffer: ecBuffers[i]});
          delete ecBuffers[i];
        }
      }
    });

    stream.on('data', function (line) {
      if (badBeginning) {
        return;
      }
      var ec = logParser.parse(line);

      if (ec) {
        if (ignoredDomains.indexOf(ec.domain) == -1) {
          if (!ec.login) {
            ec.login = 'ezPAARSE-noLogin'
          }
          if (estValide(ec)) {
            if (parsers[ec.domain]) {
              treatedLines = true;
              var parser   = parsers[ec.domain].parser;
              ec.host      = crypto.createHash('md5').update(ec.host).digest("hex");

              if (!ecBuffers[parser]) { ecBuffers[parser] = [parsers[ec.domain]]; }
              ecBuffers[parser].push(ec);
              if (ecBuffers[parser].length > ecBufferSize) {
                var buffer = ecBuffers[parser].slice();
                delete ecBuffers[parser];
                queue.push({buffer: buffer});
              }
            } else {
              debug('No parser found for : ' + ec.domain);
            }
          } else {
            debug('Line was ignored');
          }
        } else {
          debug('This domain is ignored : ' + ec.domain);
        }
      } else {
        debug('Line format was not recognized');
        if (!treatedLines) {
          badBeginning = true;
          res.status(400);
          res.end();
          stream.end();
          debug('Couln\'t recognize first line : aborted.');
        }
      }
      countLines++;
    });
  });
  
  /**
   * GET route on /ws/
   */
  app.get(/^\/ws(\/)?$/, function (req, res) {
    res.render('ws');
  });
  
};