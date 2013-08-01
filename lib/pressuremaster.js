'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');
/**
 * Create a PressureMaster that reads a stream and manages multiple saturation flags
 */
var PressureMaster = function (stream) {
  var self      = this;
  var saturated = [];
  var data      = '';

  /**
   * Read further if no saturation
   */
  function read() {
    if (saturated.length === 0) {
      data = stream.read();
      if (data) {
        self.emit('data', data);
      }
    }
  }

  /**
   * Add an element name to the saturation list
   * @param  {String} element
   */
  self.addPressure = function (element) {
    if (saturated.indexOf(element) == -1) {
      saturated.push(element);
    }
  };

  /**
   * Remove an element from the saturation list
   * @param  {String} element
   */
  self.removePressure = function (element) {
    var index = saturated.indexOf(element);
    if (index != -1) {
      saturated.splice(index, 1);
      read();
    }
  };

  stream.on('readable', read);
  stream.on('end', function () { self.emit('end'); });
};

util.inherits(PressureMaster, EventEmitter);
module.exports = PressureMaster;