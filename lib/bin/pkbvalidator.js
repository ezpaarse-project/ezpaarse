/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

//
// Command used to validate editor platform knowledge base
//

var util          = require('util');
var fs            = require('fs');
var csv           = require('csv');
var byline        = require('byline');
var csvextractor  = require('../../lib/csvextractor.js');
var check         = require('../../lib/rid-syntax-checker.js');

var linenb = 0;   // lines in CSV file
var records = []; // records from CSV file
var columns = {}; // result objet

/*
* Command used to parse a csv source into json or csv
*/

exports.pkbValidator = function () {
  var optimist = require('optimist')
    .usage('Check a platform knowledge base file.' +
      '\n  Usage: $0 [-f string]')
    .alias('file', 'f')
    .alias('silent', 's')
    .describe('file', 'A pkb file to check. If absent, will read from standard input.')
    .describe('silent',
              'If provided, empty values or unexisting fields won\'t be showed in the results.')
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  var options = {};
  var fields  = [];
  var source = argv.file ? argv.file : process.stdin;

  if (argv.silent) {
    options.silent = true;
  }
  if (argv.file && ! argv.file.match(/.pkb.csv/)) {
    console.error(argv.file + " : seems not to be a pkb file (no .pkb.csv extension)");
    process.exit(1);
  }

  csvextractor.extract(argv.file, null, function (records) {
    var fields = [];
    //console.log(records);
    records.forEach(function (record, index) {
      var rid = false;   /* check minimum vital informations are present */
      /* TODO : check only one column for pid */
      linenb++;
      fields = Object.keys(record);
      console.log(fields);
      fields.forEach(function (field) {
        var occurence = record[field]; // to count occurence of every field
        //console.log(util.inspect(occurence));
        if (columns[field]) {
          if (columns[field][occurence]) {
            columns[field][occurence]++;
            console.log("Warning : Field " + field + " appair more than once = " + occurence);
          } else {
            columns[field][occurence] = 1;
          }
        } else {
          columns[field] = {};
          columns[field][occurence] = 1;
        }
        if (field === 'pid') {
          rid = true;
        } else if (field.match(/issn/)) {
          /* check each issn or eissn is valid */
          rid = true;
          if (!check.ISSN(occurence)) {
            console.log("Warning : Field " + field + " is not valid = " + occurence);
            console.log(util.inspect(record));
          }
        } else if (field.match(/isbn/)) {
          /* check each isbn or eisbn is valid */
          rid = true;
          check.ISBN(occurence);
        } else if (field === 'doi') {
          rid = true;
          check.ISBN(occurence);
        }
//console.log(util.inspect(columns));
      });
      if (!rid) {
        console.log("Error : record " + util.inspect(record) + " has no identifier");
        process.exit(1);
      }
    });
    if (argv.output == 'json') {
      console.log(util.inspect(columns));
    } else {
      console.log("Total lines of pkb : %s", linenb);
      fields = Object.keys(columns);
      // todo : sort by value desc
      fields.forEach(function (field) {
        var arr = []; // for sorting purpose, desc by default
        console.log(field + " (" + arr.length + ")");
        var items = Object.keys(columns[field]);
        arr.forEach(function (item, id) {
          console.log("\t%s\t = %s", item.key, item.value);
        });
      });
    }
  },
  {
    silent: true
  });






  


}