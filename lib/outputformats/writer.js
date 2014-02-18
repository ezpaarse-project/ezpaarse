'use strict';

var fs   = require('graceful-fs');
var path = require('path');
var outputFields = require('../config.js').EZPAARSE_OUTPUT_FIELDS;

module.exports = function (outputStream, format) {
  var writerFile = path.join(__dirname, format + '.js');
  if (fs.existsSync(writerFile)) {
    var Writer = require(writerFile);
    return new Writer(outputStream, outputFields.slice());
  }
  return false;
};