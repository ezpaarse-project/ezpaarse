'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Create a PressureMaster that reads a stream and manages multiple saturation flags
 */
function PressureMaster(stream) {
  this.stream    = stream;
  this.saturated = new Set();
}
util.inherits(PressureMaster, EventEmitter);
module.exports = PressureMaster;

/**
 * Read further if no saturation
 */
PressureMaster.prototype.read = function () {
  var self = this;
  setImmediate(function () {
    if (self.saturated.size === 0) {
      var data = self.stream.read();
      if (data) { self.emit('data', data); }
    }
  });
};

/**
 * Watch for "saturated" and "drain" events of an event emitter
 * @param  {EventEmitter} emitter
 * @param  {String}       element  the name used to identify it
 */
PressureMaster.prototype.watch = function (emitter, elementName) {
  if (!emitter || !elementName) { return; }
  var self = this;
  emitter.on('saturated', function () { self.addPressure(elementName);    });
  emitter.on('drain', function ()     { self.removePressure(elementName); });
};

/**
 * Add an element name to the saturation list
 * @param  {String} element
 */
PressureMaster.prototype.addPressure = function (element) {
  this.saturated.add(element);
};

/**
 * Remove an element from the saturation list
 * @param  {String} element
 */
PressureMaster.prototype.removePressure = function (element) {
  this.saturated.delete(element);
  this.read();
};

