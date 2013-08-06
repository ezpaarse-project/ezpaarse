'use strict';

var InitError = require('../initerror.js');
var ezJobs    = require('../jobs.js');

/**
 * Sets the variables used for anonymization
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Function} callback returns an array of fields to be anonymized
 */
module.exports = function (req, res, callback) {
  var job             = ezJobs[req._jobID];
  job.logger.verbose('Initializing anonymization');
  job.anonymize       = {};
  var anonymizeLogin  = req.header('Anonymize-login');
  var anonymizeHost   = req.header('Anonymize-host');
  var hashes          = ['md5', 'sha1'];

  if (anonymizeHost) {
    if (hashes.indexOf(anonymizeHost) != -1) {
      job.anonymize.host = anonymizeHost;
    } else {
      callback(new InitError(400, 4004));
      return;
    }
  }

  if (anonymizeLogin) {
    if (hashes.indexOf(anonymizeLogin) != -1) {
      job.anonymize.login = anonymizeLogin;
    } else {
      callback(new InitError(400, 4004));
      return;
    }
  }

  callback(null);
};