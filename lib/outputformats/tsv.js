'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Provides methods to write ECs into a stream in TSV format.
 * @param {Object} outputStream the stream to write into
 * @param {Array}  outputFields the default fields to use as headers
 */
var Writer = function (outputStream, outputFields) {
  var self     = this;
  outputFields = outputFields || [];

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
    var header = '';
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

    if (outputFields[0]) {
      if (/\t/.test(outputFields[0])) {
        header += '"' + outputFields[0].replace('"', '""') + '"';
      } else {
        header += outputFields[0];
      }
    }

    for (var i = 1, l = outputFields.length; i < l; i++) {
      if (/;/.test(outputFields[i])) {
        header += '\t"' + outputFields[i].replace('"', '""') + '"';
      } else {
        header += '\t' + outputFields[i];
      }
    }

    outputStream.write(header + '\n');
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
    var str = '';
    for (var i in outputFields) {
      if (ec[outputFields[i]]) {
        if (/\t/.test(ec[outputFields[i]])) {
          str += '"' + ec[outputFields[i]].replace('"', '""') + '"';
        } else {
          str += ec[outputFields[i]];
        }
      }
      str += '\t';
    }

    if (!outputStream.write(str.replace(/\t$/, '\n'))) {
      self.emit('saturated');
    }
  };
};

util.inherits(Writer, EventEmitter);
module.exports = Writer;