'use strict';

/*
* Command used to validate editor platform knowledge base
* Exit codes: 0: all good
*             9: program error or bad CSV syntax
*             1: errors detected
*             2: warnings detected, no errors
*/

var util       = require('util');
var fs         = require('graceful-fs');
var csv        = require('csv');
var jschardet  = require('jschardet');
var ridchecker = require('../../lib/rid-syntax-checker.js');
var unauthorizedFields = require('../../lib/proxyformats/pkb-unauthorized-fields.json');

var ISSNPattern  = /[0-9]{4}\-[0-9]{3}([0-9Xx])?/;
var ISBNPattern  = /((978[-– ])?[0-9][0-9-– ]{10}[-– ][0-9xX])|((978)?[0-9]{9}[0-9])/;

exports.pkbValidator = function () {
  var optimist = require('optimist')
    .usage('Check a platform knowledge base file.' +
      '\n  Usage: $0 [-cfsv] pkb_file1.txt [pkb_file2.txt]')
    .boolean(['c', 's', 'v'])
    .alias('silent', 's')
    .alias('colors', 'c')
    .describe('silent',  'If provided, no output generated.')
    .describe('colors',  'Colorize the output for better lisibility.');
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
  }

  /**
   * Format and print a message in stderr
   * @param  {String} message  the message
   * @param  {Obejct} opt -->  type: info, warning, error
   *                           file: a file path
   *                           line: a line number
   *                           args: array of arguments to replace in the message
   *                                 (util.format syntax)
   */
  var echo = function (message, opt) {
    if (argv.silent) { return; }
    opt = opt || {};

    var out = '';
    switch (opt.type) {
    case 'error':
      out += colorize('[Error] ', 'red');
      break;
    case 'warning':
      out += colorize('[Warning] ', 'yellow');
      break;
    case 'info':
      out += colorize('[Info] ', 'green');
      break;
    }

    if (opt.file) { out += colorize(opt.file, 'cyan') + ': '; }
    if (opt.line) { out += colorize('line ' + opt.line, 'magenta') + ', '; }

    if (opt.args) {
      opt.args.unshift(message);
      message = util.format.apply(this, opt.args);
    }

    out += message;

    console.error(out);
  };

  /**
   * Filter unexisting files or those being something else than TXT
   */
  var files = argv._.filter(function (file) {
    var exists = fs.existsSync(file);
    var isTxt  = /.txt$/.test(file);

    if (!exists) {
      echo("file not found", { type: 'error', file: file });
    } else if (!isTxt) {
      echo("not a pkb file (no .txt extension)", { type: 'error', file: file });
    }

    return (exists && isTxt);
  });

  if (!files.length) {
    echo("No pkb files to validate", { type: 'error' });
    process.exit(1);
  }

  var status = 0;
  var nextFile = function () {
    var file   = files.pop();
    if (!file) { process.exit(status); }

    testFile(file, function (err, nbErrors, nbWarnings) {
      switch(status) {
        case 0:
          if (nbWarnings) { status = 2; }
        case 2:
          if (nbErrors) { status = 1; }
        case 1:
          if (err) { status = 9; }
      }

      nextFile();
    });
  };

  nextFile();

  /**
   * Read a file, parse it and look for errors
   * @param  {String}   file     path to the file
   * @param  {Function} callback (err, nbErrors, nbWarnings)
   */
  function testFile(file, callback) {
    var fileStream    = fs.createReadStream(file);
    var parser        = csv.parse({ delimiter: '\t', columns: true });
    var detector      = new jschardet.UniversalDetector();
    var data;

    var titleIDs      = {}; // List of title IDs
    var headerChecked = false;
    var titleIdColumn = false;
    var recordNumber  = 0;
    var nbErrors      = 0;
    var nbWarnings    = 0;

    detector.reset();

    parser.on('error', function (err) {
      if (!argv.silent) {
        echo("%s", {
          type: 'error',
          file: file,
          args: [err]
        });
      }
      callback(err);
    })
    .on('readable', function () {
      var record = parser.read();
      recordNumber++;

      // Check fields on the first record
      if (!headerChecked) {
        headerChecked = true;

        if (record.hasOwnProperty('title_id')) {
          titleIdColumn = true;
        } else {
          nbErrors++;

          echo("title_id header is missing", {
            type: 'error',
            file: file,
            line: 1
          });
        }

        // comparing header fields to reserved values
        var erroredHeaders = [];
        for (var header in record) {
          if (unauthorizedFields.indexOf(header) !== -1) {
            erroredHeaders.push(header);
          }
        }

        if (erroredHeaders.length) {
          nbErrors++;

          echo("unauthorized headers : %s", {
            type: 'error',
            file: file,
            line: 1,
            args: [erroredHeaders.join(',')]
          });
        }
      }

      if (!record.title_id) {
        if (titleIdColumn) {
          nbErrors++;

          // If the record has no title_id although the column exists
          echo("title_id is missing", {
            type: 'error',
            file: file,
            line: recordNumber + 1
          });
        }
      } else {
        var titleID = record.title_id;

        if (titleIDs[titleID] === true) {
          nbWarnings++;

          echo("duplicated title_id (%s)", {
            type: 'warning',
            file: file,
            line: recordNumber + 1,
            args: [titleID]
          });
        } else {
          titleIDs[titleID] = true;
        }
      }

      for (var field in record) {
        var value = record[field];

        if (value === '') { continue; }                  // no control if empty
        if (value.substring(0, 1) === '#') { continue; } // no control when starting with #

        if (field === 'print_identifier' || field === 'online_identifier') {
          /* check each issn is valid */
          var ridValue = value;

          if (ISSNPattern.test(ridValue)) { // check for ISSN
            var ISSN = ridchecker.getISSN(value);

            if (ISSN.checkable && !ISSN.isValid) {
              nbWarnings++;

              echo("invalid value (%s = %s), controled value is %s", {
                type: 'warning',
                file: file,
                line: recordNumber + 1,
                args: [field, value, ISSN.calculatedKey]
              });
            }
          } else if (ISBNPattern.test(ridValue)) { // check for ISBN
            var ISBN = ridchecker.getISBN(value);

            if (ISBN.checkable &&  !ISBN.isValid) {
              nbWarnings++;

              echo("invalid value (%s = %s), controled value is %s", {
                type: 'warning',
                file: file,
                line: recordNumber + 1,
                args: [field, value, ISBN.calculatedKey]
              });
            }
          } else if (field === 'online_identifier' && value == "N/A") {
            // pass controls with this value
            value = '';
          } else {
            nbWarnings++;

            echo("invalid value (%s = %s), correct it or use # to remove controls", {
              type: 'warning',
              file: file,
              line: recordNumber + 1,
              args: [field, value]
            });
          }
        }
      }
    })
    .on('finish', function () {
      echo("%s entries, %s errors, %s warnings", {
        type: 'info',
        file: file,
        args: [recordNumber, nbErrors, nbWarnings]
      });

      callback(null, nbErrors, nbWarnings);
    });

    fileStream.on('error', function (err) {
      callback(err);
    });

    fileStream.on('readable', function () {
      data = fileStream.read();
      if (data === null) { return; }

      detector.feed(data.toString());
      parser.write(data);
    });

    fileStream.on('end', function () {
      // Check charset result
      detector.close();
      var encoding   = detector.result.encoding.toLowerCase();
      var confidence = detector.result.confidence;

      if (encoding === 'windows-1252' && confidence > 0.93) {
        nbWarnings++;

        echo("charset detected as %s with a confidence of %d%. "
          + "Check that the file does not contain special characters", {
          type: 'warning',
          file: file,
          args: [encoding, confidence]
        });
      } else if (encoding !== 'utf-8' && encoding !== 'ascii') {
        nbErrors++;

        echo("charset detected as %s (should be UTF-8)", {
          type: 'error',
          file: file,
          args: [encoding]
        });
      }

      parser.end();
    });
  }
};
