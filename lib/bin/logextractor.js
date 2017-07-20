/*eslint max-len: 0*/
'use strict';

/**
 * Command used to extract fields from log lines
 */

exports.logExtractor = function () {

  var Lazy   = require('lazy');
  var fs     = require('graceful-fs');
  var parser = require('../logparser.js');

  // get the command line argument
  // platform
  var yargs = require('yargs')
    .usage('Extract specific fields from a log stream\nUsage: $0 --fields=[string] --separator=";"')
    .demand('fields').alias('fields', 'f')
    .demand('separator').alias('separator', 'sep').alias('separator', 's').default('separator', '\t')
    .alias('input', 'i')
    .alias('output', 'o')
    .alias('proxy', 'p')
    .alias('format', 't')
    .describe('fields', 'fields to extract from log lines (ex: url,login,host)')
    .describe('separator', 'character to use between each field')
    .describe('input', 'a file to extract the fields from (default: stdin)')
    .describe('output', 'a file to write the result into (default: stdout)')
    .describe('proxy', 'the proxy which generated the log file')
    .describe('format', 'the format of log lines (ex: %h %u %t "%r")');
  var argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

  var logParser = parser({ format: argv.format, proxy: argv.proxy });

  var resultStream;
  var logStream;

  if (argv.output) {
    resultStream = fs.createWriteStream(argv.output);
  } else {
    resultStream = process.stdout;
  }
  if (argv.input) {
    logStream = fs.createReadStream(argv.input);
  } else {
    logStream = process.stdin;
  }

  var sep    = argv.separator;
  var fields = argv.fields.split(',');
  var linenb = 1;
  var lazy   = new Lazy(logStream);

  lazy.lines.map(String).forEach(function (line) {
    var ignored = false;
    var result  = '';
    var ec      = logParser.parse(line);
    if (ec) {
      fields.forEach(function (field, index) {
        if (ec[field]) {
          result += ec[field];
          if (index < fields.length - 1) { result += sep; }
        } else {
          ignored = true;
          process.stderr.write('Error: field ' + field + ' not found in line #' + linenb + '\n');
        }
      });

      // next line
      if (!ignored) {
        resultStream.write(result + '\n');
      }
    }
    linenb++;
  });
};