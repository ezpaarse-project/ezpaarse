'use strict';

var InitError = require('../initerror.js');
var ezJobs    = require('../jobs.js');
var iconv     = require('iconv-lite');

/**
 * Get requested charsets for input and ouput streams
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Function} callback
 */
module.exports = function (req, res, callback) {
  var job = ezJobs[req._jobID];
  job.logger.verbose('Initializing charsets');

  var reqCharset = req.header('request-charset')  || 'utf-8';
  var resCharset = req.header('response-charset') || 'utf-8';

  if (iconv.encodingExists(reqCharset)) {
    job.logger.info('Charset for request : ' + reqCharset);
    job.inputCharset = reqCharset;
  } else {
    job.logger.warn('(request) Charset is  not supported');
    callback(new InitError(406, 4015));
    return;
  }

  if (iconv.encodingExists(resCharset)) {
    job.logger.info('Charset for response : ' + resCharset);
    job.outputCharset = resCharset;
  } else {
    job.logger.warn('(response) Charset is  not supported');
    callback(new InitError(406, 4016));
    return;
  }

  callback(null);
};