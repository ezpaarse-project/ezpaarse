'use strict';

var logParser = require('../logparser.js');

/**
 * Creates the log parser depending on the given log format
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger?.verbose('Initializing log parser');

  var options = {
    logger: job.logger,
    dateFormat: req.header('Date-Format'),
    forceParser: req.header('Force-Parser'),
    forceECFieldPublisher: req.header('Force-ECField-Publisher')
  };

  var proxies = ['ezproxy', 'apache', 'squid'];
  for (var i = 0, l = proxies.length; i < l; i++) {
    var proxy = proxies[i];
    var logFormat = req.header('Log-Format-' + proxy);

    if (logFormat) {
      options.proxy  = proxy;
      options.format = logFormat;
      break;
    }
  }


  //job.logger?.info('Options', options);
  // spread options into jobs
  job.forceParser = options.forceParser;
  job.forceECFieldPublisher = options.forceECFieldPublisher;

  job.logParser = logParser(options);

  job.report.set('general', 'input-format-proxy', job.logParser.getProxy());
  job.report.set('general', 'input-format-literal', job.logParser.getFormat());
  job.report.set('general', 'input-format-regex', job.logParser.getRegexp(true));

  next(null);
};