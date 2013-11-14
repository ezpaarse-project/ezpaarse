'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Create an EC organizer, used to put ECs in a good order
 */
function Organizer() {
  this.buffer = {};
  this.next   = 1;
  this.last   = false;
}
util.inherits(Organizer, EventEmitter);
module.exports = Organizer;

/**
 * Push an EC into the buffer
 * @param  {Object} ec
 */
Organizer.prototype.push = function (ec) {
  this.buffer[ec._meta.lineNumber] = ec;
  if (ec._meta.lineNumber == this.next) { this.freeNext(); }
};

/**
 * Emit or skip the next EC
 */
Organizer.prototype.freeNext = function () {
  var ec = this.buffer[this.next];
  if (ec) {
    this.emit('ec', ec);
    delete this.buffer[this.next++];
    this.freeNext();
  } else if (ec === false) {
    delete this.buffer[this.next++];
    this.freeNext();
  } else if (this.last && this.last < this.next) {
    this.emit('drain');
  }
};

/**
 * Set the number of the last EC
 * @param  {Integer} n
 */
Organizer.prototype.setLast = function (n) {
  this.last = n;
  if (this.last < this.next) { this.emit('drain'); }
};

/**
 * Let the organizer know that it should skip a specific number
 * @param  {Integer} n
 */
Organizer.prototype.skip = function (n) {
  this.buffer[n] = false;
  if (n == this.next) { this.freeNext(); }
};
