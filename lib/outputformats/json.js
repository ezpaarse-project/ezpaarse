/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var moment = require('moment');

/**
 * Provides methods to write ECs into a stream in JSON format.
 * @param {Object} outputStream the stream to write into
 */
module.exports = function (outputStream) {
  this.output = outputStream;
  this.delimiter = '';

  /**
   * Called before writing the first EC
   */
  this.start = function () {
    this.output.write('[');
  }

  /**
   * Called at at the end of writing
   */
  this.end = function () {
    this.output.write(']');
  }

  /**
   * Write an EC
   * @param {Object} ec the EC to write
   */
  this.write = function (ec) {
    this.output.write(this.delimiter + JSON.stringify(ec, null, 2));
    if (this.delimiter === '') { this.delimiter = ','; }
  };
};