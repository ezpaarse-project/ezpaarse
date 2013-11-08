/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

//
// Command used to validate editor platform knowledge base
//

var util          = require('util');
var fs            = require('fs');
var path          = require('path');
var Lazy          = require('lazy');
var chardet       = require('chardet');
var csvextractor  = require('../../lib/csvextractor.js');
var ridchecker    = require('../../lib/rid-syntax-checker.js');
var unauthorizedFields = require('../../lib/proxyformats/pkb-unauthorized-fields.json');
var async         = require('async');


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
      '\n  Usage: $0 [-svc] pkb_file1.pkb.csv [pkb_file2.pkb.csv]')
    .boolean(['v', 'c', 's'])
    .alias('silent', 's')
    .describe('silent',
              'If provided, no output generated.')
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
    if (fs.existsSync(file) && file.match(/.pkb.csv$/)) {
      chardet.detectFile(file, function (err, encoding) {
        if (encoding === 'ISO-8859-1') {
          if (argv.verbose) {
            console.error("Encoding warning : " +
            file + " : have to be UTF-8 encoded (" + encoding + " detected)" +
            " check that title should not have accents");
          }
        } else if (encoding !== 'UTF-8') {
          console.error("Encoding error : " +
          file + " : have to be UTF-8 encoded (" + encoding + " detected)");
        }
      });

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
    
    // run csvContentChecking sequentialy on each files
    async.mapSeries(files, csvContentChecking, function () {
      process.exit(0);
    });

  });

  // argv._.forEach(function (file) {
  //   if (fs.existsSync(file) && file.match(/.pkb.csv$/)) {
  //     chardet.detectFile(file, function (err, encoding) {
  //       if (encoding === 'ISO-8859-1') {
  //         if (argv.verbose) {
  //           console.error("Encoding warning : " +
  //           file + " : have to be UTF-8 encoded (" + encoding + " detected)" +
  //           " check that title should not have accents");
  //         }
  //       } else if (encoding !== 'UTF-8') {
  //         console.error("Encoding error : " +
  //         file + " : have to be UTF-8 encoded (" + encoding + " detected)");
  //       }
  //     });

  //     files.push(file);
  //   } else {
  //     console.error(file + " : seems not to be a pkb file (no .pkb.csv extension)");
  //   }
  // });
  // if (!files.length) {
  //   console.error("No pkb files to validate");
  //   process.exit(1);
  // }


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
      csvextractor.extract(file, null, function (err, records) {
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
            } else if (field.match(/^issn/)) {
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
      }, {
        silent: true
      });
    }

    // run firstLineChecking and ridChecking sequentialy on a file
    async.series([
      firstLineChecking,
      ridChecking,
    ], function () {
      cb();
    });

  }

  // files.forEach(function (file) {



  // });
};
