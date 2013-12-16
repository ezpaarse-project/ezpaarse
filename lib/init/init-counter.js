'use strict';

var InitError       = require('../initerror.js');
var ezJobs          = require('../jobs.js');
var CounterReporter = require('../counter-reporter.js');

/**
 * Get counter reporting options
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Function} callback returns an optional error
 */
module.exports = function (req, res, callback) {
  var job      = ezJobs[req._jobID];
  var logRoute = req.ezBaseURL + '/' + req._jobID;
  job.logger.verbose('Initializing counter reporting');

  // Get asked COUNTER reports (ex JR1, BR2...)
  var counterReporter = new CounterReporter();
  var reportFormat     = (req.header('COUNTER-Format') || 'xml').toLowerCase();

  if (['csv', 'xml'].indexOf(reportFormat) == -1) {
    callback(new InitError(406, 4017));
    return;
  }

  var reports = (req.header('COUNTER-Reports') || '').toLowerCase().split(',');
  var report;
  for (var i = reports.length - 1; i >= 0; i--) {
    report = reports[i].trim();
    if (!report) { return; }

    var added = counterReporter.add(report);
    if (added) {
      var fileURL = logRoute + '/' + report + '.' + reportFormat;
      job.report.set('stats', 'url-counter-' + report, fileURL);
    } else {
      callback(new InitError(501, 4018));
      return;
    }
  }

  job.counterFormat   = reportFormat;
  job.counterReporter = counterReporter;

  callback(null);
};