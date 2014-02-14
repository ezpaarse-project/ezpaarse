'use strict';

var LogParser = require('../logparser.js');

/**
 * Creates the log parser depending on the given log format
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
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

  job.logParser = new LogParser(job.logger, logFormat, logProxy, dateFormat, relativeDomain);

  job.report.set('general', 'input-format-literal', job.logParser.getFormat());
  job.report.set('general', 'input-format-regex', job.logParser.getRegexp());

  next(null);
};