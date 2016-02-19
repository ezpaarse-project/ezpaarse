'use strict';

var ecFilter = require('../ecfilter.js');

/**
 * Check EC qualification
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function qualifier(req, res, job) {

  return function qualify(ec, next) {
    if (!ec || ecFilter.isQualified(ec)) { return next(); }

    var err  = new Error('EC not qualified');
    err.type = 'ENOTQUALIFIED';
    next(err);
  };
};
