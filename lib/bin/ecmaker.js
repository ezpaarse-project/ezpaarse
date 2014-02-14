'use strict';


exports.EcMaker = function () {
  var fs      = require('graceful-fs');
  var config  = require('../config.js');
  var path    = require('path');
  var ecmake  = require('../../lib/ecmake.js');

  var outpath;

  // skip rejeted files
  var headers = {};
  var url = 'http://127.0.0.1:' + config.EZPAARSE_NODEJS_PORT;

  var optimist = require('optimist')
    .usage('Inject a file to ezPAARSE (for batch purpose)' +
      '\n  Usage: $0 [-fhiovH]')
    .boolean(['v', 'f'])
    .alias('input', 'i')
    .describe('input', 'Input log file (if omited, wait for standard input)')
    .alias('outpath', 'o')
    .describe('outpath', 'If provided, output directory (default tmp).')
    .alias('force', 'f')
    .describe('force', 'override existing result (default false).')
    .alias('headers', 'H')
    .string('headers')
    .describe('headers', 'headers parameters to use.')
    .alias('verbose', 'v')
    .describe('verbose', 'Shows detailed operations.');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  if (argv.headers) {
    if (Array.isArray(argv.headers)) {
      argv.headers.forEach(function (item) {
        var h = item.split(':');
        headers[h[0]] = h[1].trim();
      });
    } else {
      var h = argv.headers.split(':');
      headers[h[0]] = h[1].trim();
    }
  } else {
    headers = { 'Reject-Files': 'none'};
  }

  var options = {
    url: url,
    headers: headers
  };

  if (argv.outpath) {
    outpath = argv.outpath;
  } else {
    outpath = path.join(__dirname, "../../tmp");
  }

  if (outpath) {
    if (! fs.existsSync(outpath)) {
      console.error("Error : " + outpath + " doesn't exist");
      process.exit(1);
    }
    if (argv.verbose) { console.log("Output to " + outpath + " directory"); }
  }

  ecmake.EcMake(argv.input ? argv.input : false, outpath, options, argv);
};

