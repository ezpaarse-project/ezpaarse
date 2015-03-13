'use strict';

var iconv = require('iconv-lite');

/**
 * Get exclusions settings
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger.verbose('Initializing exclusions');

  job.include = {
    robots: false,
    hosts: false,
    domains: false
  };

  var include = (req.header('ezpaarse-include') || 'none').toLowerCase();

  if (include == 'all') {
    job.include.robots  = true;
    job.include.hosts   = true;
    job.include.domains = true;
  } else if (include != 'none') {
    var parts = include.split(',').map(function (p) { return p.trim(); });

    job.include.robots  = parts.indexOf('robots') != -1;
    job.include.hosts   = parts.indexOf('ignored-hosts') != -1;
    job.include.domains = parts.indexOf('ignored-domains') != -1;
  }

  job.logger.info("Included", job.include);

  next(null);
};
