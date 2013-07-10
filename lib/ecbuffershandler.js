/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Manages multiple EC buffers and emits them when they're full
 * @param {Integer} bufferSize the max size of a buffer
 */
var BufferHandler = function (bufferSize) {
  var self = this;
  self.buffers    = {};
  self.bufferSize = bufferSize || 50;

  /**
   * Adds an EC to its corresponding buffer
   * @param  {Object} ec       the EC to add
   * @param  {String} parser   the parser self should be used for the url
   * @param  {String} platform the platform which the url comes from
   */
  self.push = function (ec, parser) {
    var parserFile = parser.file;
    if (!self.buffers[parserFile]) {
      self.buffers[parserFile] = {
        parser: parser,
        ecArray: []
      };
    }
    self.buffers[parserFile].ecArray.push(ec);

    if (self.buffers[parserFile].ecArray.length > self.bufferSize) {
      var buffer = self.buffers[parserFile];
      self.emit('data', buffer.ecArray.slice(), buffer.parser);
      delete self.buffers[parserFile];
    }
  }

  /**
   * Empty all buffers
   */
  self.empty = function () {
    var buffer;
    for (var parserFile in self.buffers) {
      buffer = self.buffers[parserFile];
      self.emit('data', buffer.ecArray.slice(), buffer.parser);
      delete self.buffers[parserFile];
    }
  }

  self.isEmpty = function () {
    return (Object.keys(self.buffers).length === 0);
  }
}

util.inherits(BufferHandler, EventEmitter);
module.exports = BufferHandler;