/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var debug          = require('debug')('log:ecHandler');
var EventEmitter   = require('events').EventEmitter;
var util           = require('util');
var async          = require('async');
var fs             = require('fs');
var byline         = require('byline');
var shell          = require('shelljs');
var BuffersHandler = require('./ecbuffershandler.js');
var PkbManager     = require('./pkbmanager.js');

/**
 * Takes ECs
 */
var ECHandler = function () {
  var that = this;
  that.pkbManager     = new PkbManager();
  that.buffersHandler = new BuffersHandler(50);

  that.buffersHandler.on('data', function (ecArray, parser) {
    that.queue.push({ ecArray: ecArray, parser: parser });
  });

  /**
   * Push an EC to the buffers handler.
   * @param  {Object} ec       the EC to push
   * @param  {String} parser   the parser that should be used for the url
   * @param  {String} platform the platform which the url comes from
   */
  that.push = function (ec, parser) {
    that.buffersHandler.push(ec, parser);
  }

  that.queue = async.queue(function (task, callback) {
    var ecArray = task.ecArray;
    var parser  = task.parser;

    that.pkbManager.get(parser.platform, function (pkb) {
      if (!parser.isNode) {
        that.process(ecArray, parser, pkb, callback);
      } else {
        that.processChild(ecArray, parser, pkb, callback);
      }
    });
  }, 10);

  that.queue.saturated = function () {
    that.emit('saturated');
  };

  that.queue.drain = function () {
    if (that.buffersHandler.isEmpty()) {
      that.emit('drain');
    } else {
      that.buffersHandler.empty();
    }
  };

  /**
   * Merge an EC with the result of parsing.
   * Emit ECs that can be written.
   * @param  {Object} ec     the ec being processed
   * @param  {Object} result the result of the url parsing
   */
  that.merge = function (ec, result, pkb) {
    if (result.type) {
      ec.type = result.type;
    }
    if (result.doi) {
      ec.doi = result.doi;
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
        debug('No knowledge base found');
      }
    } else {
      debug('The parser couldn\'t find any id in the given URL');
    }
    if (ec.issn || ec.eissn || ec.doi || ec.type) {
      that.emit('ec', ec);
    }
  }

  /**
   * Parse an array of ECs using javascript.
   * @param  {Array}    ecArray  the array to be processed
   * @param  {String}   parser   the parser to use
   * @param  {Function} callback a function to call when the process is done
   */
  that.process = function (ecArray, parser, pkb, callback) {
    var urls = [];
    for (var i = 0, l = ecArray.length; i < l; i++) {
      urls.push(ecArray[i].url);
    }
    var results = require(parser.file).parserExecute(urls);

    var result;
    var ec;
    for (i = 0, l = results.length; i < l; i++) {
      result = results[i];
      ec = ecArray[i];
      that.merge(ec, result, pkb);
    }
    callback(null);
  }

  /**
   * Parse an array of ECs using a child process.
   * @param  {Array}   ecArray  the array to be processed
   * @param  {String}   parser   the parser to use
   * @param  {Function} callback a function to call when the process is done
   */
  that.processChild = function (ecArray, parser, pkb, callback) {
    var child = shell.exec(parser.file, {async: true, silent: true});
    var stream = byline.createStream(child.stdout);
    var ec;

    stream.on('data', function (line) {
      if (ec) {
        var result;
        try {
          result = JSON.parse(line);
        } catch (e) {
          debug('The value returned by the parser couldn\'t be parsed to JSON');
        }
        if (result instanceof Object) {
          that.merge(ec, result, pkb);
        } else {
          debug('The value returned by the parser couldn\'t be parsed to JSON');
        }
        
        ec = ecArray.pop();
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

    ec = ecArray.pop();
    if (ec) {
      child.stdin.write(ec.url + '\n');
    } else {
      child.stdin.end();
    }
  }
}

util.inherits(ECHandler, EventEmitter);
module.exports = ECHandler;