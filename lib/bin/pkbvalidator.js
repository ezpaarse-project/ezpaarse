/*eslint no-sync: 0*/
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
  var yargs = require('yargs')
    .usage('Check a platform knowledge base file.' +
      '\n  Usage: $0 [-csvw] pkb_file1.txt [pkb_file2.txt]')
    .boolean(['c', 's', 'v', 'w'])
    .alias('silent', 's')
    .alias('verbose', 'v')
    .alias('colors', 'c')
    .alias('nowarnings', 'w')
    .describe('nowarnings', 'If provided, warnings will be ignored.')
    .describe('silent', 'If provided, no output generated.')
    .describe('verbose', 'Print a summary of the validation process for each file')
    .describe('colors', 'Colorize the output for better lisibility.');
  var argv  = yargs.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    yargs.showHelp();
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
    return argv.colors ? colors[color] + str + colors.reset : str;
  };

  /**
   * Format and print a message in stderr
   * @param  {String} type     error type: info, warning, error
   * @param  {String} file     the file being validated
   * @param  {String} line     the line where the error occured
   * @param  {String} message  the actual error message
   */
  var echo = function (type, message, file, line) {

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
      echo('error', 'file not found', file);
    } else if (!isTxt) {
      echo('error', 'not a pkb file (no .txt extension)', file);
    }

    return (exists && isTxt);
  });

  if (!files.length) {
    echo('error', 'No pkb files to validate');
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
      echo('error', err.toString(), file);
      echo('info', 'an error occured during the validation', file);
      nextFile();
    })
    .on('syntaxError', function (err) {
      if (status < 3) { status = 3; }
      echo('error', err.toString(), file);
      echo('info', 'incorrect syntax', file);
      nextFile();
    })
    .on('pkbError', function (message, line) {
      if (status < 2) { status = 2; }
      echo('error', message, file, line);
    })
    .on('pkbWarning', function (message, line) {
      if (argv.w) { return; }
      if (status < 1) { status = 1; }
      echo('warning', message, file, line);
    })
    .on('end', function (pkbErrors, pkbWarnings) {
      if (pkbErrors || pkbWarnings) {
        echo('info', util.format('%d error(s), %d warning(s)',
          pkbErrors, pkbWarnings), file);
      } else {
        echo('info', 'OK', file);
      }
      nextFile();
    });
  };

  nextFile();
};
