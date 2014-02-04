'use strict';

/**
 * Sets the variables used for anonymization
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger.verbose('Initializing anonymization');
  job.anonymize       = {};
  var anonymizeLogin  = req.header('Anonymize-login');
  var anonymizeHost   = req.header('Anonymize-host');
  var hashes          = ['md5', 'sha1'];

  if (anonymizeHost) {
    if (hashes.indexOf(anonymizeHost) != -1) {
      job.anonymize.host = anonymizeHost;
    } else {
      next([400, 4004]);
      return;
    }
  }

  if (anonymizeLogin) {
    if (hashes.indexOf(anonymizeLogin) != -1) {
      job.anonymize.login = anonymizeLogin;
    } else {
      next([400, 4004]);
      return;
    }
  }

  next(null);
};