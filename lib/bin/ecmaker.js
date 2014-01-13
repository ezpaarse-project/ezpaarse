'use strict';

//
// Command used to generate EC from log files
//

var util          = require('util');
var fs            = require('fs');
var path          = require('path');
var Lazy          = require('lazy');
var async         = require('async');


/*
* Command used to parse a csv source into json or csv
*/

exports.ECMaker = function () {
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

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

walk("/home/ubuntu/ezpaarse/test/dataset", function(err, results) {
  if (err) throw err;
  console.log(results);
});
};
