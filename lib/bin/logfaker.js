/*jslint node: true, maxlen: 150, maxerr: 50, indent: 2 */
'use strict';

/**
 * Command used to generate random log
 */

exports.logFaker = function () {

  var fs           = require('fs');
  var Faker        = require('Faker');
  var moment       = require('moment');
  var csvextractor = require('../csvextractor.js');
  var platformsDir = __dirname + '/../../platforms/';
  var logF         = require('../logfaker.js');

  // get the command line argument
  // platform
  var optimist = require('optimist')
      .usage('Usage: $0 --platform=[string] --nb=[num] --rate=[num] --duration=[seconds]\nExample: $0 --platform="sd|npg" --rate=100 --duration=10')
      .demand('platform').default('platform', '-')
      .demand('nb').alias('nb', 'n').default('nb', 'nolimit')
      .demand('rate').alias('rate', 'r').default('rate', 10)
      .demand('duration').alias('duration', 'd').default('duration', 'nolimit')
      .describe('platform', 'the publisher platform code used as a source for generating url')
      .describe('nb', 'number of lines of log to generate')
      .describe('rate', 'number of lines of log to generate per second (max 1000)')
      .describe('duration', 'stop log generation after a specific number of seconds');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help) {
    optimist.showHelp();
    process.exit(0);
  }

  // stop url generation when the duration is expired
  if (argv.duration != 'nolimit') {
    setTimeout(function () {
      argv.nb = 0; // no more lines to generate
    }, argv.duration * 1000);
  }

  // get the platforms list from the script parameter or from the platforms folders
  var platforms = [];
  if (argv.platform === '-') {
    var stats;
    fs.readdirSync(platformsDir).forEach(function (item) {
      stats = fs.lstatSync(platformsDir + item);
      if (stats.isDirectory()) {
        platforms.push(item);
      }
    });
  } else {
    platforms = argv.platform.split('|');
  }

  logF.logFaker(platforms, argv.nb, argv.rate, argv.duration);
  
}
