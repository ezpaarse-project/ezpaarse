'use strict';

/**
 * Middleware that throttle the EC stream
 * @param  {Object}   req       the request stream
 * @param  {Object}   res       the response stream
 * @param  {Object}   job       the job being initialized
 * @param  {Function} saturate  call when saturating
 * @param  {Function} drain     call when drained
 */
module.exports = function throttler(req, res, job, saturate, drain) {
  job.logger.verbose('Initializing throttler');

  var gap = parseInt(req.header('Throttling')) || 0;
  if (gap < 0) { gap = 0; }

  var buffer = [];
  var busy   = false;

  function process(done) {
    busy = true;

    setTimeout(function() {
      done();

      if (buffer.length > 0) {
        process(buffer.shift());
      } else {
        busy = false;
        drain();
      }
    }, gap);
  }

  return function throttle(ec, next) {
    if (gap === 0 || !ec) { return next(); }
    
    if (busy) {
      saturate();
      buffer.push(next);
    } else {
      process(next);
    }
  };
};
