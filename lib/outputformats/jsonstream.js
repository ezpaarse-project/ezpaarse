'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Provides methods to write ECs into a stream in JSON Stream format.
 * @param {Object} outputStream the stream to write into
 */
var Writer = function (outputStream) {
  var self      = this;
  var firstLine = true;

  outputStream.on('drain', function () {
    self.emit('drain');
  });

  /**
   * Called before writing the first EC
   */
  self.writeHead = function () {
  };

  /**
   * Called at at the end of writing
   */
  self.writeEnd = function () {
  };

  /**
   * Write an EC
   * @param {Object} ec the EC to write
   */
  self.write = function (ec) {
    if (!outputStream.write((firstLine ? '' : '\n') + JSON.stringify(ec))) {
      self.emit('saturated');
    }
    firstLine = false;
  };
};

util.inherits(Writer, EventEmitter);
module.exports = Writer;