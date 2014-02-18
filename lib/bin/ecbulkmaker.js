'use strict';

//
// Command used to generate EC files from log files
//
// mask on path to choose files
// /applis/archives/host/portail/year/year-month/ezproxy.portail.year-month-day.log.gz

exports.EcBulkMaker = function () {
  var fs      = require('graceful-fs');
  var path    = require('path');
  var moment  = require('moment');
  var config  = require('../config.js');
  var async   = require('async');
  var mkdirp  = require('mkdirp');

  var dirbase = path.join(__dirname, "../..");

  // skip rejeted files
  var headers = {};
  var url = 'http://127.0.0.1:' + config.EZPAARSE_NODEJS_PORT;

  var optimist = require('optimist')
    .usage('Inject files to ezPAARSE (for batch purpose)' +
      '\n  Usage: $0 [-fhlvDHLS] \n\t--source=sources_directory ' +
      '\n\t--dest=results_directory ' +
      '\n\t--logsdir=relative_path_to_log_form_sources')
    .boolean(['v', 'f'])
    .demand(['S', 'D', 'L'])
    .alias('source', 'S')
    .describe('source', 'Archives sources base directory.' +
      '\n\t (like --source=/applis/stats/home/archives)')
    .alias('dest', 'D')
    .describe('dest', 'Results base directory.' +
      '\n\t (like --dest=/applis/stats/home/ezresults)')
    .alias('logsdir', 'L')
    .describe('logsdir', 'Relative log directory.' +
       '\n\t (like --logsdir=fede/bibliovie/2013)')
    .alias('list', 'l')
    .describe('list', 'If provided, only list files.')
    .alias('force', 'f')
    .describe('force', 'override existing result (default false).')
    .alias('headers', 'H')
    .string('headers')
    .describe('headers', 'headers parameters to use.')
    .alias('verbose', 'v')
    .describe('verbose', 'Shows detailed operations.');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  if (argv.headers) {
    if (Array.isArray(argv.headers)) {
      argv.headers.forEach(function (item) {
        var h = item.split(':');
        headers[h[0]] = h[1].trim();
      });
    } else {
      var h = argv.headers.split(':');
      headers[h[0]] = h[1].trim();
    }
  } else {
    // skip rejeted files
    headers = { 'Reject-Files': 'none'};
  }

  var options = {
    url: url,
    headers: headers
  };

  // check source and dest directories validity
  var source_path, dest_path, logsdir_path;
  if (argv.source) {
    if (! fs.existsSync(argv.source)) {
      console.error("Directory " + argv.source + " doesn't exist !");
      process.exit(1);
    }
    source_path = path.resolve(dirbase, path.normalize(argv.source));
    if (argv.verbose) { console.error("Source : " + source_path); }
  } else {
    console.error("error (mandatory parameter) : --source=Archives sources base directory");
    process.exit(1);
  }

  if (argv.dest) {
    if (! fs.existsSync(argv.dest)) {
      console.error("Directory " + argv.dest + " doesn't exist !");
      process.exit(1);
    }
    dest_path = path.resolve(dirbase, path.normalize(argv.dest));
    if (argv.verbose) { console.error("Results : " + dest_path); }
  } else {
    console.error("error (mandatory parameter) : --dest=Results base directory");
    process.exit(1);
  }

  if (dest_path.match('^' + source_path)) {
    console.error("error (forbidden) : results directory is inside source directory (" +
      argv.source + ')');
    process.exit(1);
  }

  if (source_path === dest_path) {
    console.error("error (forbidden) : source and dest are identical (" +
      source_path + ')');
    process.exit(1);
  }

  // check log directory
  if (argv.logsdir) {
    logsdir_path = path.resolve(dirbase, source_path, path.normalize(argv.logsdir));
    if (! fs.existsSync(logsdir_path)) {
      console.error("Directory " + logsdir_path + " doesn't exist !");
      process.exit(1);
    }
    if (argv.verbose) { console.error("Logsdir : " + logsdir_path); }
  } else {
    console.error("error (mandatory parameter) : --logsdir=Relative log directory");
    process.exit(1);
  }


  var criteria = {
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

  walk(logsdir_path, function (err, results) {
    if (err) { throw new Error(logsdir_path + ' not accessible'); }

    var filtered = results.filter(matchCriteria, criteria);

    if (filtered.length === 0) { console.error("No file match criteria"); }
    if (filtered.length >= 500) {
      console.error("Too many files match criteria (" + filtered.length + ")");
      process.exit(1);
    }

    if (! argv.list) {
      var start = moment();
      async.eachSeries(filtered, function (infile, callback) {
          action(infile, callback);
        }
        , function () {
        var end = moment();
        if (argv.verbose) {
          console.log("Elapsed time : " + end.diff(start, 'seconds', true) + ' seconds');
        }
      });
    } else {
      console.log("Files matching :");
      console.log(filtered);
    }
  });

  function action(infile, callback) {
    var ecmake = require('../../lib/ecmake.js');
    var resdir = path.dirname(infile.replace(source_path, dest_path));
    if (! fs.existsSync(resdir)) {
      mkdirp.sync(resdir);
    }
    ecmake.EcMake(infile, resdir, options, argv, callback);
  }

  function matchCriteria(element) {
    var criteria = this;


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