'use strict';

var ezJobs    = require('../jobs.js');
var LogParser = require('../logparser.js');

/**
 * Creates the log parser depending on the given log format
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Function} callback returns the log parser
 */
module.exports = function (req, res, callback) {
  var job            = ezJobs[req._jobID];
  job.logger.verbose('Initializing log parser');
  var dateFormat     = req.header('Date-Format');
  var relativeDomain = req.header('Relative-Domain');
  var logFormat      = '';
  var logProxy       = '';

  var proxies = ['ezproxy', 'apache', 'squid'];
  for (var i = 0, l = proxies.length; i < l; i++) {
    var proxy = proxies[i];
    logFormat = req.header('Log-Format-' + proxy);
    if (logFormat) {
      logProxy = proxy;
      break;
    }
  }
  job.report.set('general', 'input-log-type', proxies[i] || 'auto');
  job.report.set('general', 'input-log-format', logFormat || 'auto');

  job.logParser = new LogParser(job.logger, logFormat, logProxy, dateFormat, relativeDomain);
  callback(null);
};