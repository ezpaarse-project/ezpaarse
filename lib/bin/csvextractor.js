'use strict';

/*
* Command used to parse a csv source into json or csv
*/

exports.csvExtractor = function () {
  var csvextractor = require('../../lib/csvextractor.js');
  var yargs = require('yargs')
    .usage('Parse a csv source into json.' +
      '\n  Usage: $0 [-sc] [-f string | -d string | -k string] [--no-header]')
    .alias('file', 'f')
    .alias('fields', 'd')
    .alias('delimiter', 'l')
    .alias('key', 'k')
    .alias('silent', 's')
    .alias('csv', 'c')
    .alias('json', 'j')
    .alias('jsonstream', 'js')
    .describe('file', 'A csv file to parse. If absent, will read from standard input.')
    .describe('fields',
      'A list of fields to extract. Default extract all fields. (Ex: --fields issn,pid)')
    .describe('delimiter', 'csv delimiter ("tab" or any character).')
    .describe('key', 'If provided, the matching field will be used as a key in the resulting json.')
    .describe('silent',
      'If provided, empty values or unexisting fields won\'t be showed in the results.')
    .describe('csv', 'If provided, the result will be a csv.')
    .describe('json', 'If provided, the result will be a JSON.')
    .describe('jsonstream', 'If provided, the result will be a JSON stream (one JSON per line).')
    .describe('noheader', 'If provided, the result won\'t have a header line. (if csv output)');
  var argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    yargs.showHelp();
    process.exit(0);
  }

  var options = {
    fields: [],
    key: argv.key,
    silent: !!argv.silent,
    delimiter: argv.delimiter === 'tab' ? '\t' : argv.delimiter
  };
  var source = argv.file ? argv.file : process.stdin;

  if (argv.fields && argv.fields.length > 0) {
    options.fields = argv.fields.split(',');
  }

  if (argv.csv) {
    options.header = !argv['noheader'];
    return csvextractor.toCsv(source, options.fields, options);
  }

  // well formated and indented JSON
  if (argv.json) {
    csvextractor.extract(source, options, function (err, records) {
      if (err) {
        console.error(err); // just notify the error and continue
      }
      process.stdout.write(JSON.stringify(records, null, 2) + '\n');
    });
    return;
  }

  // by default jsonstream
  csvextractor.extract(source, options, function (err, records) {
    if (err) {
      console.error(err); // just notify the error and continue
    }

    records.forEach(function (record) {
      process.stdout.write(JSON.stringify(record) + '\n');
    });
  });
};
