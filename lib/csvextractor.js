#!/usr/bin/env node
/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var csv = require('csv');
var fs = require('fs');

/*
* CsvExtractor takes one or several csv sources
* and puts them into a json object
*/

function extractFrom(source, fields, recordList, callback, options) {
  var isArray = Array.isArray(source);
  if (isArray) {
    var next = source.pop();
    if (!next) {
      callback(recordList);
      return;
    }
  }

  var length = fields ? fields.length : false;

  csv().from(next ? next : source, {delimiter: ';', columns: true})
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
      if (!options.silent || options.silent && data[field] != null) {
        record[field] = data[field];
      }
    }

    if (options.key) {
      recordList[data[options.key]] = record;
    } else {
      recordList.push(record);
    }
  })
  .on('end', function () {
    if (isArray) {
      extractFrom(source, fields, recordList, callback, options);
    } else {
      callback(recordList);
    }
    return;
  });
}

exports.extract = function(source, fields, callback, options) {
  options         = options ? options : {}
  options.silent  = options.silent ? options.silent : false;
  options.type    = options.type ? options.type : 'stream';
  
  if (options.key) {
    if (fields.length > 0) {
      var keyIndex = fields.indexOf(options.key);
      if (keyIndex !== -1) {
        fields.splice(keyIndex, 1);
      } else {
        options.key = false;
      }
    }
  } else {
    options.key = false;
  }
  var recordList = options.key ? {} : [];
  extractFrom(source, fields, recordList, callback, options);

}

if (!module.parent) {
  var optimist = require('optimist')
    .usage('Parse a csv source into json.' +
      '\n  Usage: $0 [-f][-fd][-k][-s]')
    .alias('file', 'f')
    .alias('fields', 'fd')
    .alias('key', 'k')
    .alias('silent', 's')
    .describe('file', 'A csv file to parse. If absent, will read from standard input.')
    .describe('fields', 'A list of fields to extract. Default extract all fields. (Ex: --fields issn,pid)')
    .describe('key', 'If provided, the matching field will be used as a key in the resulting json.')
    .describe('silent', 'If provided, empty values or unexisting fields won\'t be showed in the results.');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  var options = {};
  var fields  = [];
  var source = argv.file ? argv.file : process.stdin;

  if (argv.fields) {
    fields = argv.fields.split(',');
  }
  if (argv.key) {
    options.key = argv.key;
  }
  if (argv.silent) {
    options.silent = true;
  }
console.log(source);
  exports.extract(source, fields, function (records) {
    process.stdout.write(JSON.stringify(records, null, 2) + '\n');
  }, options);
}