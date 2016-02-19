'use strict';

var hostlocalize = require('../hostlocalize.js');
var config       = require('../../config.json');
/**
 * Geolocalize ECs
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function localizer(req, res, job) {
  job.logger.verbose('Initializing geolocation');

  job.outputFields = job.outputFields || { added: [], removed: [] };

  var geolocalize = config.EZPAARSE_GEOLOCALIZE_DEFAULT;
  var geoFields   = (req.header('Geoip') || '').toLowerCase();

  job.logger.verbose('Geolocalization fields : ', geoFields);
  job.report.set('general', 'geolocalization', geoFields);

  if (geoFields === 'none') {
    geolocalize = false;

  } else if (geoFields === 'all') {
    hostlocalize.geoipFields.forEach(function (field) {
      if (job.outputFields.added.indexOf(field) === -1) { job.outputFields.added.push(field); }
    });

  } else if (geoFields) {
    job.logger.verbose('Fields header: ' + geoFields);

    var fields = geoFields.split(',');
    for (var i = 0, l = fields.length; i < l; i++) {
      var field = fields[i].trim();

      // control requested fields
      if (!field || hostlocalize.geoipFields.indexOf(field) === -1) {
        var err    = new Error();
        err.code   = 4019;
        err.status = 400;
        return err;
      }
      if (job.outputFields.added.indexOf(field) === -1) {
        job.outputFields.added.push(field);
      }
    }
  } else {
    job.logger.verbose('Using geoip default fields (' +
      hostlocalize.geoipDefaultFields.join(', ') + ')');

    hostlocalize.geoipDefaultFields.forEach(function (field) {
      if (job.outputFields.added.indexOf(field) === -1) { job.outputFields.added.push(field); }
    });
  }

  return function localize(ec, next) {
    if (!geolocalize || !ec) { return next(); }

    hostlocalize.resolve(ec.host, job, function (geo) {
      for (var p in geo) {
        ec[p] = geo[p];
      }
      next();
    });
  };
};

