/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

module.exports = function (outputStream) {
  this.output = outputStream;
  
  this.start = function () {}

  this.end = function () {}

  var firstEC = true;
  this.write = function (ec) {
    var str = '';
    if (firstEC) {
      Object.keys(ec).forEach(function (field) {
        str += field + ';';
      });
      this.output.write(str.replace(/;$/, '\n'));
      firstEC = false;
    }
    str = '';
    Object.keys(ec).forEach(function (field) {
      str += ec[field] + ';';
    });
    this.output.write(str.replace(/;$/, '\n'));
  };
};