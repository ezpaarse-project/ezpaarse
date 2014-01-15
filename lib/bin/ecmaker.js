'use strict';

//
// Command used to generate EC files from log files
//
// mask on path to choose files
// /applis/archives/host/portail/year/year-month/ezproxy.portail.year-month-day.log.gz


var fs      = require('fs');
var path    = require('path');
var shell = require('shelljs');
var moment    = require('moment');

var default_path = path.join(__dirname, "../../test/dataset");
var dir_path;

exports.ECMaker = function () {
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
    console.log("default path " + default_path + " is used");
    dir_path = default_path;
  }

  if (argv.outpath) {
    if (!fs.statSync(argv.outpath).isDirectory()) {
      console.error(argv.outpath + " not a directory");
      process.exit(1);
    }
  }

  var criteria = {
    'portal': (argv.portal ? argv.portal : 'ezproxy'),
    'period': (argv.period ? argv.period : '')
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
          outfile = path.join((argv.outpath ? argv.outpath : ""),
            path.basename(infile).replace(".log", ".ec.csv"));
          cmd = 'loginjector --input=' + infile + ' --output=' + outfile;
          console.log(cmd);
          if (shell.exec(cmd, {silent: true}).code !== 0) {
            console.error(infile + ' : not found');
          } else {
            if (!argv.silent) { console.log(infile + ' : done'); }
          }
          if (argv.verbose) { console.log(outfile); }
        } else if (path.extname(infile) == ".gz") {
          outfile = path.join((argv.outpath ? argv.outpath : ""),
            path.basename(infile).replace(".log.gz", ".ec.csv"));
          cmd = 'zcat ' + infile + ' | loginjector --output=' + outfile;
          console.log(cmd);
          if (shell.exec(cmd, {silent: true}).code !== 0) {
            console.error(infile + ' : not found');
          } else {
            if (shell.exec('gzip -f ' + outfile, {silent: true}).code !== 0) {
              console.error("Erreur de compression de " + outfile);
            } else {
              if (argv.verbose) { console.log("compression de " + outfile); }
            }
          }
          if (argv.verbose) { console.log(outfile); }
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
