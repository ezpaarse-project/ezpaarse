'use strict';

/**
 * Get exclusions settings
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger.verbose('Initializing exclusions');

  job.filters = {
    robots: true,
    hosts: true,
    domains: true
  };

  var disabled = (req.header('disable-filters') || 'none').toLowerCase();

  if (disabled == 'all') {
    job.filters.robots  = false;
    job.filters.hosts   = false;
    job.filters.domains = false;
  } else if (disabled != 'none') {
    var parts = disabled.split(',').map(function (p) { return p.trim(); });

    job.filters.robots  = parts.indexOf('robots') == -1;
    job.filters.hosts   = parts.indexOf('ignored-hosts') == -1;
    job.filters.domains = parts.indexOf('ignored-domains') == -1;
  }

  job.logger.verbose(`Filters: ${job.filters}`);

  next(null);
};
