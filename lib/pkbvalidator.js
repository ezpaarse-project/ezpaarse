'use strict';

var util         = require('util');
var fs           = require('fs');
var csv          = require('csv');
var jschardet    = require('jschardet');
var EventEmitter = require('events').EventEmitter;

var ridchecker   = require('./rid-syntax-checker.js');
var unauthorizedFields = require('./proxyformats/pkb-unauthorized-fields.json');

var ISSNPattern  = /[0-9]{4}\-[0-9]{3}([0-9Xx])?/;
var ISBNPattern  = /((978[-– ])?[0-9][0-9-– ]{10}[-– ][0-9xX])|((978)?[0-9]{9}[0-9])/;

/**
 * Read a file, parse it and look for errors
 * @param  {String}   file     path to the file
 * @param  {Function} callback (err, nbErrors, nbWarnings)
 *
 * @emit error       program error or bad CSV syntax
 *       pkbError    blocking pkb errors
 *       pkbWarning
 */
exports.validate = function (file, callback) {
  var titleIDs       = {}; // List of title IDs
  var titleIdColumn  = false;
  var syntaxError    = false;
  var recordNumber   = 0;
  var nbErrors       = 0;
  var nbWarnings     = 0;

  var fileStream    = fs.createReadStream(file);
  var emitter       = new EventEmitter();
  var detector      = new jschardet.UniversalDetector();
  var data;
  detector.reset();

  // Store errors if a callback is provided
  if (typeof callback === 'function') {
    var pkbErrors    = [];
    var pkbWarnings  = [];

    emitter
    .on('error', function (error)       { callback(error); })
    .on('syntaxError', function (error) { callback(error); })
    .on('pkbError', function (msg, line)     { pkbErrors.push({ message: msg, line: line }); })
    .on('pkbWarning', function (msg, line)   { pkbWarnings.push({ message: msg, line: line }); })
    .on('end', function () { callback(null, pkbErrors, pkbWarnings); });
  }

  var parser = csv.parse({ delimiter: '\t', columns: function (headers) {

    // check that title_id is present
    if (headers.indexOf('title_id') !== -1) {
      titleIdColumn = true;
    } else {
      nbErrors++;

      emitter.emit('pkbError', 'title_id header is missing', 1);
    }

    // look for unauthorized headers
    var erroredHeaders = [];
    headers.forEach(function (header) {
      if (unauthorizedFields.indexOf(header) !== -1) {
        erroredHeaders.push(header);
      }
    });

    if (erroredHeaders.length) {
      nbErrors++;

      emitter.emit('pkbError',
        util.format('unauthorized headers : %s', erroredHeaders.join(',')), 1);
    }

    return headers;
  }});

  parser.on('error', function (err) {
    syntaxError = true;
    fileStream.close(function () {
      emitter.emit('syntaxError', err);
    });
  })
  .on('readable', function () {
    var record = parser.read();
    recordNumber++;

    if (!record.title_id) {
      if (titleIdColumn) {
        nbErrors++;

        // If the record has no title_id although the column exists
        emitter.emit('pkbError', 'title_id is missing', recordNumber + 1);
      }
    } else {
      var titleID = record.title_id;

      if (titleIDs[titleID] === true) {
        nbWarnings++;

        emitter.emit('pkbWarning',
          util.format('duplicated title_id (%s)', titleID), recordNumber + 1);
      } else {
        titleIDs[titleID] = true;
      }
    }

    for (var field in record) {
      var value = record[field];

      if (value === '') { continue; }                  // no control if empty
      if (value.substr(0, 1) === '#') { continue; } // no control when starting with #

      if (field === 'print_identifier' || field === 'online_identifier') {
        /* check each issn is valid */
        var ridValue = value;

        if (ISSNPattern.test(ridValue)) { // check for ISSN
          var ISSN = ridchecker.getISSN(value);

          if (ISSN.checkable && !ISSN.isValid) {
            nbWarnings++;

            emitter.emit('pkbWarning',
              util.format('invalid value (%s = %s), controled value is %s',
                field, value, ISSN.calculatedKey), recordNumber + 1);
          }
        } else if (ISBNPattern.test(ridValue)) { // check for ISBN
          var ISBN = ridchecker.getISBN(value);

          if (ISBN.checkable &&  !ISBN.isValid) {
            nbWarnings++;

            emitter.emit('pkbWarning',
              util.format('invalid value (%s = %s), controled value is %s',
                field, value, ISBN.calculatedKey), recordNumber + 1);
          }
        } else if (field === 'online_identifier' && value == "N/A") {
          // pass controls with this value
          value = '';
        } else {
          nbWarnings++;

          emitter.emit('pkbWarning',
            util.format('invalid value (%s = %s), correct it or use # to remove controls',
              field, value), recordNumber + 1);
        }
      }
    }
  })
  .on('finish', function () {
    if (!syntaxError) { emitter.emit('end', nbErrors, nbWarnings); }
  });

  fileStream.on('error', function (err) {
    emitter.emit('error', err);
  });

  fileStream.on('readable', function () {
    data = fileStream.read();
    if (data === null) { return; }

    for (var i = 0, l = data.length; i < l; ++i) {
      detector.feed(String.fromCharCode(data[i]));
    }
    parser.write(data);
  });

  fileStream.on('end', function () {
    // Check charset result
    detector.close();

    if (!detector.result.encoding) {
      emitter.emit('pkbWarning', 'could not determine file encoding');
    } else {
      var encoding   = detector.result.encoding.toLowerCase();
      var confidence = detector.result.confidence;

      if (encoding === 'windows-1252' && confidence > 0.93) {
        nbWarnings++;

        var err = "charset detected as %s with a confidence of %d%. "
          + "Check that the file does not contain special characters";
        emitter.emit('pkbWarning', util.format(err, encoding, Math.round(confidence * 100)));
      } else if (encoding !== 'utf-8' && encoding !== 'ascii') {
        nbErrors++;

        emitter.emit('pkbError', util.format('charset detected as %s (should be UTF-8)', encoding));
      }
    }

    parser.end();
  });

  return emitter;
};
