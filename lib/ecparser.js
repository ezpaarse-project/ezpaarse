'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var async        = require('async');
var Lazy         = require('lazy');
var spawn        = require('child_process').spawn;

/**
 * Create an EC handler
 * @param {Object} logger  an instance of winston.Logger
 */
function ECParser(logger) {
  var self       = this;
  self.saturated = false;
  self.logger    = logger;

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
    self.saturated = false;
    self.emit('drain');
  };
}
util.inherits(ECParser, EventEmitter);
module.exports = ECParser;


ECParser.prototype.drain = function () {
  if (this.queue.length() === 0) {
    this.emit('drain');
  }
};

/**
 * Push an EC array to the queue
 * @param {Array}  ecArray  the ECs to parse
 * @param {Object} parser   an object whih contains parser informations
 *                          (file, isNode, platform)
 */
ECParser.prototype.push = function (ecArray, parser) {
  this.queue.push({ ecArray: ecArray, parser: parser });
};

/**
 * Merge an EC with the result of parsing and send it.
 * @param  {Object} ec     the ec being processed and the original line
 * @param  {Object} result the result of the url parsing
 */
ECParser.prototype.merge = function (ec, result) {
  if (result.hasOwnProperty('_granted')) {
    ec._meta.granted = result._granted;
    delete result._granted;
  }
  for (var property in result) {
    ec[property] = result[property];
  }
  this.emit('ec', ec);
};

/**
 * Parse an array of ECs using javascript.
 * @param  {Array}    ecArray  the array to be processed
 * @param  {Object}   parser   file/platform of the parser to use
 * @param  {Function} callback a function to call when the process is done
 */
ECParser.prototype.process = function (ecArray, parser, callback) {
  var results = require(parser.file).execute(ecArray);

  for (var i = 0, l = results.length; i < l; i++) {
    this.merge(ecArray[i], results[i], parser);
  }
  callback(null);
};

/**
 * Parse an array of ECs using a child process.
 * @param  {Array}    ecArray  the array to be processed
 * @param  {Object}   parser   file/platform of the parser to use
 * @param  {Function} callback a function to call when the process is done
 */
ECParser.prototype.processChild = function (ecArray, parser, callback) {
  var self  = this;
  var child = spawn(parser.file, ['--json']);
  var ec;

  var processLine = function (line) {
    if (ec) {
      var result;
      try {
        result = JSON.parse(line);
      } catch (e) {
        self.logger.error('The value returned by the parser couldn\'t be parsed to JSON');
      }
      if (result instanceof Object) {
        self.merge(ec, result, parser);
      } else {
        self.logger.error('The value returned by the parser couldn\'t be parsed to JSON');
      }

      ec = ecArray.pop();
      if (ec) {
        child.stdin.write(JSON.stringify(ec) + '\n');
      } else {
        child.stdin.end();
      }
    }
  };

  var lazy = new Lazy(child.stdout);
  lazy.lines
      .map(String)
      .forEach(processLine);
  lazy.on('end', callback);

  child.on('exit', function (code) {
    if (code === 0) {
      self.logger.verbose('Child process successfully completed');
    } else {
      self.logger.verbose('Child process failed');
    }
  });

  ec = ecArray.pop();
  if (ec) {
    child.stdin.write(JSON.stringify(ec) + '\n');
  } else {
    child.stdin.end();
  }
};
