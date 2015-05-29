'use strict';

var hostlocalize = require('./hostlocalize.js');
var mongo        = require('./mongo.js');

/**
 * Create an EC enhancer
 * @param {Object} job  an instance of job
 */
module.exports = function enhancer(job) {
  var notifier = job.notifiers['missing-title-ids'];
  var missing  = {};
  var pkbs     = mongo.db ? mongo.db.collection('pkbs') : null;

  return function enhance(ec, next) {

    if (job.noEnrich || !ec) { return next(); }

    // geolocalization from orignal ip address
    var geoloc = function () {
      hostlocalize.resolve(ec._meta.originalHost, job, function (geo) {
        for (var p in geo) {
          ec[p] = geo[p];
        }
        next();
      });
    };

    var finalize = function () {
      if (job.geolocalize !== 'none') {
        geoloc();
      } else {
        next();
      }
    };

    if (!ec.title_id || missing[ec.platform]) { return finalize(); }

    if (!pkbs) {
      job.report.inc('general', 'enhancement-errors');
      return finalize();
    }

    pkbs.findOne({
      'content.json.title_id': ec.title_id,
      '_platform': ec.platform,
      'state': { $ne: 'deleted' }
    }, {
      'content': 1
    }, function (err, entry) {
      if (err) {
        job.report.inc('general', 'enhancement-errors');
        return finalize();
      }

      notifier.incrementQueries(ec.platform);
      if (entry) {
        var info = entry.content.json;
        for (var prop in info) {
          if (info[prop]) { ec[prop] = info[prop]; }
        }
        return finalize();
      }

      notifier.incrementMisses(ec.platform, ec.title_id);
      job.logStreams.write('pkb-miss-ecs', ec._meta.originalLine + '\n');
      job.report.inc('rejets', 'nb-lines-pkb-miss-ecs');

      if (missing.hasOwnProperty(ec.platform)) { return finalize(); }

      missing[ec.platform] = 0;

      pkbs.findOne({ '_platform': ec.platform }, { _id: 1 }, function (err, entry) {
        if (err) { return finalize(); }
        missing[ec.platform] = entry ? 0 : 1;

        if (!entry) { notifier.noPkbFor(ec.platform); }

        finalize();
      });
    });
  };
};

