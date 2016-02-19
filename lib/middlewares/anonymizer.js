'use strict';

var crypto = require('crypto');

/**
 * Anonymize host and/or login
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function anonymizer(req, res, job) {
  job.logger.verbose('Initializing anonymization');

  var loginHash = req.header('Anonymize-login');
  var hostHash  = req.header('Anonymize-host');
  var hashes    = ['md5', 'sha1'];
  var err;

  if (hostHash && hashes.indexOf(hostHash) === -1) {
    err        = new Error();
    err.code   = 4004;
    err.status = 400;
    return err;
  }

  if (loginHash && hashes.indexOf(loginHash) === -1) {
    err        = new Error();
    err.code   = 4004;
    err.status = 400;
    return err;
  }

  return function anonymize(ec, next) {
    if (!ec) { return next(); }

    if (ec.host && hostHash) {
      ec.host = crypto.createHash(hostHash).update(ec.host).digest('hex');
    }
    if (ec.login && loginHash) {
      ec.login = crypto.createHash(loginHash).update(ec.login).digest('hex');
    }

    next();
  };
};