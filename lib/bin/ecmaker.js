'use strict';

//
// Command used to generate EC files from log files
//
// mask on path to choose files
// /applis/archives/host/portail/year/year-month/ezproxy.portail.year-month-day.log.gz


var util          = require('util');
var fs            = require('fs');
var path          = require('path');
var async         = require('async');

var default_path = "/home/ubuntu/ezpaarse/test/dataset";

exports.ECMaker = function () {
  var optimist = require('optimist')
    .usage('Scan a repository containing log files.' +
      '\n  Usage: $0 [-pymd] repository')
    .boolean(['v'])
    .alias('portail', 'p')
    .describe('portail',
              'If provided, mask to choose a portail.')
    .alias('year', 'y')
    .describe('year', 'If provided, mask to choose a year (default current).')
    .alias('month', 'm')
    .describe('year', 'If provided, mask to choose a month (default current).')
    .alias('day', 'd')
    .describe('day', 'If provided, mask to choose a day (default current).')
    .alias('verbose', 'v')
    .describe('verbose',
              'shows detailed operations.');
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

walk(default_path, function(err, results) {
  if (err) throw err;
  console.log(results);
});
};
