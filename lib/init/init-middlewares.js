'use strict';

var git = require('../git-tools.js');
var path = require('path');

/**
 * Get git middlewares informations to put in reports
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger.verbose('Initializing git middlewares values');

  git.short({ cwd: path.join(__dirname, '..', '..', 'middlewares') }, function (err, str) {
    if (str) { job.report.set('general', 'middlewares-version', `${str}` || 'N/A'); }

    git.date({ cwd: path.join(__dirname, '..', '..', 'middlewares') }, function (err, str) {
      if (str) { job.report.set('general', 'middlewares-date', `${str}` || 'N/A'); }

      next(null);
    });

  });
};