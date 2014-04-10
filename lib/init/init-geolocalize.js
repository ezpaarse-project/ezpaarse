'use strict';
require('sugar'); // add more methods to Objects (like merge)

/**
 * Check for geolocalization options and update 
 * array containing the fields to use when writing ECs
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  var hostlocalize  = require('./../hostlocalize.js');
  var fieldsHeader  = req.header('Geoip-Output-Fields');

  job.logger.verbose('Initializing geolocalization fields');
  job.outputFields  = job.outputFields || { added: [], removed: [] };
  job.geolocalize   = "geoip-lookup"; // default

  // control geoip localization type
  // dns lookup is much more time consumming and for
  // resolved addresses only
  if (req.header('Geoip-Localization') === 'dns-lookup'
      || req.header('Geoip-Localization') === 'geoip-lookup'
      || req.header('Geoip-Localization') === 'none'
    ) {
    job.geolocalize = req.header('Geoip-Localization');
  } else if (req.header('Geoip-Localization')) {
    next([400, 4020]);
    return;
  }

  job.logger.verbose('Geolocalization : ', job.geolocalize);
  job.report.set('general', 'geolocalization', job.geolocalize);

  if (job.geolocalize !== 'none') {
    if (fieldsHeader && fieldsHeader === 'all') {
      Object.merge(job.outputFields.added, hostlocalize.geoipFields);
    } else if (fieldsHeader) {
      job.logger.verbose('Fields header: ' + fieldsHeader);
      var fields = fieldsHeader.split(',');
      for (var i = 0, l = fields.length; i < l; i++) {
        var field    = fields[i].trim();
        // control requested fields
        if (!field || hostlocalize.geoipFields.indexOf(field) == -1) {
          next([400, 4019]);
          return;
        }
        if (job.outputFields.added.indexOf(field) == -1) {
          job.outputFields.added.push(field);
        }
      }
    } else {
      job.logger.verbose('Using geoip default fields ' +
        '(geoip-latitude, geoip-longitude, geoip-country)');
      Object.merge(job.outputFields.added, hostlocalize.geoipDefaultFields);
    }
  }
  next(null);
};