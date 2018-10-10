'use strict';

var userlist     = require('../userlist.js');
var config       = require('../config.js').EZPAARSE_ALERTS;
var domainAlert  = require('../alerts/unknown-domains.js');
var missingAlert = require('../alerts/missing-title-ids.js');

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
  var actions       = req.header('ezPAARSE-Job-Notifications');
  var reg           = /([a-zA-Z]+)<(.+?)>(?:,|$)/g;
  job.alerts        = [];
  job.notifications = { mail: [] };
  job.alertConfig   = {
    activationThreshold:
      req.header('Alerts-Activation-Threshold') || config.activationThreshold,
    unknownDomainsRate:
      req.header('Alerts-Unknown-Domains-Rate') || config.unknownDomainsRate,
    titleIdOccurrenceRate:
      req.header('Alerts-TitleId-Occurrence-Rate') || config.titleIdOccurrenceRate,
    pkbFailRate:
      req.header('Alerts-PKB-Fail-Rate') || config.pkbFailRate
  };

  job.notifiers     = {
    'unknown-domains': domainAlert(job),
    'missing-title-ids': missingAlert(job)
  };

  job.report.set('alerts', 'active-alerts', Object.keys(job.notifiers).join(', '));

  match = reg.exec(actions);
  while (match) {

    switch (match[1].toLowerCase()) {
    case 'mail':
      job.notifications.mail.push(match[2]);
      break;
    default:
      return next(job.error(4021, 406));
    }

    match = reg.exec(actions);
  }

  if (job.notifications.mail.length) {
    job.logger.info(`Mail notifications : ${job.notifications.mail.join(', ')}`);
    job.report.set('notifications', 'mailto', job.notifications.mail.join(', '));
  }

  if (!req.user) { return next(null); }

  userlist.get(req.user.username, function (err, user) {
    if (user && user.notifiate) { job.notifications.mail.push(user.username); }
    next(null);
  });
};
