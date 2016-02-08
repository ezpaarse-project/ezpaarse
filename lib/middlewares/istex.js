'use strict';

var request = require('request').defaults({
proxy: process.env.http_proxy ||
process.env.HTTP_PROXY ||
process.env.https_proxy ||
process.env.HTTPS_PROXY
});




/**
 * Enrich ECs with istex data
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */



module.exports = function (req, res, job, saturate, drain) {

 function enrich(ec, next) {
   

    // If an EC with the same ID is being processed, add this one to pending
    if (pending.has(ec.title_id)) {
      return pending.get(ec.title_id).push([ec, next]);
    }

    pending.set(ec.title_id, [[ec, next]]);

    cache.get(ec.title_id.toString(), function (err, cachedDoc) {
      if (err) { return next(); }

      if (cachedDoc) {
        return release(ec.title_id, cachedDoc || null);
      }

      buffer.push(ec);
      if (busy) { return; }

      busy = true;
      saturate();

      pullBuffer();
    });
  }


};
