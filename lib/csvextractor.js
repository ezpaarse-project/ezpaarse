/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var csv = require('csv');
var fs = require('fs');


function extractFromFile(files, fields, recordList, callback, options) {
  var file = files.pop();
  if (!file) {
    callback(recordList);
    return;
  }

  if (!/\.csv$/.test(file) || !fs.existsSync(file)) {
    extractFromFile(files, fields, recordList, callback, options);
    return;
  }

  var length = fields ? fields.length : false;

  csv().from(file, {delimiter: ';', columns: true})
  .on('record', function (data) {
    if (!length) {
      recordList.push(data);
    } else {
      var record = {};
      for (var i = 0; i < length; i++) {
        var field = fields[i];
        if (!options.silent || options.silent && data[field] != null) {
          record[field] = data[field];
        }
      }
      recordList.push(record);
    }
  })
  .on('end', function () {
    extractFromFile(files, fields, recordList, callback, options);
    return;
  });
}

function extractFromString(strings, fields, recordList, callback, options) {
  var string = strings.pop();
  if (!string) {
    callback(recordList);
    return;
  }

  if (typeof string != 'string') {
    try {
      string = string.toString();
    } catch (e) {
      extractFromString(strings, fields, recordList, callback, options);
      return;
    }
  }

  var length = fields ? fields.length : false;
  csv().from(string, {delimiter: ';', columns: true})
  .on('record', function (data) {
    if (!length) {
      recordList.push(data);
    } else {
      var record = {};
      for (var i = 0; i < length; i++) {
        var field = fields[i];
        if (!options.silent || options.silent && data[field] != null) {
          record[field] = data[field];
        }
      }
      recordList.push(record);
    }
  })
  .on('end', function () {
    extractFromString(strings, fields, recordList, callback, options);
    return;
  });
}

function extractFromStream(stream, fields, recordList, callback, options) {
  var length = fields ? fields.length : false;

  csv().from(stream, {delimiter: ';', columns: true})
  .on('record', function (data) {
    if (!length) {
      recordList.push(data);
    } else {
      var record = {};
      for (var i = 0; i < length; i++) {
        var field = fields[i];
        if (!options.silent || options.silent && data[field] != null) {
          record[field] = data[field];
        }
      }
      recordList.push(record);
    }
  })
  .on('end', function () {
    callback(recordList);
  });
}

module.exports = function (source, fields, callback, options) {
  var recordList  = [];
  options         = options ? options : {}
  options.silent  = options.silent ? options.silent : false;
  options.type    = options.type ? options.type : 'stream';

  switch (options.type) {
  case 'files':
    extractFromFile(source, fields, recordList, callback, options);
    break;
  case 'strings':
    extractFromString(source, fields, recordList, callback, options);
    break;
  case 'stream':
  default:
    extractFromStream(source, fields, recordList, callback, options)
    break;
  }

}