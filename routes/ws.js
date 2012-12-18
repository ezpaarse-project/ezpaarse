/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var debug    = require('debug')('log');
var URL      = require('url');
var byline   = require('byline');
var moment   = require('moment');
var crypto   = require('crypto');
var shell    = require('shelljs');
var async    = require('async');
var tabRegex = require('../logformat.js');

function estValide(ec) {
  if (!ec.url || !ec.httpCode || !ec.host) {
    return false;
  }
  // Filters images and javascript files
  if (/\.css|\.gif|\.GIF|\.jpg|\.JPG|favicon\.ico/.test(ec.url) || /\.js$/.test(ec.url)) {
    return false;
  }
  // Filters http codes other than 200 and 302
  if (['200', '302'].indexOf(ec.httpCode) == -1) {
    return false;
  }
  return true;
}

module.exports = function (app, parsers, knowledge, ignoredDomains) {
  
  /**
   * POST log
   */
  app.post('/ws/', function (req, res) {
    debug("Req : " + req);

    if (req.get('Content-length') === 0) {
      // If no content in the body, terminate the response
      res.status(400);
      res.end();
      debug("No content, terminating response");
      return;
    }

    res.status(200);
    var countLines = 0;
    var countECs = 0;
    var delimiter = '';

    // Array of EC buffers, used to parse multiple ECs using one process
    var ecBuffers = {};
    var ecBufferSize = 50;

    res.write('[');

    var queue = async.queue(function (task, callback) {
      var buffer = task.buffer;
      var domain = buffer.shift();
      var parser = domain.parser;
      var platform = domain.platform;
      var ec;
      
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
            } else if (result.cdi) {
              var id;
              if (knowledge[platform]) {
                id = knowledge[platform][result.cdi];
                if (id) {
                  ec.pissn = id.pissn;
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
            if (ec.issn || ec.pissn || ec.eissn || ec.type) {
              res.write(delimiter + JSON.stringify(ec, null, 2));
              if (delimiter === '') { delimiter = ','; }
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
    }, 10);
  
    queue.saturated = function () {
      req.pause();
    };

    queue.drain = function () {
      if (req.readable) {
        // If request was paused, resume it
        req.resume();
      } else if (Object.keys(ecBuffers).length === 0) {
        // If request ended and no buffer left, terminate the response
        res.write(']');
        res.end();
        debug("Terminating response");
        debug(countLines + " lines were read");
        debug(countECs + " ECs were created");
      }

      for (var i in ecBuffers) {
        queue.push({buffer: ecBuffers[i]});
        delete ecBuffers[i];
      }
    };

    var stream = byline.createStream(req);

    stream.on('end', function () {
      for (var i in ecBuffers) {
        queue.push({buffer: ecBuffers[i]});
        delete ecBuffers[i];
      }
    });

    stream.on('data', function (line) {
      var ec = false;
      var match;
      tabRegex.forEach(function (regex) {
        match = regex.exp.exec(line);
        if (match) {
          ec = {};
          regex.properties.forEach(function (property, index) {
            ec[property] = match[index + 1];
          });
          if (ec.url) {
            ec.domain = URL.parse(ec.url).hostname;
          }
          if (ec.date) {
            ec.date = moment(ec.date, regex.dateFormat).format();
          }
          return;
        }
      });
      if (ec) {
        if (ignoredDomains.indexOf(ec.domain) == -1) {
          if (estValide(ec)) {
            if (parsers[ec.domain]) {
              var parser = parsers[ec.domain].parser;
              ec.host = crypto.createHash('md5').update(ec.host).digest("hex");

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
      }
      countLines++;
    });
  });
  
  /**
   * GET route on /ws/
   */
  app.get('/ws/', function (req, res) {
    res.render('ws');
  });
  
};