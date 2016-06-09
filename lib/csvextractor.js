'use strict';

var fs     = require('fs');
var csv    = require('csv');
var Stream = require('stream');

/*
* CsvExtractor takes one or several csv sources
* and puts them into a json object
*/
function extractFrom(sourceList, fields, recordList, callback, options) {
  if (!Array.isArray(sourceList)) { sourceList = [sourceList]; }

  var source = sourceList.pop();
  if (!source) {
    return callback(null, recordList);
  }

  var length     = fields ? fields.length : false;
  var parseError = null;
  var parser     = csv.parse({
    'delimiter': options.delimiter || ';',
    'relax_column_count': options.strictColumnCount || true,
    'columns': true
  });

  parser.on('readable', function () {
    var data   = parser.read();
    var record = {};

    if (!data) { return; }

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
  }).on('finish', function () {
    if (parseError) { return callback(parseError, recordList); }
    extractFrom(sourceList, fields, recordList, callback, options);
  }).on('error', function (err) {
    if (!parseError) {
      parseError = err;
      parser.end();
    }
  });

  if (typeof source == 'string') {
    fs.exists(source, function (exists) {
      if (exists) {
        fs.createReadStream(source).pipe(parser);
      } else {
        parser.write(source);
        parser.end();
      }
    });
  } else if (typeof source == 'object' && source instanceof Stream) {
    source.pipe(parser);
  } else {
    return callback(new Error('Unsupported source type'));
  }
}

exports.toCsv = function (source, fields, options) {
  options = { header: options.header };
  if (fields.length > 0) {
    options.columns = fields;
  }

  source.pipe(csv.parse({
    'delimiter': options.delimiter || ';',
    'relax_column_count': options.strictColumnCount || true,
    'columns': true
  }))
  .pipe(csv.stringify(options))
  .pipe(process.stdout);
};

exports.extract = function (source, options, callback) {
  if (typeof options == 'function') {
    callback = options;
    options  = {};
  }
  options        = options || {};
  options.fields = options.fields || [];
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

  // Reverse array in order to pop from first to last
  if (Array.isArray(source)) { source.reverse(); }

  extractFrom(source, options.fields, recordList, callback, options);
};
