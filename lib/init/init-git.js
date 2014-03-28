'use strict';

var git = require('../git-tools.js');

/**
 * Get requested charsets for input and ouput streams
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger.verbose('Initializing git values');

  git.branch(function (str) {
    if (str) { job.report.set('general', 'git-branch', str); }
  });
  git.tag(function (str) {
    if (str) { job.report.set('general', 'git-tag', str); }
  });
  git.long(function (str) {
    if (str) { job.report.set('general', 'git-last-commit', str); }
  });

  next(null);
};