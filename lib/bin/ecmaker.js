/*eslint no-sync: 0*/
'use strict';


exports.EcMaker = function () {
  var fs      = require('fs-extra');
  var path    = require('path');
  var ecmaker = require('../../lib/ecmake.js');
  var outpath;

  var yargs = require('yargs')
    .usage('Inject a file to ezPAARSE (for batch purpose)' +
      '\n  Usage: $0 [-fhiovH] LOG_FILE RESULT_FILE')
    .boolean(['v', 'f'])
    .string('header')
    .alias('verbose', 'v')
    .alias('force', 'f')
    .alias('uri', 'u')
    .alias('header', 'H')
    .alias('proxy', 'p')
    .describe('force', 'override existing result (default false).')
    .describe('uri', 'the ezPAARSE instance to use.')
    .describe('header', 'header parameter to use.')
    .describe('proxy', 'a proxy to use.')
    .describe('verbose', 'Shows detailed operations.');
  var argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help || argv.h || argv._.length < 2) {
    yargs.showHelp();
    process.exit(0);
  }

  var logFile    = path.resolve(argv._[0]);
  var resultFile = path.resolve(argv._[1]);
  var headers    = { 'Reject-Files': 'none'};

  if (argv.header) {
    if (!Array.isArray(argv.header)) { argv.header = [argv.header]; }

    argv.header.forEach(function (item) {
      var i = item.indexOf(':');
      if (i !== -1) {
        headers[item.substr(0, i)] = item.substr(i + 1).trim();
      } else {
        console.error('Error : bad header syntax => %s', item);
        process.exit(1);
      }
    });
  }

  if (outpath) {
    if (!fs.existsSync(outpath)) {
      console.error('Error : ' + outpath + ' doesn\'t exist');
      process.exit(1);
    }
    if (argv.verbose) { console.log('Output to ' + outpath + ' directory'); }
  }

  var options = {
    uri: argv.uri,
    headers: headers
  };

  if (typeof argv.proxy === 'string') {
    options.proxy = argv.proxy || null;
  }

  ecmaker()
    .file(logFile)
    .result(resultFile)
    .options(options)
    .process(function (err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
};

