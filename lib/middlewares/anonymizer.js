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

  var header = req.header('Crypted-Fields') || 'host,login';

  if (header.toLowerCase() === 'disabled') {
    job.logger.verbose('Crypting disabled');
    return function (ec, next) { next(); };
  }

  var cryptedFields = header.split(',').map(f => f.trim());

  job.logger.verbose('Crypted fields: ' + cryptedFields);

  return new Promise(function (resolve, reject) {
    crypto.randomBytes(40, function (err, buffer) {
      if (err) { return reject(err); }

      resolve(function anonymize(ec, next) {
        if (!ec) { return next(); }

        cryptedFields.forEach(function (field) {
          if (ec[field]) {
            ec[field] = crypto.createHmac('sha1', buffer).update(ec[field]).digest('hex');
          }
        });

        next();
      });
    });
  });

};
