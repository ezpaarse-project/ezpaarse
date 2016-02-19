'use strict';

var metaELS = require('meta-els');
var config  = require('../config.js');


/**
 * Enrich ECs with elsevier data
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function (req, res, job, saturate, drain) {
  var activated = (req.header('elsevier-enrich') || '').toLowerCase() === 'true';

  if (!activated) {
    job.logger.verbose('Elsevier enrichment not activated');
    return function (ec, next) { next(); };
  }


  var piiFields = metaELS.APIgetInfo(null, true);

  for (let field in piiFields) {
    field = field.toString();

    if (job.outputFields.removed.indexOf(field) === -1) {
      if (job.outputFields.added.indexOf(field) === -1) {
        job.outputFields.added.push(field);
      }
    }
  }

  var buffer        = [];
  var throttle      = parseInt(req.header('elsevier-throttle')) || 200;
  // Maximum number of PIIs to query in a single request
  var paquetSize    = parseInt(req.header('elsevier-paquet-size')) || 40;
  // Minimum number of ECs to keep before resolving them
  var bufferSize    = parseInt(req.header('elsevier-buffer-size')) || 1000;
  var busy          = false;
  var finalCallback = null;

  job.logger.verbose('Elsevier enrichment activated');
  job.logger.verbose('Elsevier throttle: %dms', throttle);
  job.logger.verbose('Elsevier paquet size: %d', paquetSize);
  job.logger.verbose('Elsevier buffer size: %d', bufferSize);
  var EZapiKey = config.EZPAARSE_ELS_APIKEY;
  job.logger.verbose('Elsevier: using apiKey ', EZapiKey);

  job.report.set('general', 'elsevier-queries', 0);

  function resolve(callback) {
    if (buffer.length === 0) { return (finalCallback || callback)(); }
    if (buffer.length < bufferSize && !finalCallback) { return callback(); }

    // Look for the index of the 50th EC that have a DOI
    var n = 0;
    for (var i = 0, l = buffer.length; i < l; i++) {
      if (buffer[i][0].pii && ++n >= paquetSize) { break; }
    }

    // Cut a part of the buffer that has 50 PIIs or less
    var ecs = buffer.splice(0, i + 1).filter(function (ec) {
      if (ec[0].pii) { return true; }

      ec[1]();
      return false;
    });

    if (ecs.length === 0) {
      job.logger.silly('Elsevier: no pii in the paquet');
      return setImmediate(function () { resolve(callback); });
    }

    var piis = ecs.map(function (ec) { return ec[0].pii; });

    job.report.inc('general', 'elsevier-queries');
    job.logger.verbose('Elsevier: resolving a paquet of %d ECs', ecs.length);

    metaELS.resolve({'apiKey': EZapiKey, 'piis': piis}, function (err, list) {
      if (err || !Array.isArray(list)) {
        if (err) {
          job.logger.error('Elsevier: the query failed', err);
          job.logger.error('Query URL', err.url);
        } else { job.logger.error('Elsevier: got an invalid response'); }

        ecs.forEach(function (ec) { ec[1](); });
        return setTimeout(function() { resolve(callback); }, throttle);
      }

      ecs.forEach(function (ec) {
        var item;

        for (let i = list.length - 1; i >= 0; i--) {
          if (typeof list[i]['els-pii'] !== 'string') { continue; }

          if (ec[0].pii.toLowerCase() == list[i]['els-pii'].toLowerCase()) {
            item = list[i];
            break;
          }
        }

        if (item) {
          for (let p in item) { ec[0][p] = item[p]; }
          // override EC doi for the other middleware who will need it
          ec[0].doi = item['els-doi'];
        }
        ec[1]();
      });

      setTimeout(function() { resolve(callback); }, throttle);
    });
  }

  return function process(ec, next) {
    if (!ec) {
      finalCallback = next;
      if (!busy) { resolve(function () { next(); }); }
      return;
    }

    buffer.push([ec, next]);

    if (buffer.length > bufferSize && !busy) {
      busy = true;
      saturate();
      resolve(function () {
        busy = false;
        drain();
      });
    }
  };
};

