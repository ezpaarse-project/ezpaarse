'use strict';

var istex = require('node-istex');
var data = require('./istex-rtype.json');
var cacheistex = require('../cache')('istex');

/**
 * Enrich ECs with istex data
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */

module.exports = function (req, res, job, saturate, drain) {
  var ttl =  3600 * 24 * 7;
  var busy = false;
  var buffer = [];
  if (!cacheistex) {
    var err = new Error('failed to connect to mongodb, cache not available for istex');
    err.status = 500;
    return err;
  }


  function  pullBuffer() {
    var ec = buffer.shift();
    if (!ec) {
      busy = false;
      return drain();
    }
    istex.find(ec[0].unitid, function(err, result) {
      if (err) {
        enrichEc(null, ec[0], ec[1]);
        return pullBuffer();
      }
      var metaistex = {};
      // construct array data with a property ezpaarse
      metaistex.publisher_name = result.corpusName;
      if (result.host) {
        if (result.host.isbn) {
          metaistex.print_identifier = result.host.isbn[0];
        }
        if (result.host.issn) {
          metaistex.print_identifier = result.host.issn[0];
        }
        if (result.host.eisbn) {
          metaistex.online_identifier = result.host.eisbn[0];
        }
        if (result.doi) {
          metaistex.doi = result.doi[0];
        }
        if (result.host.title) { metaistex.publication_title = result.host.title; }
      }
      if (result.publicationDate) {
        metaistex.publication_date = result.publicationDate;
      } else {
        metaistex.publication_date = result.copyrightDate;
      }
      metaistex.rtype = 'MISC';
      if (result.genre[0] && result.genre[0] != null) {
        if (data[result.genre[0]] && data[result.genre[0]] != null) {
          metaistex.rtype = data[result.genre[0]];
        }
      }
      if (result.language[0]) { metaistex.language = result.language[0]; }
      if (result.genre[0]) { metaistex.istex_genre = result.genre[0]; }
      cacheistex.set(ec[0].unitid, metaistex, function(err) {
        enrichEc(metaistex || null, ec[0], ec[1]);
        pullBuffer();
      });

    });

  }

  function enrich(ec, next) {
    if (!ec || ec.platform != 'istex' || !ec.unitid) {
      return next();
    }
    cacheistex.get(ec.unitid.toString(), function (err, cachedDoc) {
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


  function enrichEc(data, ec, next) {
    if (data) {
      for (let p in data) {
        ec[p] = data[p];
      }
    }
    return next();
  }


  return new Promise(function (resolve, reject) {

    cacheistex.checkIndexes(ttl, function (err) {
      if (err) {
        job.logger.error('istex: failed to ensure indexes' + err);
        return reject(new Error('failed to ensure indexes for the cache of istex'));
      }

      resolve(enrich);
    });
  });

};