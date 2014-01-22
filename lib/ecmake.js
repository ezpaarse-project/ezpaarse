'use strict';

exports.EcMake = function (infile, outpath, options, argv, callback) {
  var request = require('request');
  var fs      = require('fs');
  var path    = require('path');
  var moment  = require('moment');
  var zlib    = require('zlib');
  var logStream;
  var reportfile, outfile;

  if (infile) {
    if (path.basename(infile).match('.log$')) {
      logStream = fs.createReadStream(infile);
      outfile = path.join(outpath, path.basename(infile).replace(".log", ".ec.csv"));
      reportfile = path.join(outpath, path.basename(infile).replace(".log", ".report.html"));
    } else if (path.basename(infile).match('.log.gz$')) {
      logStream = fs.createReadStream(infile).pipe(zlib.createGunzip());
      outfile = path.join(outpath, path.basename(infile).replace(".log.gz", ".ec.csv"));
      reportfile = path.join(outpath, path.basename(infile).replace(".log.gz", ".report.html"));
    } else {
      console.error("Error : " + infile + " hasn't a log extension");
      process.exit(1);
    }
  } else {
    infile = 'ecmake-' + moment().format('YYYY-MM-DD_HH-mm-ss') + '.log';
    logStream = process.stdin;
  }

  var resultStream = fs.createWriteStream(outfile);

  var req = logStream.pipe(request.post(options));

  var res = req.pipe(resultStream);

  res.on('finish', function () {
    if (argv.verbose) {
      console.log('End of treatment');
      console.log('Input : ' + infile);
      console.log('Result : ' + outfile);
      console.log('Report : ' + reportfile);
    }
    if (req.response.headers) {
      var report = req.response.headers['job-report'];
      if (argv.verbose) { console.log(report); }
      request.get(report, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var r;
          try {
            r = JSON.parse(body);
          } catch (e) {
            console.error(e);
            console.log(body);
            process.exit(1);
          }
          if (argv.verbose && r.general) { console.log("Treatment of " + r.general['Job-Date']); }
          if (r.general['Job-done'] === false) {
            console.error("Error : please show " + r.general['URL-Traces']);
            process.exit(1);
          }
        } else {
          console.error("Error : " + report + " not found");
          process.exit(1);
        }
      });
      request(report.replace(".json", ".html?standalone=1")).pipe(fs.createWriteStream(reportfile));
    } else {
      console.error("No headers in response");
      process.exit(1);
    }
    callback();
  });
};