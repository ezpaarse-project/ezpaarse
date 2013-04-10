/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

module.exports = function(outputStream) {
  var that = this;
  that.output = outputStream;
  that.fields = [
    'host',
    'login',
    'date',
    'status',
    'size',
    'domain',
    'type',
    'doi',
    'issn',
    'eissn',
    'platform',
    'url'
  ];

  that.start = function(fields, fieldsUsage) {
    if (fields && Array.isArray(fields)) {
      if (fieldsUsage && fieldsUsage == 'add') {
        fields.forEach(function (field) {
          if (that.fields.indexOf(field) === -1) {
            that.fields.push(field);
          }
        });
      } else {
        that.fields = fields;
      }
    }

    if (that.fields[0]) {
      that.output.write(that.fields[0]);
    }

    for (var i = 1, l = that.fields.length; i<l; i++) {
      that.output.write(';' + that.fields[i]);
    }
    that.output.write('\n');
  }

  that.end = function() {}

  that.write = function(ec) {
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