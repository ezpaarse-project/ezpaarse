'use strict';

var ecFilter = require('../ecfilter.js');

/**
 * Filter irrelevant consultations
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function (req, res, job) {

  return function filter(ec, next) {
    if (!ec) { return next(); }
    
    var ecValid = ecFilter.isValid(ec, job);
    var err;

    if (!ecValid.valid) {
      err      = new Error('irrelevant EC');
      err.type = 'EIRRELEVANT';
      return next(err);
    }

    if (job.cleanOnly) {
      err      = new Error('EC clean only');
      err.type = 'ECLEAN';
      return next(err);
    }

    if (job.filters.domains && ecFilter.isIgnoredDomain(ec.domain)) {
      err      = new Error('ignored domain');
      err.type = 'EIGNOREDDOMAIN';
      return next(err);
    }

    if (job.filters.hosts && ecFilter.isIgnoredHost(ec.host)) {
      err      = new Error('ignored host');
      err.type = 'EIGNOREDHOST';
      return next(err);
    }

    if (ecFilter.isRobot(ec.host)) {
      if (job.filters.robots) {
        err      = new Error('host detected as a robot');
        err.type = 'EROBOT';
        return next(err);
      }
      ec.robot = 'yes';
    } else {
      ec.robot = 'no';
    }

    next();
  };
};