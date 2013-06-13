/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var moment = require('moment');

/**
 * Provides methods to write ECs into a stream in CSV format.
 * @param {Object} outputStream the stream to write into
 * @param {Array}  outputFields the default fields to use as headers
 */
module.exports = function (outputStream, outputFields) {
  var that = this;
  that.output = outputStream;
  that.fields = outputFields || [];

  /**
   * Called before writing the first EC
   * @param {Array}  fields      fields to use as headers
   * @param {String} fieldsUsage specify whether we should add fields
   *                              to the defaults or replace them
   */
  that.start = function (fields) {
    fields.added.forEach(function (field) {
      if (that.fields.indexOf(field) === -1) {
        that.fields.push(field);
      }
    });

    fields.removed.forEach(function (field) {
      var index = that.fields.indexOf(field);
      if (index !== -1) {
        that.fields.splice(index, 1);
      }
    });

    if (that.fields[0]) {
      if (/;/.test(that.fields[0])) {
        that.output.write('"' + that.fields[0].replace('"', '""') + '"');
      } else {
        that.output.write(that.fields[0]);
      }
    }

    for (var i = 1, l = that.fields.length; i < l; i++) {
      if (/;/.test(that.fields[i])) {
        that.output.write(';"' + that.fields[i].replace('"', '""') + '"');
      } else {
        that.output.write(';' + that.fields[i]);
      }
    }
    that.output.write('\n');
  }

  /**
   * Called at at the end of writing
   */
  that.end = function () {}

  /**
   * Write an EC
   * @param {Object} ec the EC to write
   */
  that.write = function (ec) {
    var str = '';
    for (var i in that.fields) {
      if (ec[that.fields[i]]) {
        if (/;/.test(ec[that.fields[i]])) {
          str += '"' + ec[that.fields[i]].replace('"', '""') + '"';
        } else {
          str += ec[that.fields[i]];
        }
      }
      str += ';';
    }
    that.output.write(str.replace(/;$/, '\n'));
  };
};