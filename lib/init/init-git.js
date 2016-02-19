'use strict';

var git = require('../git-tools.js');

/**
 * Get git informations to put in reports
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger.verbose('Initializing git values');

  git.branch(function (err, str) {
    job.report.set('general', 'git-branch', str || 'N/A');

    git.tag(function (err, str) {
      if (str) { job.report.set('general', 'git-tag', str || 'N/A'); }

      git.long(function (err, str) {
        if (str) { job.report.set('general', 'git-last-commit', str || 'N/A'); }

        next(null);
      });
    });
  });
};