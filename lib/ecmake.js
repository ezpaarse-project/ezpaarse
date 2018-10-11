/* eslint no-sync: 0 */
'use strict';

var request = require('request');
var fs      = require('fs-extra');
var path    = require('path');
var util    = require('util');
var zlib    = require('zlib');
var Stream  = require('stream');
var config  = require('./config.js');

/**
 * Chainable module used to send logs to ezPAARSE and write results
 * Usage : ecmaker().file(path).result(path).process(callback)
 */
module.exports = function ecmaker() {
  var maker          = {};
  var uri            = 'http://127.0.0.1:' + config.EZPAARSE_NODEJS_PORT;
  var requestOptions = {};
  var resultFile;
  var reportFile;
  var logfile;

  /**
   * Set request options
   * @param {Object} o options
   */
  maker.options = function (o) { requestOptions = o; return this; };

  /* Set logfile path */
  maker.file    = function (f) { logfile = f; return this; };

  /* Set path result file */
  maker.result  = function (f) { resultFile = f; return this; };

  /* Set path to report file */
  maker.report  = function (f) { reportFile = f; return this; };

  /**
   * Send logs to ezPAARSE
   * @param  {Function} callback(err)
   */
  maker.process = function (callback) {
    if (typeof callback !== 'function') { callback = function () {}; }
    if (!requestOptions.uri) { requestOptions.uri = uri; }

    var sendError = function (message) {
      callback(new Error(message));
    };

    if (!logfile) {
      return sendError('no logfile provided');
    } else if (!fs.existsSync(logfile)) {
      return sendError(util.format('%s does not exist', logfile));
    } else if (!resultFile) {
      return sendError('no path provided for the result file');
    } else if (!fs.existsSync(path.dirname(resultFile))) {
      return sendError(util.format('%s does not exist', path.dirname(resultFile)));
    } else if (reportFile && !fs.existsSync(path.dirname(reportFile))) {
      return sendError(util.format('%s does not exist', path.dirname(reportFile)));
    }

    var logStream;
    if (typeof logfile == 'string') {
      if (path.extname(logfile) == '.gz') {
        logStream = fs.createReadStream(logfile).pipe(zlib.createGunzip());
      } else {
        logStream = fs.createReadStream(logfile);
      }
    } else if (logfile instanceof Stream) {
      logStream = logfile;
    } else {
      return sendError('Unsupported input type');
    }

    var resultStream = fs.createWriteStream(resultFile);
    var req          = logStream.pipe(request.post(requestOptions));

    var errorFired = false;
    req.on('error', function (err) { // sometimes error can be called twice
      if (errorFired) { return; }

      errorFired = true;
      callback(err);
    });

    req.pipe(resultStream).on('finish', function () {
      if (!req.response.headers) {
        return sendError('No headers in the response');
      }

      if (req.response.statusCode !== 200) {
        var msg = req.response.headers['ezpaarse-status-message'];
        var err = util.format('Got a code %d from the server', req.response.statusCode);
        if (msg) { err += util.format(' with message : "%s"', msg); }

        return sendError(err);
      }

      var reportURL = req.response.headers['job-report'];
      request.get(reportURL, { proxy: requestOptions.proxy }, function (error, res, body) {
        if (error || !res) {
          return sendError('The report could not be downloaded');
        } else if (res.statusCode !== 200) {
          return sendError(util.format('The report could not be downloaded at %s (code %s)',
            reportURL, res.statusCode));
        }

        var report;
        try {
          report = JSON.parse(body);
        } catch (e) {
          return sendError('Failed to parse the report');
        }

        if (!report.general) {
          return sendError('The main section of the report is missing');
        } else if (report.general['Job-done'] === false) {
          return sendError(util.format('The process seems to have ended prematurely, please see %s',
            report.general['URL-Traces']));
        }

        if (!reportFile) { return callback(); }
        request(reportURL.replace('.json', '.html?standalone=1'), { proxy: requestOptions.proxy })
          .pipe(fs.createWriteStream(reportFile))
          .on('error', function() { callback(); })
          .on('finish', function() { callback(); });
      });

    });

    return this;
  };

  return maker;
};
