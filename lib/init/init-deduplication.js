'use strict';

var InitError = require('../initerror.js');
var ezJobs    = require('../jobs.js');

/**
 * Create the deduplication options
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
 * @param  {Function} callback returns deduplication options
 */
module.exports = function (req, res, logger, callback) {
  logger.verbose('Initializing deduplication');
  var job          = ezJobs[req.ezRID];
  var headers      = req.headers;
  var regInterval  = /^double-click-([a-z]+)$/i;
  var regFieldname = /^double-click-([CLI])-field$/i;
  var regStrategy  = /^double-click-strategy$/i;
  var regRemoval   = /^double-click-removal$/i;
  var options      = {
    intervals: {},
    fieldnames: {},
    use: true
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
          options.intervals[match[1]] = val;
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
  callback(null);
}