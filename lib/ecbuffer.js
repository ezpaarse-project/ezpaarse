'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Manages multiple EC buffers and emits them when reaching a global limit
 * @param {Integer} bufferSize the max size of a buffer
 */
var ECBuffer = function (bufferSize) {
  var self = this;
  var nbEC    = 0;
  var buffers = {};
  bufferSize  = bufferSize || 100;

  /**
   * Adds an EC to its corresponding buffer
   * @param  {Object} ec       the EC to add
   * @param  {String} parser   the parser that should be used for the url
   * @param  {String} platform the platform which the url comes from
   */
  self.push = function (ec, parser) {
    var parserFile = parser.file;
    if (!buffers[parserFile]) {
      buffers[parserFile] = {
        parser: parser,
        ecArray: []
      };
    }
    buffers[parserFile].ecArray.push(ec);

    if (++nbEC > bufferSize) {
      self.drain();
    }
  };

  /**
   * Empty all buffers
   */
  self.drain = function () {
    var buffer;
    for (var parserFile in buffers) {
      buffer = buffers[parserFile];
      self.emit('packet', buffer.ecArray.slice(), buffer.parser);
      delete buffers[parserFile];
    }
    nbEC = 0;
    self.emit('drain');
  };

  self.isEmpty = function () {
    return (Object.keys(buffers).length === 0);
  };
};

util.inherits(ECBuffer, EventEmitter);
module.exports = ECBuffer;