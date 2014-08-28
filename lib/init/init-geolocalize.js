'use strict';
require('sugar'); // add more methods to Objects (like merge)
var cfg = require('../../config.json');

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

  job.logger.verbose('Initializing geolocalization fields');
  job.outputFields  = job.outputFields || { added: [], removed: [] };
  job.geolocalize   = cfg.EZPAARSE_GEOLOCALIZE_DEFAULT; // default

  var geoFields = (req.header('Geoip') || '').toLowerCase();

  job.logger.verbose('Geolocalization fields : ', geoFields);
  job.report.set('general', 'geolocalization', geoFields);
  if (geoFields === 'none') {
    job.geolocalize = false;
    return next(null);
  }

  if (geoFields === 'all') {
    Object.merge(job.outputFields.added, hostlocalize.geoipFields);
  } else if (geoFields) {
    job.logger.verbose('Fields header: ' + geoFields);

    var fields = geoFields.split(',');
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

  job.geolocalize = true;
  next(null);
};