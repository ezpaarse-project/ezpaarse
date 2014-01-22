'use strict';

//
// Command used to generate EC files from log files
//
// mask on path to choose files
// /applis/archives/host/portail/year/year-month/ezproxy.portail.year-month-day.log.gz

exports.EcBulkMaker = function () {
  var fs      = require('fs');
  var path    = require('path');
  var moment  = require('moment');
  var config  = require('../config.js');
  var async   = require('async');

  var default_path = path.join(__dirname, "../../test/dataset");
  var dir_path;
  var start, end;

  var outpath;
  // skip rejeted files
  var headers = { 'Reject-Files': 'none'};
  var url = 'http://127.0.0.1:' + config.EZPAARSE_NODEJS_PORT;
  var options = {
    url: url,
    headers: headers
  };

  var optimist = require('optimist')
    .usage('Scan a repository containing log files for action.' +
      '\n  Usage: $0 [-pymdlv] repository')
    .boolean(['v', 'l'])
    .alias('list', 'l')
    .describe('list', 'If provided, only list files.')
    .alias('portal', 'p')
    .describe('portal', 'If provided, mask to choose a portal.')
    .alias('period', 't')
    .describe('period', 'If provided (like YYYY.MM.DD), mask to choose a period' +
        ' (default none).')
    .alias('outpath', 'o')
    .describe('outpath', 'If provided, output directory.')
    .alias('verbose', 'v')
    .describe('verbose', 'Shows detailed operations.');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  if (argv._.length) {
    dir_path = argv._[0];
  } else {
    if (argv.verbose) { console.log("default path " + default_path + " is used"); }
    dir_path = default_path;
  }

  if (argv.outpath) {
    outpath = argv.outpath;
  } else {
    outpath = path.join(__dirname, "../../tmp");
  }

  if (outpath) {
    if (!fs.statSync(outpath).isDirectory()) {
      console.error(outpath + " not a directory");
      process.exit(1);
    }
  }


  var criteria = {
    'portal': (argv.portal ? argv.portal : 'ezproxy'),
    'period': (argv.period ? argv.period : '')
  };

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

    if (filtered.length === 0) { console.error("No file match criteria"); }
    if (! argv.list) {
      var ecmake = require('../../lib/ecmake.js');

      start = moment();
      async.eachSeries(filtered, function (infile, callback) { ecmake.EcMake(infile, outpath, options, argv, callback)} , function () {
        end = moment();
        if (argv.verbose) {
          console.log("Elapsed time : " + end.diff(start, 'seconds', true) + ' seconds');
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
