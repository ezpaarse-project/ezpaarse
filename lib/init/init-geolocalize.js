'use strict';

/**
 * Check for geolocalization options and update 
 * array containing the fields to use when writing ECs
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger.verbose('Initializing geolocalization fields');
  job.outputFields  = job.outputFields || { added: [], removed: [] };
  job.geolocalize   = req.header('Geoip-Localization') === 'none' ? false : true;
  job.logger.verbose('Geolocalization : ', job.geolocalize);
  var hostlocalize = require('./../hostlocalize.js');

  var fieldsHeader  = req.header('Geoip-Output-Fields');

  if (job.geolocalize) {
    if (fieldsHeader) {
      job.logger.verbose('Fields header: ' + fieldsHeader);
      var fields = fieldsHeader.split(',');
      for (var i = 0, l = fields.length; i < l; i++) {
        var field    = fields[i].trim();
        if (!field || hostlocalize.geoipFields.indexOf(field) == -1) {
          next([400, 4019]);
          return;
        }
        if (job.outputFields.added.indexOf(field) == -1) {
          job.outputFields.added.push(field);
        }
      }
    } else {
      job.logger.verbose('Using geoip default fields (geoip-latitude, geoip-longitude)');
      job.outputFields.added.push('geoip-latitude');
      job.outputFields.added.push('geoip-longitude');
    }
  }
  next(null);
};