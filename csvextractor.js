/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var csv = require('csv');
var fs = require('fs');


function extract(files, fields, recordList, callback) {
  var file = files.pop();
  if (!file) {
    callback(recordList);
    return;
  }

  if (!/\.csv$/.test(file) || !fs.existsSync(file)) {
    extract(files, fields, recordList, callback);
  }

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
    extract(files, fields, recordList, callback);
  });
}

module.exports = function (files, fields, callback) {
  var recordList = [];
  extract(files, fields, recordList, callback);
}