'use strict';

/*
* Command used to validate editor platform knowledge base
* Exit codes: 0: all good
*             1: warnings detected, no errors
*             2: errors and possibly warnings detected
*             3: syntax errors detected
*             4: program error thrown
*/

var util         = require('util');
var fs           = require('graceful-fs');
var pkbValidator = require('../pkbvalidator.js');

exports.pkbValidator = function () {
  var optimist = require('optimist')
    .usage('Check a platform knowledge base file.' +
      '\n  Usage: $0 [-cfsv] pkb_file1.txt [pkb_file2.txt]')
    .boolean(['c', 's', 'v'])
    .alias('silent', 's')
    .alias('verbose', 'v')
    .alias('colors', 'c')
    .describe('silent', 'If provided, no output generated.')
    .describe('verbose', 'Print a summary of the validation process for each file')
    .describe('colors', 'Colorize the output for better lisibility.');
  var argv  = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  var colors = {
    'blue'    : '\x1B[34m',
    'cyan'    : '\x1B[36m',
    'green'   : '\x1B[32m',
    'magenta' : '\x1B[35m',
    'red'     : '\x1B[31m',
    'yellow'  : '\x1B[33m',
    'grey'    : '\x1B[90m',
    'reset'   : '\u001b[0m'
  };

  /**
   * Colorize a string with a given color
   */
  var colorize = function (str, color) {
    if (argv.colors) { return colors[color] + str + colors.reset; }
    else { return str; }
  };

  /**
   * Format and print a message in stderr
   * @param  {String} type     error type: info, warning, error
   * @param  {String} file     the file being validated
   * @param  {String} line     the line where the error occured
   * @param  {String} message  the actual error message
   */
  var echo = function (type, file, line, message) {

    var out = '';
    switch (type) {
    case 'error':
      if (argv.silent) { return; }
      out += colorize('[Error] ', 'red');
      break;
    case 'warning':
      if (argv.silent) { return; }
      out += colorize('[Warning] ', 'yellow');
      break;
    case 'info':
      if (!argv.verbose) { return; }
      out += colorize('[Info] ', 'green');
      break;
    }

    if (file)    { out += colorize(file, 'cyan') + ': '; }
    if (line)    { out += colorize('line ' + line, 'magenta') + ', '; }
    if (message) { out += message; }

    console.error(out);
  };

  /**
   * Filter unexisting files or those being something else than TXT
   */
  var files = argv._.filter(function (file) {
    var exists = fs.existsSync(file);
    var isTxt  = /.txt$/.test(file);

    if (!exists) {
      echo('error', { message: 'file not found', file: file });
    } else if (!isTxt) {
      echo('error', { message: 'not a pkb file (no .txt extension)', file: file });
    }

    return (exists && isTxt);
  });

  if (!files.length) {
    echo('error', { message: 'No pkb files to validate' });
    process.exit(1);
  }

  var status = 0;
  var i = 0;
  var nextFile = function () {
    var file   = files[i++];
    if (!file) { process.exit(status); }

    pkbValidator.validate(file)
    .on('error', function (err) {
      status = 4;
      echo('error', file, null, err.toString());
      echo('info', file, null, 'an error occured during the validation');
      nextFile();
    })
    .on('syntaxError', function (err) {
      if (status < 3) { status = 3; }
      echo('error', file, null, err.toString());
      echo('info', file, null, 'incorrect syntax');
      nextFile();
    })
    .on('pkbError', function (message, line) {
      if (status < 2) { status = 2; }
      echo('error', file, line, message);
    })
    .on('pkbWarning', function (message, line) {
      if (status < 1) { status = 1; }
      echo('warning', file, line, message);
    })
    .on('end', function (pkbErrors, pkbWarnings) {
      if (pkbErrors || pkbWarnings) {
        echo('info', file, null, util.format('%d error(s), %d warning(s)',
          pkbErrors, pkbWarnings));
      } else {
        echo('info', file, null, 'OK');
      }
      nextFile();
    });
  };

  nextFile();
};
