'use strict';

var cache   = require('../cache')('crossref');
var metadoi = require('meta-doi');

var doiPattern = /^10\.[0-9]{4,}\/[a-z0-9\-\._;\(\)\/]+$/i;

/**
 * Enrich ECs with crossref data
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function (req, res, job, saturate, drain) {
  var activated = (req.header('crossref-enrich') || '').toLowerCase() !== 'false';
  var ttl       = parseInt(req.header('crossref-ttl')) || 3600 * 24 * 7;

  if (!activated) {
    job.logger.verbose('Crossref enrichment not activated');
    return function (ec, next) { next(); };
  }


  var doiFields = metadoi.APIgetInfo(null, true);

  for (let field in doiFields) {
    field = field.toString();

    if (job.outputFields.removed.indexOf(field) === -1) {
      if (job.outputFields.added.indexOf(field) === -1) {
        job.outputFields.added.push(field);
      }
    }
  }

  var buffer        = [];
  var throttle      = parseInt(req.header('crossref-throttle')) || 200;
  // Maximum number of DOIs to query in a single request
  var paquetSize    = parseInt(req.header('crossref-paquet-size')) || 50;
  // Minimum number of ECs to keep before resolving them
  var bufferSize    = parseInt(req.header('crossref-buffer-size')) || 1000;
  var busy          = false;
  var finalCallback = null;

  job.logger.verbose('Crossref enrichment activated');
  job.logger.verbose('Crossref throttle: %dms', throttle);
  job.logger.verbose('Crossref paquet size: %d', paquetSize);
  job.logger.verbose('Crossref buffer size: %d', bufferSize);

  job.report.set('general', 'crossref-queries', 0);
  job.report.set('general', 'crossref-fails', 0);
  job.report.set('general', 'crossref-invalid-dois', 0);

  /**
   * Iterate over the buffer, remove ECs with no DOI or cached DOI
   * return a packet of ecs with an uncached DOI
   */
  function getPacket(callback) {
    var packet = [];

    (function checkNextEC() {
      if (packet.length >= paquetSize) { return callback(null, packet); }

      var ec = buffer.shift();
      if (!ec) { return callback(null, packet); }

      if (!ec[0].doi) {
        ec[1]();
        return checkNextEC();
      }

      if (!doiPattern.test(ec[0].doi)) {
        job.resport.inc('general', 'crossref-invalid-dois');
        ec[1]();
        return checkNextEC();
      }

      cache.get(ec[0].doi.toLowerCase(), function (err, cachedDoc) {
        if (cachedDoc) {
          for (let p in cachedDoc) { ec[0][p] = cachedDoc[p]; }
          ec[1]();
        } else {
          packet.push(ec);
        }

        checkNextEC();
      });
    })();
  }

  function drainBuffer(callback) {
    if (buffer.length === 0) { return (finalCallback || callback)(); }
    if (buffer.length < bufferSize && !finalCallback) { return callback(); }

    getPacket(function (err, packet) {

      if (packet.length === 0) {
        job.logger.silly('Crossref: no doi in the paquet');
        return setImmediate(function () { drainBuffer(callback); });
      }

      var dois = packet.map(function (ec) { return ec[0].doi; });

      job.report.inc('general', 'crossref-queries');
      job.logger.verbose('Crossref: resolving a paquet of %d ECs', packet.length);

      metadoi.resolve(dois, {}, function (err, list) {
        if (err || !Array.isArray(list)) {
          if (err) { job.logger.error('Crossref: the query failed', err); }
          else     { job.logger.error('Crossref: got an invalid response'); }

          job.report.inc('general', 'crossref-fails');

          packet.forEach(function (ec) { ec[1](); });
          return setTimeout(function() { drainBuffer(callback); }, throttle);
        }

        var notFound = [];

        packet.forEach(function (ec) {
          var item;

          for (let i = list.length - 1; i >= 0; i--) {
            if (typeof list[i]['doi-DOI'] !== 'string') { continue; }

            if (ec[0].doi.toLowerCase() == list[i]['doi-DOI'].toLowerCase()) {
              item = list[i];
              break;
            }
          }

          if (item) {
            for (let p in item) { ec[0][p] = item[p]; }
          } else {
            notFound.push(ec[0].doi);
          }

          ec[1]();
        });

        function cacheNotFound() {
          var doi = notFound.pop();
          if (!doi) { return setTimeout(function() { drainBuffer(callback); }, throttle); }

          cache.set(doi.toLowerCase(), {}, function (err, result) {
            if (err) { job.report.inc('general', 'crossref-cache-fail'); }
            cacheNotFound();
          });
        }

        (function cacheResults() {
          var item = list.pop();
          if (!item) { return cacheNotFound(); }

          cache.set(item['doi-DOI'].toLowerCase(), item, function (err, result) {
            if (err) { job.report.inc('general', 'crossref-cache-fail'); }
            cacheResults();
          });
        })();
      });
    });
  }

  function process(ec, next) {
    if (!ec) {
      finalCallback = next;
      if (!busy) { drainBuffer(function () { next(); }); }
      return;
    }

    buffer.push([ec, next]);

    if (buffer.length > bufferSize && !busy) {
      busy = true;
      saturate();
      drainBuffer(function () {
        busy = false;
        drain();
      });
    }
  }

  return new Promise(function (resolve, reject) {
    cache.checkIndexes(ttl, function (err) {
      if (err) {
        job.logger.error('Crossref: failed to ensure indexes');
        return reject(new Error('failed to ensure indexes for the cache of Crossref'));
      }

      resolve(process);
    });
  });
};

