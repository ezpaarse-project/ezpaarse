/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Manages multiple EC buffers and emits them when they're full
 * @param {Integer} bufferSize the max size of a buffer
 */
var BufferHandler = function (bufferSize) {
  var that = this;
  that.buffers    = {};
  that.bufferSize = bufferSize || 50;

  /**
   * Adds an EC to its corresponding buffer
   * @param  {Object} ec       the EC to add
   * @param  {String} parser   the parser that should be used for the url
   * @param  {String} platform the platform which the url comes from
   */
  that.push = function (ec, line, parser) {
    var parserFile = parser.file;
    if (!that.buffers[parserFile]) {
      that.buffers[parserFile] = {
        parser: parser,
        ecArray: []
      };
    }
    that.buffers[parserFile].ecArray.push({ec: ec, line: line});

    if (that.buffers[parserFile].ecArray.length > that.bufferSize) {
      var buffer = that.buffers[parserFile];
      that.emit('data', buffer.ecArray.slice(), buffer.parser);
      delete that.buffers[parserFile];
    }
  }

  /**
   * Empty all buffers
   */
  that.empty = function () {
    var buffer;
    for (var parserFile in that.buffers) {
      buffer = that.buffers[parserFile];
      that.emit('data', buffer.ecArray.slice(), buffer.parser);
      delete that.buffers[parserFile];
    }
  }

  that.isEmpty = function () {
    return (Object.keys(that.buffers).length === 0);
  }
}

util.inherits(BufferHandler, EventEmitter);
module.exports = BufferHandler;