'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Create an EC organizer, used to put ECs in a good order
 */
function Organizer() {
  var self   = this;
  var buffer = new Map();
  var next   = 1;
  var last   = false;
  
  /**
   * Emit or skip the next EC
   */
  var freeNext = function () {
    var ec = buffer.get(next);
    if (ec) {
      self.emit('ec', ec);
      buffer.delete(next++);
      process.nextTick(freeNext);
    } else if (ec === false) {
      buffer.delete(next++);
      process.nextTick(freeNext);
    } else if (last && last < next && !self._drained) {
      self._drained = true;
      self.emit('drain');
    }
  };

  /**
   * Push an EC into the buffer
   * @param  {Object} ec
   */
  self.push = function (ec) {
    if (!self._drained) {
      buffer.set(ec._meta.lineNumber, ec);
      if (ec._meta.lineNumber == next) { freeNext(); }
    }
  };

  /**
   * Set the number of the last EC
   * @param  {Integer} n
   */
  self.setLast = function (n) {
    last = n;
    if (last < next && !self._drained) {
      self._drained = true;
      self.emit('drain');
    }
  };

  /**
   * Let the organizer know that it should skip a specific number
   * @param  {Integer} n
   */
  self.skip = function (n) {
    buffer.set(n, false);
    if (n == next) { freeNext(); }
  };
}
util.inherits(Organizer, EventEmitter);
module.exports = Organizer;

