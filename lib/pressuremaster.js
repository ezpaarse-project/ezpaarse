'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Create a PressureMaster that reads a stream and manages multiple saturation flags
 */
function PressureMaster(stream) {
  var self       = this;
  self.saturated = [];

  stream.on('readable', function () {
    self.read();
  });
  stream.on('end', function () { self.emit('end'); });
  self.stream = stream;
}
util.inherits(PressureMaster, EventEmitter);
module.exports = PressureMaster;

/**
 * Read further if no saturation
 */
PressureMaster.prototype.read = function () {
  if (this.saturated.length === 0) {
    var data = this.stream.read();
    if (data) {
      this.emit('data', data);
    }
  }
};

/**
 * Watch for "saturated" and "drain" events of an event emitter
 * @param  {EventEmitter} emitter
 * @param  {String}       element  the name used to identify it
 */
PressureMaster.prototype.watch = function (emitter, elementName) {
  if (!emitter) { return; }
  var self = this;
  emitter.on('saturated', function () { self.addPressure(elementName);    });
  emitter.on('drain', function ()     { self.removePressure(elementName); });
};

/**
 * Add an element name to the saturation list
 * @param  {String} element
 */
PressureMaster.prototype.addPressure = function (element) {
  if (this.saturated.indexOf(element) == -1) {
    this.saturated.push(element);
  }
};

/**
 * Remove an element from the saturation list
 * @param  {String} element
 */
PressureMaster.prototype.removePressure = function (element) {
  var index = this.saturated.indexOf(element);
  if (index != -1) {
    this.saturated.splice(index, 1);
    this.read();
  }
};

