'use strict';


exports.EcMaker = function () {
  var request = require('request');
  var fs      = require('fs');
  var config  = require('../config.js');
  var path    = require('path');
  var moment  = require('moment');
  var zlib    = require('zlib');


  var outpath, infile, outfile, reportfile;
  var logStream;
  var headers = { 'Reject-Files': 'none'};
  var url = 'http://127.0.0.1:' + config.EZPAARSE_NODEJS_PORT;
  var options = {
    url: url,
    headers: headers
  };

  var optimist = require('optimist')
    .usage('Inject a file to ezPAARSE (for batch purpose)' +
      '\n  Usage: $0 [-hosv] infile')
    .boolean(['v', 's'])
    .alias('silent', 's')
    .describe('silent', 'No output')
    .alias('outpath', 'o')
    .describe('outpath', 'If provided, output directory (default tmp).')
    .alias('verbose', 'v')
    .describe('verbose', 'Shows detailed operations.');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  if (argv.outpath) {
    outpath = argv.outpath;
  } else {
    outpath = path.join(__dirname, "../../tmp");
  }

  if (!fs.statSync(outpath).isDirectory()) {
    console.error(outpath + " not a directory");
    process.exit(1);
  }


  if (argv.input) {
    infile = argv.input;
    if (path.basename(infile).match('.log$')) {
      logStream = fs.createReadStream(argv.input);
      outfile = path.join(outpath, path.basename(infile).replace(".log", ".ec.csv"));
      reportfile = path.join(outpath, path.basename(infile).replace(".log", ".report.html"));
    } else if (path.basename(infile).match('.log.gz$')) {
      logStream = fs.createReadStream(argv.input).pipe(zlib.createGunzip());
      outfile = path.join(outpath, path.basename(infile).replace(".log.gz", ".ec.csv"));
      reportfile = path.join(outpath, path.basename(infile).replace(".log.gz", ".report.html"));
    } else {
      console.error("Error : " + infile + " hasn't a log extension");
      process.exit(1);
    }
  } else {
    infile = 'ecmaker-' + moment().format('YYYY-MM-DD_HH-mm-ss') + '.log';
    logStream = process.stdin;
  }


  var resultStream = fs.createWriteStream(outfile);
  //var resultStream = process.stdout;


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
          var r = JSON.parse(body);
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
    }
  });
};