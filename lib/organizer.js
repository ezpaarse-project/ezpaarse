'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Create an EC organizer, used to put ECs in a good order
 */
var Organizer = function () {
  var self   = this;
  var buffer = {};
  var next   = 1;
  var last   = false;

  /**
   * Push an EC into the buffer
   * @param  {Object} ec
   */
  self.push = function (ec) {
    buffer[ec._meta.lineNumber] = ec;
    if (ec._meta.lineNumber == next) { freeNext(); }
  };

  /**
   * Emit or skip the next EC
   */
  function freeNext() {
    var ec = buffer[next];
    if (ec) {
      self.emit('ec', ec);
      delete buffer[next++];
      freeNext();
    } else if (ec === false) {
      delete buffer[next++];
      freeNext();
    } else if (last && last < next) {
      self.emit('drain');
    }
  }

  /**
   * Set the number of the last EC
   * @param  {Integer} n
   */
  self.setLast = function (n) {
    last = n;
    if (last < next) { self.emit('drain'); }
  };

  /**
   * Let the organizer know that it should skip a specific number
   * @param  {Integer} n
   */
  self.skip = function (n) {
    buffer[n] = false;
    if (n == next) { freeNext(); }
  };
};

util.inherits(Organizer, EventEmitter);
module.exports = Organizer;