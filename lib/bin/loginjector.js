/*eslint max-len: 0*/
'use strict';

/**
 * Log injector: Inject data into ezPAARSE and gets the response
 */

exports.logInjector = function () {

  var fs      = require('graceful-fs');
  var request = require('request');
  var config  = require('../config.js');

  var yargs = require('yargs')
      .usage('Inject data into ezPAARSE and gets the response' +
        '\nUsage: $0')
      .alias('help', 'h')
      .alias('input', 'i')
      .alias('output', 'o')
      .alias('server', 's')
      .alias('proxy', 'p')
      .alias('format', 'f')
      .alias('accept', 'a')
      .alias('encoding', 'e')
      .describe('input', 'a file to inject into ezPAARSE (default: stdin)')
      .describe('output', 'a file to send the result to (default: stdout)')
      .describe('server', 'the server to send the request to (ex: http://ezpaarse.couperin.org). ' +
          'If none, will send to the local ezPAARSE installation.')
      .describe('proxy', 'the proxy which generated the log file')
      .describe('format', 'the format of log lines (ex: %h %u %t "%r")')
      .describe('encoding', 'encoding of sent data (gzip, deflate)')
      .describe('accept', 'wanted type for the response (text/csv, application/json)');
  var argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

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

  var headers = {};

  if (argv.proxy && argv.format) {
    headers['Log-Format-' + argv.proxy] = argv.format;
  }

  if (argv.encoding) {
    headers['Content-Encoding'] = argv.encoding;
  }

  if (argv.accept) {
    headers['Accept'] = argv.accept;
  }

  var url = 'http://127.0.0.1:' + config.EZPAARSE_NODEJS_PORT;
  if (argv.server) {
    url = argv.server;
  }

  var options = {
    url: url,
    headers: headers
  };

  logStream.pipe(request.post(options)).pipe(resultStream);
};