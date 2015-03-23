'use strict';

/**
 * Create the deduplication options
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger.verbose('Initializing deduplication');
  var headers      = req.headers;
  var regInterval  = /^double-click-([a-z]+)$/i;
  var regFieldname = /^double-click-([CLI])-field$/i;
  var regStrategy  = /^double-click-strategy$/i;
  var regRemoval   = /^double-click-removal$/i;
  var options      = {
    intervals: {
      'misc': 30,
      'html': 10,
      'pdf': 30
    },
    fieldnames: {
      'C': 'session',
      'L': 'login',
      'I': 'host'
    },
    strategy: 'CLI',
    use: true,
    mixTypes: false
  };
  var match;

  for (var header in headers) {

    if (regStrategy.test(header)) {
      options.strategy = headers[header];
    } else if (regRemoval.test(header)) {
      options.use = !/^false$/i.test(headers[header]);
    } else {

      match = regInterval.exec(header);
      if (match) {
        var val = parseInt(headers[header], 10);
        if (!isNaN(val) && isFinite(val)) {
          if (match[1].toLowerCase() == 'mixed') {
            options.mixTypes = val;
          } else {
            options.intervals[match[1].toLowerCase()] = val;
          }
        }
      } else {
        match = regFieldname.exec(header);
        if (match) {
          options.fieldnames[match[1].toUpperCase()] = headers[header];
        }
      }
    }
  }

  job.deduplication = options;
  next(null);
};