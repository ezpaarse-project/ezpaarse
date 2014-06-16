'use strict';

/**
 * Get requested charsets for input and ouput streams
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger.verbose('Initializing alerts');

  var match;
  var actions       = req.header('ezPAARSE-Alert-Notifications');
  var reg           = /([a-zA-Z]+)<(.+?)>(?:,|$)/g;
  job.alerts        = [];
  job.notifications = { mail: [] };
  job.notifiers     = {
    'unknown-domains': require('../alerts/unknown-domains.js')()
  };

  job.report.set('alerts', 'active-alerts', Object.keys(job.notifiers).join(', '));

  match = reg.exec(actions);
  while (match) {

    switch (match[1].toLowerCase()) {
    case 'mail':
      job.notifications.mail.push(match[2]);
      break;
    default:
      next(['406', '4021']);
      return;
    }

    match = reg.exec(actions);
  }

  if (job.notifications.mail.length) {
    job.logger.info('Mail notifications : %s', job.notifications.mail.join(', '));
    job.report.set('alerts', 'mailto', job.notifications.mail.join(', '));
  }

  next(null);
};