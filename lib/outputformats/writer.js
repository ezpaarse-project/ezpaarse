/* eslint global-require: 0 */
'use strict';

const path = require('path');
const outputFields = require('../config.js').EZPAARSE_OUTPUT_FIELDS;

module.exports = function getWriter(outputStream, format) {
  let Writer;

  try {
    Writer = require(path.join(__dirname, format + '.js'));
  } catch (e) {
    return false;
  }

  const writerInstance = new Writer(outputStream, outputFields.slice());

  /**
   * Writes arbitrary string into the output stream
   */
  writerInstance.corrupt = function (str) {
    outputStream.write(str);
  };

  return writerInstance;
};