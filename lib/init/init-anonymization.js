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
  var err;

  if (anonymizeHost) {
    if (hashes.indexOf(anonymizeHost) != -1) {
      job.anonymize.host = anonymizeHost;
    } else {
      err        = new Error();
      err.code   = 4004;
      err.status = 400;
      return next(err);
    }
  }

  if (anonymizeLogin) {
    if (hashes.indexOf(anonymizeLogin) != -1) {
      job.anonymize.login = anonymizeLogin;
    } else {
      err        = new Error();
      err.code   = 4004;
      err.status = 400;
      return next(err);
    }
  }

  next(null);
};