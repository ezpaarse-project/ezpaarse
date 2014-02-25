'use strict';

var csv = require('csv');

/*
* CsvExtractor takes one or several csv sources
* and puts them into a json object
*/
function extractFrom(source, fields, recordList, callback, options) {
  var isArray = Array.isArray(source);
  var next    = false;
  if (isArray) {
    next = source.pop();
    if (!next) {
      callback(null, recordList);
      return;
    }
  }

  var length = fields ? fields.length : false;
  var delimiter = options.delimiter ? options.delimiter : ';';

  csv().from(next ? next : source, { delimiter: delimiter || ';', columns: true })
  .on('record', function (data) {
    var record = {};

    if (!length) {
      fields = Object.keys(data);
      var keyIndex = fields.indexOf(options.key);
      if (keyIndex !== -1) {
        fields.splice(keyIndex, 1);
      } else {
        options.key = false;
        recordList = [];
      }
      length = fields.length;
    }

    for (var i = 0; i < length; i++) {
      var field = fields[i];
      if (options.silent && !data[field]) { continue; }
      if (options.remove) {
        record[field.replace(options.remove, '')] = data[field];
      } else {
        record[field] = data[field];
      }
    }

    if (options.key) {
      recordList[data[options.key]] = record;
    } else {
      if (Object.keys(record).length > 0 || options.keepEmptyRecords) {
        recordList.push(record);
      }
    }
  })
  .on('end', function () {
    if (isArray) {
      extractFrom(source, fields, recordList, callback, options);
    } else {
      callback(null, recordList);
    }
    return;
  }).on('error', function (err) {
    callback(err, recordList);
  });
}

exports.toCsv = function (source, fields, options) {
  options = { header: options.header };
  if (fields.length > 0) {
    options.columns = fields;
  }

  csv()
  .from(source, {delimiter: ';', columns: true})
  .to(process.stdout, options)
  .on('end', function () {
    process.stdout.write('\n');
  });
};

exports.extract = function (source, options, callback) {
  if (typeof options == 'function') {
    callback = options;
    options  = {};
  }
  options        = options ? options : {};
  options.fields = options.fields || [];
  options.silent = options.silent || false;

  if (options.key) {
    if (options.fields.length > 0) {
      var keyIndex = options.fields.indexOf(options.key);
      if (keyIndex !== -1) {
        options.fields.splice(keyIndex, 1);
      } else {
        options.key = false;
      }
    }
  } else {
    options.key = false;
  }
  var recordList = options.key ? {} : [];
  extractFrom(source, options.fields, recordList, callback, options);
};