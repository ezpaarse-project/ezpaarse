'use strict';

var cache  = require('../cache')('sudoc');
var sudoc = require('sudoc');


/**
 * Enrich ECs with HAL data
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function (req, res, job, saturate, drain) {
  var activated = (req.header('sudoc-enrich') || '').toLowerCase() === 'true';
  var throttle  = parseInt(req.header('sudoc-throttle')) || 500;
  var ttl       = parseInt(req.header('sudoc-ttl')) || 3600 * 24 * 7;

  if (!activated) {
    job.logger.verbose('Sudoc enrichment not activated');
    return function (ec, next) { next(); };
  }

  var pending  = new Map();
  var nbErrors = 0;
  var buffer   = [];
  var busy     = false;

  job.logger.verbose('Sudoc enrichment activated');
  job.logger.verbose('Sudoc throttle: %dms', throttle);

  job.report.set('general', 'sudoc-queries', 0);

  if (!cache) {
    var err = new Error('failed to connect to mongodb, cache not available for HAL');
    err.status = 500;
    return err;
  }

  /**
   * Pull the next EC to enrich with sudoc
   */
  function pullBuffer() {
    var ec = buffer.shift();
    if (!ec) {
      busy = false;
      return drain();
    }

    job.report.inc('general', 'sudoc-queries');

    sudoc.issn2ppn(ec.print_identifier , function (err, doc) {

      if (err) {
        if (++nbErrors > 5) { activated = false; }
        release(ec.print_identifier, null);
        return setTimeout(pullBuffer, throttle);
      }

      cache.set(ec.print_identifier.toString(), doc, function (err) {
        if (++nbErrors > 5) { activated = false; }

        release(ec.print_identifier, doc || null);
        setTimeout(pullBuffer, throttle);
      });
    });
  }

  /**
   * Release every ECs with a given print_identifier
   * @param  {String} print_identifier
   * @param  {Object} data     SUDOC data to enrich ECs, if any
   */
  function release(print_identifier, data) {
    pending.get(print_identifier).forEach(function(ec) {
      if (data.query.result.ppn) {
        ec[0]['ppn'] = data.query.result.ppn;
        job.logger.silly('Sudoc : find ', data.query);
      } else {
        job.logger.verbose('Sudoc : unknown result structure', data);
      }
      ec[1]();
    });
    pending.delete(print_identifier);
  }

  function enrich(ec, next) {
    if (!activated || !ec || !ec.print_identifier ) {
      return next();
    } else {
      job.logger.verbose('Sudoc : no identifier');
    }

    // If an EC with the same print_identifier is being processed, add this one to pending
    if (pending.has(ec.print_identifier)) {
      return pending.get(ec.print_identifier).push([ec, next]);
    }

    pending.set(ec.print_identifier, [[ec, next]]);

    cache.get(ec.print_identifier.toString(), function (err, cachedDoc) {
      if (err) { return next(); }

      if (cachedDoc) {
        return release(ec.print_identifier, cachedDoc || null);
      }

      buffer.push(ec);
      if (busy) { return; }

      busy = true;
      saturate();

      pullBuffer();
    });
  }

  return new Promise(function (resolve, reject) {
    if (!activated) { return resolve(enrich); }

    cache.checkIndexes(ttl, function (err) {
      if (err) {
        job.logger.error('SUDOC: failed to ensure indexes');
        return reject(new Error('failed to ensure indexes for the cache of SUDOC'));
      }

      resolve(enrich);
    });
  });
};

