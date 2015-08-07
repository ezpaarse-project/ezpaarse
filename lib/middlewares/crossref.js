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

  if (!activated) {
    job.logger.verbose('Crossref enrichment not activated');
    return function (ec, next) { next(); };
  }

  job.logger.verbose('Crossref enrichment activated with a throttle of ' + throttle + 'ms');

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
  var busy          = false;
  var finalCallback = null;

  job.report.set('general', 'crossref-queries', 0);

  function resolve(callback) {
    if (buffer.length === 0) { return (finalCallback || callback)(); }

    var n = 0;
    for (var i = 0, l = buffer.length; i < l; i++) {
      if (buffer[i][0].doi) {
        if (++n >= 20) { break; }
      }
    };

    var ecs = buffer.splice(0, i + 1).filter(function (ec) {
      if (ec[0].doi) {
        return true;
      } else {
        ec[1]();
        return false;
      }
    });

    if (ecs.length === 0) {
      job.logger.silly('Crossref: no doi in the paquet');
      return setImmediate(function () { resolve(callback); });
    }

    var dois = ecs.map(function (ec) { return ec[0].doi; });

    job.report.inc('general', 'crossref-queries');
    job.logger.verbose('Crossref: resolving a paquet of %d ECs', ecs.length);

    metadoi.resolve(dois, {}, function (err, list) {
      if (err || !Array.isArray(list)) {
        if (err) { job.logger.error('Crossref: the query failed', err); }
        else     { job.logger.error('Crossref: got an invalid response'); }

        ecs.forEach(function (ec) { ec[1](); });
        return setTimeout(function() { resolve(callback); }, throttle);
      }

      ecs.forEach(function (ec) {
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

