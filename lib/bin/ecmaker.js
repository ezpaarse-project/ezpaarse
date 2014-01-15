'use strict';

//
// Command used to generate EC files from log files
//
// mask on path to choose files
// /applis/archives/host/portail/year/year-month/ezproxy.portail.year-month-day.log.gz


var fs      = require('fs');
// var util          = require('util');
var path    = require('path');
var shell = require('shelljs');
//var async         = require('async');
var moment    = require('moment');

var default_path = "/home/ubuntu/ezpaarse/test/dataset";
var dir_path;

exports.ECMaker = function () {
  var optimist = require('optimist')
    .usage('Scan a repository containing log files.' +
      '\n  Usage: $0 [-pymdlv] repository')
    .boolean(['v', 'l'])
    .alias('list', 'l')
    .describe('list', 'If provided, only list files.')
    .alias('portal', 'p')
    .describe('portal', 'If provided, mask to choose a portal.')
    .alias('year', 'y')
    .describe('year', 'If provided (YYYY), mask to choose a year (default current), none to skip.')
    .alias('month', 'm')
    .describe('month', 'If provided (MM), mask to choose a month (default current), none to skip.')
    .alias('day', 'd')
    .describe('day', 'If provided (DD), mask to choose a day (default all), none to skip.')
    .alias('verbose', 'v')
    .describe('verbose', 'shows detailed operations.');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  if (argv._.length) {
    dir_path = argv._[0];
  } else {
    console.log("default path " + default_path + " is used");
    dir_path = default_path;
  }

  var period; // for date selections

  if (! (argv.year == 'none' || argv.month == 'none' || argv.day == 'none')) {
    period = ((argv.year) ? argv.year : moment().format('YYYY')) +
      '.' + ((argv.month) ? argv.month : moment().format('MM'));
    if (argv.day && argv.day != 'all') {
      period += '.' + argv.day;
    }
  }

  var criteria = {
    'portal': 'ezproxy',
    'period': period
  };

  console.log(criteria);

  var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
      if (err) { return done(err); }
      var i = 0;
      (function next() {
        var file = list[i++];
        if (!file) { return done(null, results); }
        file = path.resolve(dir, file);
        fs.stat(file, function (err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function (err, res) {
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

  walk(dir_path, function (err, results) {
    if (err) { throw new Error(dir_path + ' not accessible'); }

    var filtered = results.filter(matchCriteria, criteria);
    //var filename;

    if (filtered.length === 0) { console.error("No file match criteria"); }
    if (! argv.list) {
      filtered.forEach(function (infile) {
        var outfile, cmd;

        if (path.extname(infile) == ".log") {
          outfile = path.basename(infile).replace(".log", ".anonymized.log");
          cmd = 'loganonymizer --input=' + infile + ' --output=' + outfile;
          if (shell.exec(cmd, {silent: false}).code !== 0) {
            console.error(infile + ' : not found');
          } else {
            console.log(infile + ' : found');
          }
          console.log(outfile);
        } else if (path.extname(infile) == ".gz") {
          outfile = path.basename(infile).replace(".log.gz", ".anonymized.log");
          cmd = 'zcat ' + infile + ' | loganonymizer --output=' + outfile;
          console.log(cmd);
          if (shell.exec(cmd, {silent: false}).code !== 0) {
            console.error(infile + ' : not found');
          } else {
            if (shell.exec('gzip -f ' + outfile, {silent: false}).code !== 0) {
              console.error("Erreur de compression de " + outfile);
            } else {
              console.log("compression de " + outfile);
            }
          }
          console.log(outfile);
        } else {
          console.error(infile + " is not a log file");
        }
      });
    } else {
      console.log(filtered);
    }
  });
 
  function matchCriteria(element) {
    var criteria = this;

    // console.log(this);

    // first criteria is .log in file name
    if (! path.basename(element).match('.log')) {
      return false;
    }

    if (criteria.ext) {
      if (path.extname(element) != criteria.ext) {
        return false;
      }
    }

    if (criteria.name) {
      if (! path.basename(element).match(criteria.name)) {
        return false;
      }
    }

    if (criteria.portal) {
      if (! path.basename(element).match(criteria.portal)) {
        return false;
      }
    }

    if (criteria.period) {
      if (! path.basename(element).match(criteria.period)) {
        return false;
      }
    }

    if (criteria.prefix) {
      if (! path.basename(element).match('^' + criteria.prefix)) {
        return false;
      }
    }
    return true;
  }
  
};
