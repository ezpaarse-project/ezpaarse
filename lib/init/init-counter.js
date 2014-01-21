'use strict';

var InitError       = require('../initerror.js');
var ezJobs          = require('../jobs.js');
var CounterReporter = require('../counter-reporter.js');
var cfg             = require('../../config.json');

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
  var reportFormat    = (req.header('COUNTER-Format') || 'xml').toLowerCase();

  if (['csv', 'xml'].indexOf(reportFormat) == -1) {
    callback(new InitError(406, 4017));
    return;
  }

  var customer = req.header('COUNTER-Customer');
  var vendor   = req.header('COUNTER-Vendor');
  var match;
  if (customer) {
    match = /^([^<]*)<(.*)>$/.exec(customer);
    if (match) { customer = { name: match[1].trim(), email: match[2] }; }
    else       { customer = { name: customer }; }
  }

  if (vendor) {
    match = /^([^<])<(.*)>$/.exec(vendor);
    if (match) { vendor = { name: match[1], email: match[2] }; }
    else       { vendor = { name: vendor }; }
  }
  counterReporter.set('vendor', vendor || { name: 'platform42' });
  counterReporter.set('customer', customer || {
    name: "ezPAARSE",
    email: cfg.EZPAARSE_ADMIN_MAIL
  });

  var reports = (req.header('COUNTER-Reports') || '').toLowerCase().split(',');
  var report;
  for (var i = reports.length - 1; i >= 0; i--) {
    report = reports[i].trim();
    if (!report) { continue; }

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