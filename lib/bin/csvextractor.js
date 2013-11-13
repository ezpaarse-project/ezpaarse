'use strict';

/*
* Command used to parse a csv source into json or csv
*/

exports.csvExtractor = function () {
  var csvextractor = require('../../lib/csvextractor.js');
  var optimist = require('optimist')
    .usage('Parse a csv source into json.' +
      '\n  Usage: $0 [-sc] [-f string | -d string | -k string] [--no-header]')
    .alias('file', 'f')
    .alias('fields', 'd')
    .alias('key', 'k')
    .alias('silent', 's')
    .alias('csv', 'c')
    .describe('file', 'A csv file to parse. If absent, will read from standard input.')
    .describe('fields',
              'A list of fields to extract. Default extract all fields. (Ex: --fields issn,pid)')
    .describe('key', 'If provided, the matching field will be used as a key in the resulting json.')
    .describe('silent',
              'If provided, empty values or unexisting fields won\'t be showed in the results.')
    .describe('csv', 'If provided, the result will be a csv.')
    .describe('noheader', 'If provided, the result won\'t have a header line. (if csv output)');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  var options = {};
  var fields  = [];
  var source = argv.file ? argv.file : process.stdin;

  if (argv.fields && argv.fields.length > 0) {
    fields = argv.fields.split(',');
  }
  if (argv.csv) {
    options.header = true;
    if (argv['noheader']) {
      options.header = false;
    }
    csvextractor.toCsv(source, fields, options);
    return;
  }
  if (argv.key) {
    options.key = argv.key;
  }
  if (argv.silent) {
    options.silent = true;
  }

  csvextractor.extract(source, fields, function (err, records) {
    if (err) {
      console.error(err); // just notify the error and continue
    }
    process.stdout.write(JSON.stringify(records, null, 2) + '\n');
  }, options);
};