'use strict';

/**
 * Log file cleaner
 * Takes a log file and and makes its critical data (hosts, logins) anonymous
 * @param1 log file to clean
 * @param2 destination of the clean log file
 */

exports.logAnonymizer = function () {

  var Lazy   = require('lazy');
  var faker  = require('faker');
  var fs     = require('fs-extra');
  var parser = require('../logparser.js');

  // get the command line arguments
  var yargs = require('yargs')
    .usage('Anonymize critical data in a log file' +
      '\nUsage: $0 --input=[string] --output=[string] --proxy=[string] --format=[string]')
    .alias('help', 'h')
    .alias('input', 'i')
    .alias('output', 'o')
    .alias('proxy', 'p')
    .alias('format', 'f')
    .alias('verbose', 'v')
    .describe('input', 'the input data to clean')
    .describe('output', 'the destination where to send the result to')
    .describe('proxy', 'the proxy which generated the log file')
    .describe('format', 'the format of log lines (ex: %h %u %t "%r")')
    .describe('verbose', 'when process is over, print details in stderr');
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

  var hosts          = {};
  var logins         = {};
  var fakeHostsList  = {};
  var fakeLoginsList = {};

  var lazy    = new Lazy(logStream);
  var nbRead  = 0;
  var nbEmpty = 0;
  var nbWrong = 0;

  lazy.lines.map(String).forEach(function (line) {
    nbRead++;

    line = line.toString().replace(/\r$/, '');
    if (!line) {
      console.error('line %d: removed (line is empty)', nbRead);
      nbEmpty++;
      return;
    }

    var ec = logParser.parse(line);
    if (!ec) {
      console.error('line %d: removed (wrong format)', nbRead);
      nbWrong++;
      return;
    }

    if (ec.host) {
      var fakeHost = hosts[ec.host];
      if (!fakeHost) {
        fakeHost = faker.internet.ip();
        while (fakeHostsList[fakeHost]) {
          fakeHost = faker.internet.ip();
        }
        fakeHostsList[fakeHost] = ec.host;
        hosts[ec.host]          = fakeHost;
      }
      line = line.replace(ec.host, fakeHost);
    }

    if (ec.login) {
      var fakeLogin = logins[ec.login];
      if (!fakeLogin) {
        fakeLogin = faker.internet.userName().replace('\'', '').toUpperCase();
        while (fakeLoginsList[fakeLogin]) {
          fakeLogin = faker.internet.userName().replace('\'', '').toUpperCase();
        }
        fakeLoginsList[fakeLogin] = ec.login;
        logins[ec.login]          = fakeLogin;
      }
      line = line.replace(ec.login, fakeLogin);
    }

    resultStream.write(line + '\n');
  });

  lazy.on('end', function () {
    if (argv.verbose) {
      console.error('--- process details ---');
      console.error('Proxy: %s', logParser.getProxy());
      console.error('Format: %s', logParser.getFormat());
      console.error('Regex: %s', logParser.getRegexp());
      console.error('Lines read: %d', nbRead);
      console.error('Empty: %d', nbEmpty);
      console.error('Wrong format: %d', nbWrong);
    }
  });
};
