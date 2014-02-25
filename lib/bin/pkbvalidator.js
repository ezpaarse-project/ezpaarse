'use strict';

//
// Command used to validate editor platform knowledge base
//

var util          = require('util');
var fs            = require('graceful-fs');
var path          = require('path');
var Lazy          = require('lazy');
var jschardet     = require('jschardet');
var csvextractor  = require('../../lib/csvextractor.js');
var ridchecker    = require('../../lib/rid-syntax-checker.js');
var unauthorizedFields = require('../../lib/proxyformats/pkb-unauthorized-fields.json');
var async         = require('async');
var moment        = require('moment');

var kbart2Fields  = require('../../lib/outputformats/kbart.json');

// in text mode sorting function
function sortObject(obj) {
  var arr = [];
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      arr.push({
        'key': prop,
        'value': obj[prop]
      });
    }
  }
  arr.sort(function (a, b) { return a.value - b.value; });
  return arr; // returns array
}

// in text mode sorting function (reverse)
function sortObjectR(obj) {
  var arr = [];
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      arr.push({
        'key': prop,
        'value': obj[prop]
      });
    }
  }
  arr.sort(function (a, b) { return b.value - a.value; });
  return arr; // returns array
}

// for csv output purpose
Array.prototype.uniqueMerge = function (a) {
  a = a ? a : [];
  for (var nonDuplicates = [], i = 0, l = a.length; i < l; ++i) {
    if (this.indexOf(a[i]) === -1) {

      nonDuplicates.push(a[i]);
    }
  }
  return this.concat(nonDuplicates);
};

/*
* Command used to parse a csv source into json or csv
*/

