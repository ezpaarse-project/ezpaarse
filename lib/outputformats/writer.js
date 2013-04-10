/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs = require('fs');
var baseOutput = require('../../config.json').EZPAARSE_BASE_OUTPUT;

module.exports = function (outputStream, format) {
  if (fs.existsSync(__dirname + '/' + format + '.js')) {
    var Writer = require(__dirname + '/' + format + '.js');
    return new Writer(outputStream, baseOutput.slice());
  }
  return false;
};