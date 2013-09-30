/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

//
// Command used to validate editor platform knowledge base
//

var util          = require('util');
var fs            = require('fs');
var path          = require('path');
var csvextractor  = require('../../lib/csvextractor.js');
var ridchecker    = require('../../lib/rid-syntax-checker.js');
var Lazy = require('lazy');


var linenb = 0;         // lines in CSV file
var errorRecords = [];  // error records with comments
var errorFields = [];   // keys of error records for csv writing
var columns = {};       // result objet
var ridsyntaxerrors = 0; // rids errors

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
    .alias('csv', 'c')
    .describe('csv', 'If provided, the error-output will be a csv.')
    .alias('silent', 's')
    .describe('silent',
              'If provided, no output generated.')
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

  argv._.forEach(function (file) {
    if (fs.existsSync(file) && file.match(/.pkb.csv$/)) {
      files.push(file);
    } else {
      console.error(file + " : seems not to be a pkb file (no .pkb.csv extension)");
    }
  });

  if (!files.length) {
    console.error("No pkb files to validate");
    process.exit(1);
  }

  files.forEach(function (file) {

    var nb_input_line = 1;
    // check if first line contains headers
    new Lazy(fs.createReadStream(file))
      .lines
      .forEach(function (line) {
        if (nb_input_line === 1) {
          if (line.toString().split(';').indexOf('pid') === -1) {
            console.log("Please check that first line contain" +
              "minimum pid header value\n" + line.toString());
            process.exit(1);
          }
        }
        nb_input_line++;
      });

    var platform = path.basename(file);
    csvextractor.extract(file, null, function (records) {
      var fields = [];
      records.forEach(function (record) {
        var rid = false;   /* check minimum vital informations are present */
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
            rid = true;
          } else if (field.match(/issn/)) {
            /* check each issn or eissn is valid */
            rid = true;
            if (!ridchecker.checkISSN(occurence)) {
              if (record['error'].length) { record['error'] += ', '; }
              record['error'] += "Warning : Field " + field + " is not valid = " + occurence
                + " (controled value is " + ridchecker.getISSN(occurence).calculatedKey + ")";
              errorRecords.push(record);
              errorFields = errorFields.uniqueMerge(Object.keys(record));
              ridsyntaxerrors++;
            }
          } else if (field.match(/isbn/)) {
            /* check each isbn or eisbn is valid */
            rid = true;
            if (!ridchecker.checkISBN(occurence)) {
              if (record['error'].length) { record['error'] += ', '; }
              record['error'] += "Warning : Field " + field + " is not valid = " + occurence
                + " (controled value is " + ridchecker.getISBN(occurence).calculatedKey + ")";
              errorRecords.push(record);
              errorFields = errorFields.uniqueMerge(Object.keys(record));
              ridsyntaxerrors++;
            }
          } else if (field === 'doi') {
            rid = true;
            if (!ridchecker.checkDOI(occurence)) {
              if (record['error'].length) { record['error'] += ', '; }
              record['error'] += "Warning : Field " + field + " is not a valid DOI = " + occurence
                + ", check the syntax";
              errorRecords.push(record);
              errorFields = errorFields.uniqueMerge(Object.keys(record));
              ridsyntaxerrors++;
            }
          }
        });
        if (!rid) {
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
                } else {
                  process.stdout.write(record[field]);
                }
                process.stdout.write(";");
              });
              process.stdout.write("\n");
            });
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
          console.log(field + "\t\t (" + arr.length + ")");
        });
      }
      if (ridsyntaxerrors) { process.exit(ridsyntaxerrors); }
    }
    ,
    {
      silent: true
    });
  });
};
