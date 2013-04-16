/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var EventEmitter   = require('events').EventEmitter;
var util           = require('util');
var async          = require('async');
var fs             = require('fs');
var MatchStream    = require('match-stream');
var shell          = require('shelljs');
var BuffersHandler = require('./ecbuffershandler.js');
var PkbManager     = require('./pkbmanager.js');

/**
 * Create an EC handler
 * @param {object} logger an instance of winston.Logger
 */
var ECHandler = function (logger, logStreams) {
  var that = this;
  that.pkbManager     = new PkbManager();
  that.buffersHandler = new BuffersHandler(50);
  that.saturated      = false;

  that.buffersHandler.on('data', function (ecArray, parser) {
    that.queue.push({ ecArray: ecArray, parser: parser });
  });

  /**
   * Push an EC to the buffers handler.
   * @param  {Object} ec       the EC to push
   * @param  {String} line     the log line which was extracted
   * @param  {String} parser   the parser that should be used for the url
   */
  that.push = function (ec, line, parser) {
    that.buffersHandler.push(ec, line, parser);
  }

  that.queue = async.queue(function (task, callback) {
    var ecArray = task.ecArray;
    var parser  = task.parser;

    that.pkbManager.get(parser.platform, function (pkb) {
      if (parser.isNode) {
        that.process(ecArray, parser, pkb, callback);
      } else {
        that.processChild(ecArray, parser, pkb, callback);
      }
    });
  }, 10);

  that.queue.saturated = function () {
    that.emit('saturated');
    that.saturated = true;
  };

  that.queue.drain = function () {
    if (that.buffersHandler.isEmpty()) {
      that.saturated = false;
      that.emit('drain');
    } else {
      that.buffersHandler.empty();
    }
  };

  /**
   * Merge an EC with the result of parsing.
   * Emit ECs that can be written.
   * @param  {Object} log    the ec being processed and the original line
   * @param  {Object} result the result of the url parsing
   * @param  {Object} pkb    the knowledge base where we search the PIDs
   * @param  {Object} parser file/platform of the parser
   */
  that.merge = function (log, result, pkb, parser) {
    var ec = log.ec;
    if (result.type) {
      ec.type = result.type;
    }
    if (result.doi) {
      ec.doi = result.doi;
    }
    if (result.eissn) {
      ec.eissn = result.eissn;
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
          logger.silly('The PID couldn\'t be found in the PKB');
          logStreams.pkbMissECs.write(log.line + '\n');
        }
      } else {
        logger.silly('No knowledge base found');
      }
    } else {
      logger.silly('The parser couldn\'t find any id in the given URL');
    }
    ec.platform = parser.platform;
    if (ec.issn || ec.eissn || ec.doi || ec.type) {
      that.emit('ec', ec);
    } else {
      logger.silly('Unqualified EC, not written');
      logStreams.unqualifiedECs.write(log.line + '\n');
    }
  }

  /**
   * Parse an array of ECs using javascript.
   * @param  {Array}    ecArray  the array to be processed
   * @param  {Object}   parser   file/platform of the parser to use
   * @param  {Object}   pkb      the knowledge base where we search the PIDs
   * @param  {Function} callback a function to call when the process is done
   */
  that.process = function (ecArray, parser, pkb, callback) {
    var urls = [];
    for (var i = 0, l = ecArray.length; i < l; i++) {
      urls.push(ecArray[i].ec.url);
    }
    var results = require(parser.file).parserExecute(urls);

    var result;
    var ec;
    for (i = 0, l = results.length; i < l; i++) {
      that.merge(ecArray[i], results[i], pkb, parser);
    }
    callback(null);
  }

  /**
   * Parse an array of ECs using a child process.
   * @param  {Array}    ecArray  the array to be processed
   * @param  {Object}   parser   file/platform of the parser to use
   * @param  {Object}   pkb      the knowledge base where we search the PIDs
   * @param  {Function} callback a function to call when the process is done
   */
  that.processChild = function (ecArray, parser, pkb, callback) {
    var child = shell.exec(parser.file, {async: true, silent: true});
    var log;
    
    var processLine = function (line) {
      if (log) {
        var result;
        try {
          result = JSON.parse(line);
        } catch (e) {
          logger.error('The value returned by the parser couldn\'t be parsed to JSON');
        }
        if (result instanceof Object) {
          that.merge(log, result, pkb, parser);
        } else {
          logger.error('The value returned by the parser couldn\'t be parsed to JSON');
        }
        
        log = ecArray.pop();
        if (log) {
          child.stdin.write(log.ec.url + '\n');
        } else {
          child.stdin.end();
        }
      }
    };
    var line = '';
    var matchstream = new MatchStream({ pattern: '\n', consume: true},
      function (buf, matched, extra) {
      line += buf.toString();
      if (matched) {
        processLine(line.trim());
        line = '';
      }
    });

    child.stdout.pipe(matchstream);
    
    child.on('exit', function (code) {
      if (code === 0) {
        logger.verbose('Child process successfully completed');
      } else {
        logger.verbose('Child process failed');
      }
      callback(null);
    });

    log = ecArray.pop();
    if (log) {
      child.stdin.write(log.ec.url + '\n');
    } else {
      child.stdin.end();
    }
  }
}

util.inherits(ECHandler, EventEmitter);
module.exports = ECHandler;