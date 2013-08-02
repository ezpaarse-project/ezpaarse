/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
"use strict";

//
// Command used to extract config value from config.json
//

exports.readConfig = function () {
  var config = require('../../config.json');
  var pkg    = require('../../package.json');


  // get the command line argument
  // platform
  var optimist = require('optimist')
      .usage('Usage: $0 --key=[string]')
      .demand('key').alias('key', 'k')
      .describe('key', 'the config key to show (ex: EZPAARSE_NODEJS_PORT)');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help) {
    optimist.showHelp();
    process.exit(0);
  }

  // read  config.json content filterd by --key
  if (config[argv.key] !== undefined) {
    if (config[argv.key] instanceof Array) {
      process.stdout.write(config[argv.key].join('\n'));
      process.exit(0);
    } else {
      process.stdout.write(config[argv.key].toString());
      process.exit(0);
    }
  } else {
    // search into package.json
    if (pkg[argv.key] !== undefined) {
      if (pkg[argv.key] instanceof Object) {
        process.stderr.write('key not handled: ' + argv.key + '\n');
        process.exit(1);
      } else {
        process.stdout.write(pkg[argv.key].toString());
        process.exit(0);
      }
    } else {
      process.stderr.write('Unknown key: ' + argv.key + '\n');
      process.exit(1);
    }
  }
};