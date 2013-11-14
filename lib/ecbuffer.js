'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Manages multiple EC buffers and emits them when reaching a global limit
 * @param {Integer} bufferSize the max size of a buffer
 */
function ECBuffer(bufferSize) {
  this.nbEC       = 0;
  this.buffers    = {};
  this.bufferSize = bufferSize || 100;
}
util.inherits(ECBuffer, EventEmitter);
module.exports = ECBuffer;

/**
 * Adds an EC to its corresponding buffer
 * @param  {Object} ec       the EC to add
 * @param  {String} parser   the parser that should be used for the url
 * @param  {String} platform the platform which the url comes from
 */
ECBuffer.prototype.push = function (ec, parser) {
  var parserFile = parser.file;
  if (!this.buffers[parserFile]) {
    this.buffers[parserFile] = {
      parser: parser,
      ecArray: []
    };
  }
  this.buffers[parserFile].ecArray.push(ec);

  if (++this.nbEC > this.bufferSize) {
    this.drain();
  }
};

/**
 * Empty all buffers
 */
ECBuffer.prototype.drain = function () {
  var buffer;
  for (var parserFile in this.buffers) {
    buffer = this.buffers[parserFile];
    this.emit('packet', buffer.ecArray.slice(), buffer.parser);
    delete this.buffers[parserFile];
  }
  this.nbEC = 0;
  this.emit('drain');
};

ECBuffer.prototype.isEmpty = function () {
  return (Object.keys(this.buffers).length === 0);
};
