'use strict';

var mongo = require('../mongo.js');

/**
 * Create an EC enhancer
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function enhancer(req, res, job) {
  var notifier = job.notifiers['missing-title-ids'];
  var noEnrich = (req.header('ezpaarse-enrich') || '').toLowerCase() == 'false';
  var pkbs     = mongo.db ? mongo.db.collection('pkbs') : null;
  
  // 0 => PKB available, or currently checking that it's available
  // 1 => PKB not available
  var missingPKBs = new Map();


  return function enhance(ec, next) {

    if (noEnrich || !ec) { return next(); }

    if (!ec.title_id || missingPKBs.get(ec.platform)) { return next(); }

    if (!pkbs) {
      job.report.inc('general', 'enhancement-errors');
      return next();
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
        return next();
      }

      notifier.incrementQueries(ec.platform);
      if (entry) {
        var info = entry.content.json;
        for (var prop in info) {
          if (info[prop]) { ec[prop] = info[prop]; }
        }
        return next();
      }

      notifier.incrementMisses(ec.platform, ec.title_id);
      ec._meta.enhancementFailed = true;

      if (missingPKBs.has(ec.platform)) { return next(); }

      missingPKBs.set(ec.platform, 0);

      pkbs.findOne({ '_platform': ec.platform }, { _id: 1 }, function (err, entry) {
        if (err) { return next(); }
        missingPKBs.get(ec.platform, entry ? 0 : 1);

        if (!entry) { notifier.noPkbFor(ec.platform); }

        next();
      });
    });
  };
};

