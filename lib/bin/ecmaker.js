'use strict';


exports.EcMaker = function () {
  var fs      = require('fs');
  var config  = require('../config.js');
  var path    = require('path');
  var ecmake = require('../../lib/ecmake.js');

  var outpath;

  // skip rejeted files
  var headers = { 'Reject-Files': 'none'};
  var url = 'http://127.0.0.1:' + config.EZPAARSE_NODEJS_PORT;
  var options = {
    url: url,
    headers: headers
  };

  var optimist = require('optimist')
    .usage('Inject a file to ezPAARSE (for batch purpose)' +
      '\n  Usage: $0 [-hov] infile')
    .boolean(['v', 's'])
    .alias('input', 'i')
    .describe('input', 'Input log file')
    .alias('outpath', 'o')
    .describe('outpath', 'If provided, output directory (default tmp).')
    .alias('verbose', 'v')
    .describe('verbose', 'Shows detailed operations.');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  if (argv.outpath) {
    outpath = argv.outpath;
  } else {
    outpath = path.join(__dirname, "../../tmp");
  }

  if (outpath) {
    if (!fs.statSync(outpath).isDirectory()) {
      console.error(outpath + " not a directory");
      process.exit(1);
    }
  }

  ecmake.EcMake(argv.input ? argv.input : false, outpath, options, argv);
};

