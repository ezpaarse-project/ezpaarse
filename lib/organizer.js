'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Create an EC organizer, used to put ECs in a good order
 */
var Organizer = function (options) {
  var self   = this;
  var buffer = {};
  var next   = 1;

  self.push = function (ec) {
    buffer[ec._meta.lineNumber] = ec;
    if (ec._meta.lineNumber == next) { self.free(); }
  };

  self.free = function () {
    var ec = buffer[next];
    while (ec) {
      self.emit('ec', ec);
      delete buffer[next];
      ec = buffer[++next];
    }
  }
};

util.inherits(Organizer, EventEmitter);
module.exports = Organizer;