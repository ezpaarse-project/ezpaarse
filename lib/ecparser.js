'use strict';

var EventEmitter   = require('events').EventEmitter;
var util           = require('util');
var async          = require('async');
var fs             = require('fs');
var MatchStream    = require('match-stream');
var shell          = require('shelljs');
var BuffersHandler = require('./ecbuffershandler.js');

/**
 * Create an EC handler
 * @param {Object} logger  an instance of winston.Logger
 * @param {Object} sh      a handler for log writestreams
 * @param {Object} report  the report manager
 */
var ECParser = function (logger, sh, ufSplitters, report) {
  var self = this;
  self.buffersHandler = new BuffersHandler(50);
  self.saturated      = false;

  self.queue = async.queue(function (task, callback) {
    var ecArray = task.ecArray;
    var parser  = task.parser;

    if (parser.isNode) {
      self.process(ecArray, parser, callback);
    } else {
      self.processChild(ecArray, parser, callback);
    }
  }, 10);

  self.queue.saturated = function () {
    self.emit('saturated');
    self.saturated = true;
  };

  self.queue.drain = function () {
    if (self.buffersHandler.isEmpty()) {
      self.saturated = false;
      self.emit('drain');
    } else {
      self.buffersHandler.empty();
    }
  };

  self.push = self.buffersHandler.push;
  self.buffersHandler.on('data', function (ecArray, parser) {
    self.queue.push({ ecArray: ecArray, parser: parser })
  });

  /**
   * Merge an EC with the result of parsing and send it.
   * @param  {Object} ec     the ec being processed and the original line
   * @param  {Object} result the result of the url parsing
   */
  self.merge = function (ec, result) {
    for (var property in result) {
      ec[property] = result[property];
    }
    self.emit('ec', ec);
  };

  /**
   * Parse an array of ECs using javascript.
   * @param  {Array}    ecArray  the array to be processed
   * @param  {Object}   parser   file/platform of the parser to use
   * @param  {Function} callback a function to call when the process is done
   */
  self.process = function (ecArray, parser, callback) {
    var urls = [];
    for (var i = 0, l = ecArray.length; i < l; i++) {
      urls.push(ecArray[i].url);
    }
    var results = require(parser.file).parserExecute(urls);

    for (i = 0, l = results.length; i < l; i++) {
      self.merge(ecArray[i], results[i], parser);
    }
    callback(null);
  };

  /**
   * Parse an array of ECs using a child process.
   * @param  {Array}    ecArray  the array to be processed
   * @param  {Object}   parser   file/platform of the parser to use
   * @param  {Function} callback a function to call when the process is done
   */
  self.processChild = function (ecArray, parser, callback) {
    var child = shell.exec(parser.file, {async: true, silent: true});
    var ec;
    
    var processLine = function (line) {
      if (ec) {
        var result;
        try {
          result = JSON.parse(line);
        } catch (e) {
          logger.error('The value returned by the parser couldn\'t be parsed to JSON');
        }
        if (result instanceof Object) {
          self.merge(ec, result, parser);
        } else {
          logger.error('The value returned by the parser couldn\'t be parsed to JSON');
        }
        
        ec = ecArray.pop();
        if (ec) {
          child.stdin.write(ec.url + '\n');
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

    ec = ecArray.pop();
    if (ec) {
      child.stdin.write(ec.url + '\n');
    } else {
      child.stdin.end();
    }
  };
};

util.inherits(ECParser, EventEmitter);
module.exports = ECParser;