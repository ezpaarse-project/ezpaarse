'use strict';

var metadoi = require('meta-doi');

/**
 * Enrich ECs with crossref data
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function (req, res, job, saturate, drain) {
  var activated = (req.header('crossref-enrich') || '').toLowerCase() === 'true';
  var throttle  = parseInt(req.header('crossref-throttle')) || 200;

  if (activated) {
    job.logger.verbose('Crossref enrichment activated with a throttle of ' + throttle + 'ms');
  } else {
    job.logger.verbose('Crossref enrichment not activated');
  }

  if (!activated) { return function (ec, next) { next(); }; }

  var buffer        = [];
  var busy          = false;
  var finalCallback = null;

  job.report.set('general', 'crossref-queries', 0);

  function resolve(callback) {
    job.logger.verbose('Crossref: resolving');

    if (buffer.length === 0) { return (finalCallback || callback)(); }

    var ecs = buffer.splice(0, 20).filter(function (ec) {
      if (ec[0].doi) {
        return true;
      } else {
        ec[1]();
        return false;
      }
    });

    if (ecs.length === 0) {
      job.logger.silly('Crossref: no doi in the paquet');
      return resolve(callback);
    }

    var dois = ecs.map(function (ec) { return ec[0].doi; })

    job.report.inc('general', 'crossref-queries');
    job.logger.verbose('Crossref: resolving a paquet of %d ECs', ecs.length);

    metadoi.resolve(dois, {}, function (err, list) {
      if (err || !Array.isArray(list)) {
        ecs.forEach(function (ec) { ec[1](); });
        return setTimeout(function() { resolve(callback); }, throttle);
      }

      ecs.forEach(function (ec) {
        var item;

        for (var i = list.length - 1; i >= 0; i--) {
          if (typeof list[i]['doi-DOI'] !== 'string') { continue; }

          if (ec[0].doi.toLowerCase() == list[i]['doi-DOI'].toLowerCase()) {
            item = list[i];
            break;
          }
        };

        for (var p in item) { ec[0][p] = item[p]; }
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

    if (buffer.length > 1000 && !busy) {
      busy = true;
      saturate();
      resolve(function () {
        busy = false;
        drain();
      });
    }
  };
};

