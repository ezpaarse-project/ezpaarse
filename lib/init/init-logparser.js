'use strict';

var ezJobs    = require('../jobs.js');
var LogParser = require('../logparser.js');

/**
 * Creates the log parser depending on the given log format
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
 * @param  {Function} callback returns the log parser
 */
module.exports = function (req, res, logger, callback) {
  logger.verbose('Initializing log parser');
  var job        = ezJobs[req._jobID];
  var dateFormat = req.header('Date-Format');
  var logFormat  = '';
  var logProxy   = '';

  var proxies = ['ezproxy', 'apache', 'squid'];
  for (var i = 0, l = proxies.length; i < l; i++) {
    var proxy = proxies[i];
    logFormat = req.header('Log-Format-' + proxy);
    if (logFormat) {
      logProxy = proxy;
      break;
    }
  }

  job.logParser = new LogParser(logger, logFormat, logProxy, dateFormat);
  callback(null);
}