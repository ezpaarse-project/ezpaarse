/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var csv = require('csv');
var fs = require('fs');

module.exports = function (file, fields, callback) {
  if (!/\.csv$/.test(file) || !fs.existsSync(file)) {
    return false;
  }

  var recordList = [];
  var length = fields ? fields.length : false;

  csv().from.path(file, {columns: true})
  .on('record', function (data) {
    if (!length) {
      recordList.push(data);
    } else {
      var record = {};
      for(var i = 0; i<length; i++) {
          record[fields[i]] = data[fields[i]];
      }
      recordList.push(record);
    }
  })
  .on('end', function () {
    callback(recordList);
  });
}