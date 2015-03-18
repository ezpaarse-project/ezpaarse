'use strict';

var stream = require('stream');

/**
 * Stream that split input into lines with a security upon buffer size
 */
function Splitter(maxBufferSize) {
  stream.Transform.call(this, { objectMode: true });

  this._buffer        = '';
  this._overflow      = false;
  this._maxBufferSize = maxBufferSize || 100000;
}

require('util').inherits(Splitter, stream.Transform);
module.exports = Splitter;

Splitter.prototype._transform = function(chunk, encoding, callback) {
  var self      = this;
  this._buffer += chunk.toString(encoding);
  var lines     = this._buffer.split(/\r?\n/);
  this._buffer  = lines.pop() || '';

  if (Buffer.byteLength(this._buffer, encoding) > this._maxBufferSize) {
    this._overflow = true;
    var err  = new Error('Maximum buffer size exceeded, no line breaks detected');
    err.code = 'ENOBREAKS';
    return callback(err);
  }

  lines.forEach(function (line) { self.push(line); });
  callback();
};

Splitter.prototype._flush = function(callback) {
  var self = this;

  if (!this._overflow) {
    this._buffer.split(/\r?\n/).forEach(function (line) { self.push(line); });
  }
  callback();
};
