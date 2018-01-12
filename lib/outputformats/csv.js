'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Provides methods to write ECs into a stream in CSV format.
 * @param {Object} outputStream the stream to write into
 * @param {Array}  outputFields the default fields to use as headers
 */
var Writer = function (outputStream, outputFields) {
  var self     = this;
  outputFields = outputFields || [];

  outputStream.on('drain', function () {
    self.emit('drain');
  });

  /**
   * Called before writing the first EC
   * @param {Array}  fields      fields to use as headers
   * @param {String} fieldsUsage specify whether we should add fields
   *                              to the defaults or replace them
   */
  self.writeHead = function (fields) {
    fields.added.forEach(function (field) {
      if (outputFields.indexOf(field) === -1) {
        outputFields.push(field);
      }
    });

    fields.removed.forEach(function (field) {
      var index = outputFields.indexOf(field);
      if (index !== -1) {
        outputFields.splice(index, 1);
      }
    });

    const header = outputFields
      .map(field => /[;"]/.test(field) ? `"${field.toString().replace(/"/g, '""')}"` : field)
      .join(';');

    outputStream.write(`${header}\n`);
  };

  /**
   * Called at at the end of writing
   */
  self.writeEnd = function () {};

  /**
   * Write an EC
   * @param {Object} ec the EC to write
   */
  self.write = function (ec) {
    const str = outputFields
      .map(field => (ec[field] || '').toString().trim())
      .map(value => /[;"]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value)
      .join(';')
      .replace(/\n/g, '');

    if (!outputStream.write(`${str}\n`)) {
      self.emit('saturated');
    }
  };
};

util.inherits(Writer, EventEmitter);
module.exports = Writer;