exports.pkbValidator = function () {
  var optimist = require('optimist')
    .usage('Check a platform knowledge base file.' +
      '\n  Usage: $0 [-cfsv] pkb_file1.pkb.csv [pkb_file2.pkb.csv]')
    .boolean(['c', 'f', 's', 'v', 'i'])
    .alias('silent', 's')
    .describe('silent',
              'If provided, no output generated.')
    .alias('kbartInput', 'i')
    .describe('kbartInput',
              'If provided, input is kbart file.')
    .alias('kbartOutput', 'k')
    .describe('kbartOutput',
              'If provided, output kbart file from pkb.')
    .alias('force', 'f')
    .describe('force',
              'If provided, force overwriting of kbart output.')
    .alias('csv', 'c')
    .describe('csv', 'If provided, the error-output will be a csv.')
    .alias('verbose', 'v')
    .describe('verbose',
              'show stats of checking.');
  var argv = optimist.argv;
  var files = [];

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  // peut être déplacé à la fin du fichier
  function csvCharsetChecking(file, cb) {
    var minCheckConfidenceNeeded = 0.93;
    var jschardetCheck = jschardet.detect(fs.readFileSync(file));

    if (argv.kbartInput && fs.existsSync(file) && file.match(/.txt$/)) {
      if (jschardetCheck.encoding) {
        if (jschardetCheck.encoding === 'windows-1252'
            && jschardetCheck.confidence > minCheckConfidenceNeeded) {
          if (argv.verbose) {
            console.error("Encoding warning : " +
            file + " : have to be UTF-8 encoded (" + jschardetCheck.encoding + " detected with " +
             jschardetCheck.confidence + " confidence). Check that title should not have accents");
          }
        } else if (! (jschardetCheck.encoding === 'utf-8'
                    || jschardetCheck.encoding === 'ascii')) {
          console.error("Encoding error : " +
          file + " : have to be UTF-8 encoded (" + jschardetCheck.encoding + " detected)");
        }
      }
      files.push(file);
      cb(null, file);
    } else if (!argv.kbartInput && fs.existsSync(file) && file.match(/.pkb.csv$/)) {
      if (jschardetCheck.encoding) {
        if (jschardetCheck.encoding === 'windows-1252'
            && jschardetCheck.confidence > minCheckConfidenceNeeded) {
          if (argv.verbose) {
            console.error("Encoding warning : " +
            file + " : have to be UTF-8 encoded (" + jschardetCheck.encoding + " detected with " +
             jschardetCheck.confidence + " confidence). Check that title should not have accents");
          }
        } else if (! (jschardetCheck.encoding === 'utf-8'
                    || jschardetCheck.encoding === 'ascii')) {
          console.error("Encoding error : " +
          file + " : have to be UTF-8 encoded (" + jschardetCheck.encoding + " detected)");
        }
      }
      files.push(file);
      cb(null, file);
    } else {
      console.error(file + " : seems not to be a pkb file (no .pkb.csv extension)");
      cb(null, file);
    }
  }

  // run charsetChecking sequentialy on each files comming from argv
  async.mapSeries(argv._, csvCharsetChecking, function () {

    if (!files.length) {
      console.error("No pkb files to validate");
      process.exit(1);
    }

    if (argv.kbartInput) {
      // run kbartContentChecking sequentialy on each files  
      async.mapSeries(files, kbartContentChecking, function () {
        process.exit(0);
      });
    } else {
      async.mapSeries(files, csvContentChecking, function () {
        process.exit(0);
      });
    }
  });

  function kbartContentChecking(file, cb) {
    var columns = {};       // result objet
    var linenb = 0;         // lines in CSV file


    // check if first line contains headers
    function firstLineChecking(cb) {
      var headerFields;
      var nb_input_line = 1;
      var lazy = new Lazy(fs.createReadStream(file));
      lazy
        .lines
        .forEach(function (line) {
          if (nb_input_line === 1) {
            headerFields = line.toString().split('\t');
            if (headerFields.indexOf('title_id') === -1) {
              console.error("Please check that first line contain " +
                "minimum pid header value\n" + line.toString());
              process.exit(1);
            }
            // comparing header fields to reserved values
            headerFields.forEach(function (Hfield) {
              unauthorizedFields.forEach(function (Rfield) {
                if (Hfield === Rfield) {
                  if (!argv.silent) {
                    console.error("File : %s ", file);
                    console.error("Error : " + Hfield + " header field " +
                      "not authorized (output conflict)");
                  }
                  process.exit(1);
                }
              });
            });
          }
          nb_input_line++;
        });
      lazy.on('end', function (err) {
        cb(err);
      });
    }

    function ridChecking(cb) {
      var errorRecords = [];  // error records with comments
      var errorFields = [];   // keys of error records for csv writing
      var ridsyntaxerrors = 0; // rids errors
      var platform = path.basename(file);
      csvextractor.extract(file, { silent: true, delimiter: '\t'}, function (err, records) {
        if (err) {
          if (!argv.silent) {
            console.error("Invalid CSV syntax - file : " + file);
            console.error("Invalid CSV syntax - error : " + err);
          }
          process.exit(1);
          return;
        }
        var fields = [];
        records.forEach(function (record) {
          var ridField = false;   /* check minimum vital informations are present */
          /* check only one value for pid */
          var uniqFields = ['title_id'];
          linenb++;
          fields = Object.keys(record);
          record['error'] = '';
          if (files.length > 1) { record['fromFile'] = file; }
          fields.forEach(function (field) {
            var occurence = record[field];    // to count occurence of every field
            if (occurence.substring(0, 1) === '#') { return; } // no control when staring with #

            var platformOccurence = platform + occurence;
            if (columns[field]) {
              if (columns[field][platformOccurence]) {
                columns[field][platformOccurence]++;
                if (uniqFields.indexOf(field) !== -1) {
                  if (record['error'].length) { record['error'] += ', '; }
                  record['error'] += "Warning : Field "
                    + field + " appear more than once = " + occurence;
                  errorRecords.push(record);
                  errorFields = errorFields.uniqueMerge(record.keys);
                  ridsyntaxerrors++;
                //process.exit(ridsyntaxerrors);
                }
              } else {
                columns[field][platformOccurence] = 1;
              }
            } else {
              columns[field] = {};
              columns[field][platformOccurence] = 1;
            }

            /* check minimum vital informations are present */
            if (field === 'title_id') {
              ridField = true;
            } else if (field === 'print_identifier' || field === 'online_identifier') {
              /* check each issn is valid */
              var ridValue = occurence;

              if (ridValue.length === 9) { // check for ISSN 
                var ISSN = ridchecker.getISSN(occurence);
                if (ISSN.checkable && !ISSN.isValid) {
                  if (record['error'].length) { record['error'] += ', '; }
                  record['error'] += "Warning : Field " + field + " is not valid = " + occurence
                    + " (controled value is " + ISSN.calculatedKey + ")";
                  errorRecords.push(record);
                  errorFields = errorFields.uniqueMerge(Object.keys(record));
                  ridsyntaxerrors++;
                }
              } else if (ridValue.length === 13) { // check for ISBN 
                /* check each isbn or eisbn is valid */
                var ISBN = ridchecker.getISBN(occurence);
                if (ISBN.checkable &&  !ISBN.isValid) {
                  if (record['error'].length) { record['error'] += ', '; }
                  record['error'] += "Warning : Field " + field + " is not valid = " + occurence
                    + " (controled value is " + ISBN.calculatedKey + ")";
                  errorRecords.push(record);
                  errorFields = errorFields.uniqueMerge(Object.keys(record));
                  ridsyntaxerrors++;
                }
              } else {
                if (record['error'].length) { record['error'] += ', '; }
                record['error'] += "Warning : Field " + field + " is not valid = " + occurence
                  + " (wrong size, please correct or use # to remove controls )";
                errorRecords.push(record);
                errorFields = errorFields.uniqueMerge(Object.keys(record));
                ridsyntaxerrors++;

              }
            }
          });
          if (!ridField) {
            if (record['error'].length) { record['error'] += ', '; }
            record['error'] += "Error : record has no identifier";
            errorRecords.push(record);
            errorFields = errorFields.uniqueMerge(Object.keys(record));
            ridsyntaxerrors++;
          }
        }); // for each record

        if (!argv.silent) {
          if (errorRecords.length) {
            if (argv.csv) {
              process.stdout.write(errorFields.join(";"));
              process.stdout.write(";\n");
              errorRecords.forEach(function (record) {
                errorFields.forEach(function (field) {
                  if (/;/.test(record[field])) {
                    process.stdout.write('"' + record[field].replace('"', '""') + '"');
                  } else if (record[field]) {
                    //console.log(record[field]);
                    process.stdout.write(record[field]);
                  }
                  process.stdout.write(";");
                });
                process.stdout.write("\n");
              });
              process.exit(ridsyntaxerrors);
            } else {
              console.log(util.inspect(errorRecords));
            }
          }
        }

        if (argv.verbose) {
          console.log("PKB %s : %s lignes - %s errors", platform, linenb, ridsyntaxerrors);
          fields = Object.keys(columns);
          // todo : sort by value desc
          fields.forEach(function (field) {
            var arr = []; // for sorting purpose, desc by default
            if (argv.sort == 'asc') { arr = sortObject(columns[field]); }
            else { arr = sortObjectR(columns[field]); }
            console.log(field + "\t\t\t (" + arr.length + ")");
          });
        }
        //console.log(util.inspect(argv));
        if (ridsyntaxerrors) {
          process.exit(ridsyntaxerrors);
        } else {
          cb(null);
        }
      });
    }

    // run firstLineChecking and ridChecking sequentialy on a file
    async.series([
      firstLineChecking,
      ridChecking
    ], function () {
      cb();
    });
  }

  function csvContentChecking(file, cb) {
    var columns = {};       // result objet
    var linenb = 0;         // lines in CSV file


    // check if first line contains headers
    function firstLineChecking(cb) {
      var headerFields;
      var nb_input_line = 1;
      var lazy = new Lazy(fs.createReadStream(file));
      lazy
        .lines
        .forEach(function (line) {
          if (nb_input_line === 1) {
            headerFields = line.toString().split(';');
            if (headerFields.indexOf('pid') === -1) {
              console.error("Please check that first line contain " +
                "minimum pid header value\n" + line.toString());
              process.exit(1);
            }
            // comparing header fields to reserved values
            headerFields.forEach(function (Hfield) {
              unauthorizedFields.forEach(function (Rfield) {
                if (Hfield === Rfield) {
                  if (!argv.silent) {
                    console.error("File : %s ", file);
                    console.error("Error : " + Hfield + " header field " +
                      "not authorized (output conflict)");
                  }
                  process.exit(1);
                }
              });
            });
          }
          nb_input_line++;
        });
      lazy.on('end', function (err) {
        cb(err);
      });
    }

    function ridChecking(cb) {
      var errorRecords = [];  // error records with comments
      var errorFields = [];   // keys of error records for csv writing
      var ridsyntaxerrors = 0; // rids errors
      var platform = path.basename(file);
      csvextractor.extract(file, { silent: true}, function (err, records) {
        if (err) {
          if (!argv.silent) {
            console.error("Invalid CSV syntax - file : " + file);
            console.error("Invalid CSV syntax - error : " + err);
          }
          process.exit(1);
          return;
        }
        var fields = [];
        records.forEach(function (record) {
          var ridField = false;   /* check minimum vital informations are present */
          /* check only one value for pid */
          var uniqFields = ['pid'];
          linenb++;
          fields = Object.keys(record);
          record['error'] = '';
          if (files.length > 1) { record['fromFile'] = file; }
          fields.forEach(function (field) {
            var occurence = record[field];    // to count occurence of every field
            var platformOccurence = platform + occurence;
            if (columns[field]) {
              if (columns[field][platformOccurence]) {
                columns[field][platformOccurence]++;
                if (uniqFields.indexOf(field) !== -1) {
                  if (record['error'].length) { record['error'] += ', '; }
                  record['error'] += "Warning : Field "
                    + field + " appear more than once = " + occurence;
                  errorRecords.push(record);
                  errorFields = errorFields.uniqueMerge(record.keys);
                  ridsyntaxerrors++;
                //process.exit(ridsyntaxerrors);
                }
              } else {
                columns[field][platformOccurence] = 1;
              }
            } else {
              columns[field] = {};
              columns[field][platformOccurence] = 1;
            }

            /* check minimum vital informations are present */
            if (field === 'pid') {
              ridField = true;
            } else if (field.match(/^pissn/)) {
              /* check each issn is valid */
              ridField = true;
              var ISSN = ridchecker.getISSN(occurence);
              if (ISSN.checkable && !ISSN.isValid) {
                if (record['error'].length) { record['error'] += ', '; }
                record['error'] += "Warning : Field " + field + " is not valid = " + occurence
                  + " (controled value is " + ISSN.calculatedKey + ")";
                errorRecords.push(record);
                errorFields = errorFields.uniqueMerge(Object.keys(record));
                ridsyntaxerrors++;
                //process.exit(ridsyntaxerrors);
              }
            } else if (field.match(/^eissn/)) {
              /* check each issn or eissn is valid */
              ridField = true;
              var EISSN = ridchecker.getISSN(occurence);
              if (EISSN.checkable && !EISSN.isValid) {
                if (record['error'].length) { record['error'] += ', '; }
                record['error'] += "Warning : Field " + field + " is not valid = " + occurence
                  + " (controled value is " + EISSN.calculatedKey + ")";
                errorRecords.push(record);
                errorFields = errorFields.uniqueMerge(Object.keys(record));
                // no error for eissn
                // ridsyntaxerrors++;
              }
            } else if (field.match(/isbn/)) {
              /* check each isbn or eisbn is valid */
              ridField = true;
              var ISBN = ridchecker.getISBN(occurence);
              if (ISBN.checkable &&  !ISBN.isValid) {
                if (record['error'].length) { record['error'] += ', '; }
                record['error'] += "Warning : Field " + field + " is not valid = " + occurence
                  + " (controled value is " + ISBN.calculatedKey + ")";
                errorRecords.push(record);
                errorFields = errorFields.uniqueMerge(Object.keys(record));
                ridsyntaxerrors++;
                //process.exit(ridsyntaxerrors);
              }
            } else if (field === 'doi') {
              ridField = true;
              var DOI = ridchecker.getDOI(occurence);
              if (DOI.checkable && !DOI.isValid) {
                if (record['error'].length) { record['error'] += ', '; }
                record['error'] += "Warning : Field " + field + " is not a valid DOI = " + occurence
                  + ", check the syntax";
                errorRecords.push(record);
                errorFields = errorFields.uniqueMerge(Object.keys(record));
                ridsyntaxerrors++;
                //process.exit(ridsyntaxerrors);
              }
            }
          });
          if (!ridField) {
            if (record['error'].length) { record['error'] += ', '; }
            record['error'] += "Error : record has no identifier";
            errorRecords.push(record);
            errorFields = errorFields.uniqueMerge(Object.keys(record));
            ridsyntaxerrors++;
          }
        }); // for each record

        if (!argv.silent) {
          if (errorRecords.length) {
            if (argv.csv) {
              process.stdout.write(errorFields.join(";"));
              process.stdout.write(";\n");
              errorRecords.forEach(function (record) {
                errorFields.forEach(function (field) {
                  if (/;/.test(record[field])) {
                    process.stdout.write('"' + record[field].replace('"', '""') + '"');
                  } else if (record[field]) {
                    //console.log(record[field]);
                    process.stdout.write(record[field]);
                  }
                  process.stdout.write(";");
                });
                process.stdout.write("\n");
              });
              process.exit(ridsyntaxerrors);
            } else {
              console.log(util.inspect(errorRecords));
            }
          }
        }

        if (argv.verbose) {
          console.log("PKB %s : %s lignes - %s errors", platform, linenb, ridsyntaxerrors);
          fields = Object.keys(columns);
          // todo : sort by value desc
          fields.forEach(function (field) {
            var arr = []; // for sorting purpose, desc by default
            if (argv.sort == 'asc') { arr = sortObject(columns[field]); }
            else { arr = sortObjectR(columns[field]); }
            console.log(field + "\t\t\t (" + arr.length + ")");
          });
        }
        //console.log(util.inspect(argv));
        if (ridsyntaxerrors) {
          process.exit(ridsyntaxerrors);
        } else {
          cb(null);
        }
      });
    }

    function kbartOutput(cb) {

      // only if kbart output requested
      if (!argv.kbartOutput) { return; }
      // convert pkb file and write a kbart file with normalized name

      var platform = path.basename(file);
      var kbartFileName = platform.match(/(.*).pkb.csv$/)[1].replace('.', '_');
      var kbartRecords = [];
      var kbartString = '';

      // Knowledge Bases and Related
      // Tools (KBART)
      // Recommended Practice
      // DRAFT For Public Comment September 4 – October 4, 2013
      // File Name
      // [ProviderName]_[Region/Consortium]_[PackageName]_[YYYY-MM-DD].txt

      kbartFileName = path.dirname(file) + '/' +
        kbartFileName + '_' + moment().format('YYYY-MM-DD') + '.txt';
      if (argv.verbose) { console.log("Output kbart file : " + kbartFileName); }
      csvextractor.extract(file, { silent: true, delimiter: '\t' }, function (err, records) {
        if (err) {
          if (!argv.silent) {
            console.error("Invalid CSV syntax - file : " + file);
            console.error("Invalid CSV syntax - error : " + err);
          }
          process.exit(1);
          return;
        }
        var fields = [];
        var extraFields = {};
        records.forEach(function (record) {
          var kbartRecord = {};

          kbart2Fields.forEach(function (field) {
            kbartRecord[field] = '';
          });
          fields = Object.keys(record);
          fields.forEach(function (field) {
            var occurence = record[field];
            // map pkb fields to kbart
            if (field === 'pid') {
              //console.log('title_id:' ,occurence);
              kbartRecord['title_id'] = occurence;
            } else if (field.match(/^title/)) {
              kbartRecord['publication_title'] = occurence;
            } else if (field.match(/^pissn/)) {
              kbartRecord['print_identifier'] = occurence;
            } else if (field.match(/^eissn/)) {
              kbartRecord['online_identifier'] = occurence;
            } else if (field.match(/isbn/)) {
              kbartRecord['print_identifier'] = occurence;
            } else if (field === 'doi') {
              kbartRecord['print_identifier'] = occurence;
            } else if (field === 'pidurl') {
              kbartRecord['title_url'] = occurence;
            } else {
              // extra fields
              kbartRecord['ezp-' + field] = occurence;
              extraFields['ezp-' + field] = 1; // only the key is important
            }
          });
          kbartRecords.push(kbartRecord);
        }); // for each record
        extraFields = Object.keys(extraFields); // keep only keys
        console.log(extraFields);
        if (argv.kbartOutput === 'json') {
          kbartString = util.inspect(kbartRecords);
        } else {
          // kbart headers
          kbartString = kbart2Fields.join("\t");
          if (extraFields.length) {
            kbartString += "\t" + extraFields.join("\t");
          }
          kbartString += "\n";
          // kbart content
          var kbartLine;
          kbartRecords.forEach(function (record) {
            kbartLine = '';
            kbart2Fields.forEach(function (field) {
              kbartLine += record[field] + "\t";
            });
            if (extraFields.length) {
              extraFields.forEach(function (field) {
                kbartLine += record[field] + "\t";
              });
            }
            kbartString += kbartLine.replace(/\t$/, '\n');
          });
        }
        if (argv.verbose && fs.existsSync(kbartFileName) && argv.force) {
          if (argv.force) { console.log("Overwriting ..."); }
        }
        if ((fs.existsSync(kbartFileName) && argv.force) || ! fs.existsSync(kbartFileName)) {
          fs.writeFileSync(kbartFileName, kbartString);
        } else {
          console.error("File " + kbartFileName + " exists, skiping (use --force to overwrite)");
        }
        cb(null);
      });
    } // end of kbart output

    // run firstLineChecking and ridChecking sequentialy on a file
    async.series([
      firstLineChecking,
      ridChecking,
      kbartOutput
    ], function () {
      cb();
    });
  }
  

};
