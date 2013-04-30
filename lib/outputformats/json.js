/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var moment = require('moment');

module.exports = function (outputStream) {
  this.output = outputStream;
  this.delimiter = '';

  this.start = function () {
    this.output.write('[');
  }

  this.end = function () {
    this.output.write(']');
  }
  
  this.write = function (ec) {
    this.output.write(this.delimiter + JSON.stringify(ec, null, 2));
    if (this.delimiter === '') { this.delimiter = ','; }
  };
};