'use strict';

var fs          = require('graceful-fs');
var csv         = require('csv');
var moment      = require('moment');
var JR1Reporter = require('../counter-reporters/jr1.js');

module.exports = function counterize() {

  var optimist = require('optimist')
    .usage('Generate a counter report out of a CSV result file' +
      '\n  Usage: $0 [-hiofv]')
    .alias('input', 'i')
    .describe('input', 'Input file (defaults to stdin).')
    .alias('output', 'o')
    .describe('output', 'Output file (defaults to stdout).')
    .alias('delimiter', 'd')
    .describe('delimiter', 'Delimiter of the CSV fields (defaults to ;).')
    .default('delimiter', ';')
    .alias('format', 'f')
    .describe('format', 'Report file format : XML or CSV (defaults to csv).')
    .default('format', 'csv');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  var inputStream;
  if (argv.input) {
    if (!fs.existsSync(argv.input)) {
      console.error(argv.input + ' does not exist');
      process.exit(1);
    }
    inputStream = fs.createReadStream(argv.input);
  } else {
    inputStream = process.stdin;
  }

  var outputStream;
  if (argv.output) {
    outputStream = fs.createWriteStream(argv.output);
  } else {
    outputStream = process.stdout;
  }

  var jr1 = new JR1Reporter();

  csv().from(inputStream, { delimiter: argv.delimiter, columns: true })
  .on('record', function (ec) {
    if (!ec.timestamp) {
      if (ec.datetime)   { ec.timestamp = moment(ec.datetime).unix(); }
      else if (ec.epoch) { ec.timestamp = ec.epoch; }
      else if (ec.date)  { ec.timestamp = moment(ec.date).unix(); }
    }
    jr1.count(ec);
  })
  .on('end', function () {
    var report = jr1.generateReport(argv.format);
    outputStream.write(report);
  })
  .on('error', function (err) {
    console.error(err);
    process.exit(1);
  });
};

