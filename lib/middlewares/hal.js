'use strict';

var mongo  = require('../mongo.js');
var methal = require('methal');

var fieldsMap = {
  docid:              'title_id',
  bookTitle_s:        'publication_title',
  journalTitle_s:     'publication_title',
  journalUrl_s:       'title_url',
  publisher_s:        'publisher_name',
  journalPublisher_s: 'publisher_name',
  journalEissn_s:     'online_identifier',
  journalIssn_s:      'print_identifier',
  isbn_s:             'online_identifier',
  doiId_s:            'doi'
};
var fields = Object.keys(fieldsMap);

/**
 * Enrich ECs with HAL data
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function (req, res, job, saturate, drain) {
  var activated = (req.header('hal-enrich') || '').toLowerCase() === 'true';
  var throttle  = parseInt(req.header('hal-throttle')) || 500;

  if (!activated) { return function (ec, next) { next(); }; }

  var cache    = mongo.db ? mongo.db.collection('hal') : null;
  var pending  = new Map();
  var nbErrors = 0;
  var buffer   = [];
  var busy     = false;

  if (!cache) {
    var err = new Error('failed to connect to mongodb, cache not available for HAL');
    err.status = 500;
    return err;
  }

  /**
   * Pull the next EC to enrich with methal
   */
  function pullBuffer() {
    var ec = buffer.shift();
    if (!ec) {
      busy = false;
      return drain();
    }

    methal.findOne({ docid: ec.title_id }, { fields: fields }, function (err, doc) {
      if (err) {
        if (++nbErrors > 5) { activated = false; }
        release(ec.title_id, null);
        return setTimeout(pullBuffer, throttle);
      }

      cache.update({
        id: ec.title_id.toString()
      }, {
        date: new Date(),
        id: ec.title_id.toString(),
        data: doc
      }, { upsert: 1 }, function (err) {
        if (++nbErrors > 5) { activated = false; }

        release(ec.title_id, doc || null);
        setTimeout(pullBuffer, throttle);
      });
    });
  }

  /**
   * Release every ECs with a given ID
   * @param  {String} title_id
   * @param  {Object} data     HAL data to enrich ECs, if any
   */
  function release(title_id, data) {
    pending.get(title_id).forEach(function(ec) {
      if (data) {
        for (let p in data) {
          if (fieldsMap.hasOwnProperty(p)) { ec[0][fieldsMap[p]] = data[p]; }
        }
      }
      ec[1]();
    });
    pending.delete(title_id);
  }

  function enrich(ec, next) {
    if (!activated || !ec || !ec.title_id || ec.platform !== 'hal') {
      return next();
    }

    // If an EC with the same ID is being processed, add this one to pending
    if (pending.has(ec.title_id)) {
      return pending.get(ec.title_id).push([ec, next]);
    }

    pending.set(ec.title_id, [[ec, next]]);

    cache.findOne({ 'id': ec.title_id.toString() }, { data: 1 }, function (err, cachedDoc) {
      if (err) { return next(); }

      if (cachedDoc && cachedDoc.hasOwnProperty('data')) {
        return release(ec.title_id, cachedDoc.data || null);
      }

      buffer.push(ec);
      if (busy) { return; }

      busy = true;
      saturate();

      pullBuffer();
    });
  }


  return new Promise(function (resolve, reject) {

    cache.ensureIndex({ id: 1 }, { unique: 1 }, function (err) {
      if (err) {
        var error = new Error('failed to create index for the cache of HAL');
        error.status = 500;
        return reject(error);
      }

      cache.ensureIndex({ date: 1 }, { expireAfterSeconds: 3600 * 24 * 7 }, function (err) {
        if (err) {
          var error = new Error('failed to set a TTL for the cache of HAL');
          error.status = 500;
          return reject(error);
        }

        resolve(enhance);
      });
    });
  });
};

