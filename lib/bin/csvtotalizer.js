'use strict';

/**
 * Command used to extract fields from log lines
 */

var util          = require('util');
var csvextractor  = require('../../lib/csvextractor.js');

var linenb  = 0;   // lines in CSV file
var columns = {}; // result objet

// in text mode sorting function
function sortObject(obj) {
  var arr = [];
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      arr.push({
        'key': prop,
        'value': obj[prop]
      });
    }
  }
  arr.sort(function (a, b) { return a.value - b.value; });
  return arr; // returns array
}

// in text mode sorting function (reverse)
function sortObjectR(obj) {
  var arr = [];
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      arr.push({
        'key': prop,
        'value': obj[prop]
      });
    }
  }
  arr.sort(function (a, b) { return b.value - a.value; });
  return arr; // returns array
}

exports.csvTotalizer = function () {
  // get the command line argument
  // platform
  var yargs = require('yargs')
    .usage('Totalize fields from a CSV stream\n' +
      'Usage: $0 --fields=[string] --output="text|json"')
    .demand('output').alias('output', 'o').default('output', 'text')
    .demand('sort').alias('sort', 's').default('sort', 'desc')
    .describe('output', 'output : text or json')
    .describe('sort', 'sort : asc or desc in text mode')
    .describe('fields', 'fields to compute from the CSV (ex: domain;host;login;rtype;mime)');
  var argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

  var csv_fields;
  if (argv.fields) {
    csv_fields = argv.fields.split(';');
  } else {
    csv_fields = [];
  }
  var stream = process.stdin;
  csvextractor.extract(stream, { silent: true, fields: csv_fields }, function (err, records) {
    var fields = [];
    //console.log(records);
    records.forEach(function (record) {
      linenb++;
      fields = Object.keys(record);
      fields.forEach(function (field) {
        var occurence = record[field]; // to count occurence of every field

        if (columns[field]) {
          if (columns[field][occurence]) {
            columns[field][occurence]++;
          } else {
            columns[field][occurence] = 1;
          }
        } else {
          columns[field] = {};
          columns[field][occurence] = 1;
        }
      });
    });
    if (argv.output == 'json') {
      console.log(util.inspect(columns));
    } else {
      console.log('Total Evenements de Consultation : %s', linenb);
      fields = Object.keys(columns);
      // todo : sort by value desc
      fields.forEach(function (field) {
        var arr = []; // for sorting purpose, desc by default
        if (argv.sort == 'asc') { arr = sortObject(columns[field]); }
        else { arr = sortObjectR(columns[field]); }
        console.log(field + ' (' + arr.length + ')');
        arr.forEach(function (item) {
          console.log('\t%s\t = %s', item.key, item.value);
        });
      });
    }
  });
};