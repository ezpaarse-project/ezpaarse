'use strict';

var istex = require('node-istex');
// loading correspondence file  ezpaarse rtype with  istex rtype
var data  = require('./istex-rtype.json');
var cache = require('../cache')('istex');

/**
 * Enrich ECs with istex data
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} saturate  call when saturating in order to pause the request
 * @param  {Function} drain     call when drained in order to resume the request
 */

module.exports = function (req, res, job, saturate, drain) {
  var ttl      = parseInt(req.header('istex-ttl')) || 3600 * 24 * 7;
  var throttle = parseInt(req.header('istex-throttle')) || 100;
  var activated = (req.header('istex-enrich') || '').toLowerCase() === 'true';
  var busy     = false;
  var buffer   = [];
  if (!activated) { return function (ec, next) { next(); }; }

  if (!cache) {
    var err = new Error('failed to connect to mongodb, cache not available for istex');
    err.status = 500;
    return err;
  }

  job.report.set('general', 'istex-queries', 0);
  job.report.set('general', 'istex-fails', 0);

  // enrich ec with api istex and to cache the data in database
  function pullBuffer() {
    var ec = buffer.shift();
    if (!ec) {
      busy = false;
      return drain();
    }

    job.report.inc('general', 'istex-queries');
    // interrogate the api istex for recovered metadata with unitid
    istex.find(ec[0].unitid, function (err, result) {
      if (err) {
        job.report.inc('general', 'istex-fails');
        enrichEc(null, ec[0], ec[1]);
        return setTimeout(pullBuffer, throttle);
      }

      var metaistex = {
        rtype: 'MISC'
      };

      if (result.corpusName) {
        metaistex['publisher_name'] = result.corpusName;

        if (['EEBO', 'ECCO'].indexOf(metaistex['publisher_name'].toUpperCase()) >= 0) {
          result.mime = 'TIFF';
        }
      }

      if (result.host) {
        if (result.host.isbn) {
          metaistex['print_identifier'] = result.host.isbn[0];
        }
        if (result.host.issn) {
          metaistex['print_identifier'] = result.host.issn[0];
        }
        if (result.host.eisbn) {
          metaistex['online_identifier'] = result.host.eisbn[0];
        }
        if (result.doi) {
          metaistex.doi = result.doi[0];
        }
        if (result.host.title) {
          metaistex['publication_title'] = result.host.title;
        }
      }

      if (result.publicationDate) {
        metaistex['publication_date'] = result.publicationDate;
      } else {
        metaistex['publication_date'] = result.copyrightDate;
      }

      if (result.genre && result.genre[0]) {
        if (data[result.genre[0]] && data[result.genre[0]] !== null) {
          metaistex.rtype = data[result.genre[0]];
        }
        metaistex['istex_genre'] = result.genre[0];
      }

      if (result.language && result.language[0]) {
        metaistex.language = result.language[0];
      }

      // set data istex in the cache
      cache.set(ec[0].unitid, metaistex, function (err) {
        if (err) { job.report.inc('general', 'istex-cache-fail'); }
        enrichEc(metaistex || null, ec[0], ec[1]);
        return setTimeout(pullBuffer, throttle);
      });

    });

  }
  /**
 * enrich ec with cache or api istex
 * @param  {object} ec the EC to process, null if no EC left
 * @param  {Function} next the function to call when we are done with the given EC
 */
  function enrich(ec, next) {

    if (!ec || ec.platform !== 'istex' || !ec.unitid) {
      return next();
    }
    if (ec['user-agent'] && ec['user-agent'] === 'ezpaarse') {
      return next(new Error('ec ezpaarse'));
    }
    // read the data cache in database with unitid key
    cache.get(ec.unitid.toString(), function (err, cachedDoc) {
      if (err) { return next(); }

      if (cachedDoc) {
        return enrichEc(cachedDoc, ec, next);
      }
      buffer.push([ec, next]);
      if (busy) { return; }

      busy = true;
      saturate();
      pullBuffer();
    });
  }
 /**
 * enriche ec with data istex
 * @param  {object} data the data of istex
 * @param  {object} ec the EC to process, null if no EC left
 * @param  {Function} next the function to call when we are done with the given EC
 */
  function enrichEc(data, ec, next) {
    if (data) {
      for (let p in data) {
        ec[p] = data[p];
      }
    }
    return next();
  }


  return new Promise(function (resolve, reject) {

    cache.checkIndexes(ttl, function (err) {
      if (err) {
        job.logger.error('istex: failed to ensure indexes' + err);
        return reject(new Error('failed to ensure indexes for the cache of istex'));
      }

      resolve(enrich);
    });
  });

};
