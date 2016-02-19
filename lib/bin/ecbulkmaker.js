/*eslint no-sync: 0*/
'use strict';

var fs      = require('graceful-fs');
var path    = require('path');
var mkdirp  = require('mkdirp');
var ecmaker = require('../ecmake.js');

var logReg  = /\.log(?:\.gz)?$/;

/**
 *  Command used to generate EC files from log files
 *
 *  mask on path to choose files
 *  /applis/archives/host/portail/year/year-month/ezproxy.portail.year-month-day.log.gz
 */
exports.EcBulkMaker = function () {

  var yargs = require('yargs')
    .usage('Inject files to ezPAARSE (for batch purpose)' +
      '\n  Usage: $0 [-rflvH] SOURCE_DIR [RESULT_DIR]')
    .boolean(['v', 'f', 'r', 'l'])
    .string(['header', 'proxy'])
    .alias('list', 'l')
    .alias('recursive', 'r') //TODO: add report
    .alias('force', 'f')
    .alias('uri', 'u')
    .alias('header', 'H')
    .alias('proxy', 'p')
    .alias('verbose', 'v')
    .describe('recursive', 'If provided, files in subdirectories will be processed. '
                         + '(preserves the file tree)')
    .describe('list', 'If provided, only list files.')
    .describe('force', 'override existing result (default false).')
    .describe('uri', 'the ezPAARSE instance to use.')
    .describe('header', 'header parameter to use.')
    .describe('proxy', 'a proxy to use (no value or empty string to use no proxy).')
    .describe('verbose', 'Shows detailed operations.');
  var argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help || argv.h || argv._.length < 1) {
    yargs.showHelp();
    process.exit(0);
  }

  var sourceDir = path.resolve(argv._[0]);
  var resultDir = argv._[1] ? path.resolve(argv._[1]) : sourceDir;

  if (!fs.existsSync(sourceDir)) {
    console.error('[Error] %s: directory %s does not exist', sourceDir);
    process.exit(1);
  }

  if (fs.existsSync(resultDir) && !fs.statSync(resultDir).isDirectory()) {
    console.error('[Error] %s is not a directory', resultDir);
    process.exit(1);
  }

  if (argv.verbose) {
    console.error('[Info] Source dir: ' + sourceDir);
    console.error('[Info] Result dir: ' + resultDir);
  }

  var headers = { 'Reject-Files': 'none'};

  if (argv.header) {
    if (!Array.isArray(argv.header)) { argv.header = [argv.header]; }

    argv.header.forEach(function (item) {
      var i = item.indexOf(':');
      if (i !== -1) {
        headers[item.substr(0, i)] = item.substr(i + 1).trim();
      } else {
        console.error('[Error] Bad header syntax => %s', item);
        process.exit(1);
      }
    });
  }

  /**
   * List all log files in a directory (recursively)
   * @param  {String}   dir  directory to browse
   * @param  {Function} callback(err, files)
   */
  var getLogFiles = function (dir, callback) {
    var logFiles = [];

    fs.readdir(dir, function (err, fileList) {
      if (err) { return callback(err); }

      var i = 0;
      (function next() {
        var file = fileList[i++];
        if (!file) { return callback(null, logFiles); }

        file = path.resolve(dir, file);

        fs.stat(file, function (err, stat) {
          if (err || !stat) { return next(); }

          if (!stat.isDirectory()) {
            if (logReg.test(file)) { logFiles.push(file); }
            return next();
          }

          if (!argv.recursive) { return next(); }

          getLogFiles(file, function (err, files) {
            if (err) { return callback(err); }

            logFiles = logFiles.concat(files);
            next();
          });
        });
      })();
    });
  };

  getLogFiles(sourceDir, function (err, files) {
    if (err) { throw err; }

    if (files.length === 0) { console.error('[Error] No logfile found'); }
    if (files.length >= 500) {
      console.error('[Error] Too many logfiles (%d)', files.length);
      process.exit(1);
    }

    if (argv.list) {
      console.log('[Info] Logfiles found :');
      console.log(files);
      return;
    }

    var startTime     = process.hrtime();
    var errorDetected = false;
    var i = 0;
    var processFiles = function (callback) {
      var file = files[i++];

      if (!file) { return callback(); }

      var resDir     = path.join(resultDir, path.relative(sourceDir, path.dirname(file)));
      var resultFile = path.join(resDir, path.basename(file).replace(logReg, '.ec.csv'));
      var reportFile = path.join(resDir, path.basename(file).replace(logReg, '.report.html'));
      var koFile     = resultFile + '.ko';

      fs.exists(resultFile, function (exists) {
        if (exists && !argv.force) {
          console.error('[Warning] %s exists, skipping', resultFile);
          return processFiles(callback);
        } // TODO: unlink html report if forcing

        if (argv.verbose) { console.log('[info] Processing %s', file); }

        mkdirp(resDir, function (err) {
          if (err) {
            errorDetected = true;
            console.error('[Error] Could not create %s', resDir);
            return processFiles(callback);
          }

          var options = {
            uri: argv.uri,
            headers: headers
          };

          if (typeof argv.proxy === 'string') {
            options.proxy = argv.proxy || null;
          } else if (argv.proxy === true) {
            options.proxy = null;
          }

          ecmaker()
          .file(file)
          .result(resultFile)
          .report(reportFile)
          .options(options)
          .process(function (err) {
            if (err) {
              errorDetected = true;
              var stop;
              if (err.code == 'ECONNREFUSED') {
                console.error('[Error] ezPAARSE is not running');
                stop = true;
              } else {
                console.error('[Error] %s', err.toString());
              }

              fs.rename(resultFile, koFile, function (err) {
                if (err) { console.error('[Warning] The result file could not be renamed'); }
                if (stop) { return callback(); }
                processFiles(callback);
              });
            } else {
              // if a KO file exists, we can remove it
              fs.exists(koFile, function (exists) {
                if (exists) {
                  fs.unlink(koFile, function (err) {
                    processFiles(callback);
                  });
                } else {
                  processFiles(callback);
                }
              });
            }
          });
        });
      });
    };

    processFiles(function onEnd() {
      var elapsed = process.hrtime(startTime);
      if (argv.verbose) {
        console.log('[Info] Terminated in %d.%d seconds',
          elapsed[0], Math.round(elapsed[1] / 10000));
      }

      process.exit(errorDetected ? 1 : 0);
    });
  });
};