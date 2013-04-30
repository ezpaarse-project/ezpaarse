/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var moment = require('moment');

module.exports = function (outputStream, outputFields) {
  var that = this;
  that.output = outputStream;
  that.fields = outputFields || [];

  that.start = function (fields, fieldsUsage) {
    if (fields && Array.isArray(fields)) {
      if (fieldsUsage && fieldsUsage === 'replace') {
        that.fields = fields;
      } else {
        fields.forEach(function (field) {
          if (that.fields.indexOf(field) === -1) {
            that.fields.push(field);
          }
        });
      }
    }

    if (that.fields[0]) {
      that.output.write(that.fields[0]);
    }

    for (var i = 1, l = that.fields.length; i < l; i++) {
      that.output.write(';' + that.fields[i]);
    }
    that.output.write('\n');
  }

  that.end = function () {}

  that.write = function (ec) {
    var str = '';
    for (var i in that.fields) {
      if (ec[that.fields[i]]) {
        str += ec[that.fields[i]];
      }
      str += ';';
    }
    that.output.write(str.replace(/;$/, '\n'));
  };
};