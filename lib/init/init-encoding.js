'use strict';

var zlib = require('zlib');

/**
 * Decodes request and encodes response if needed
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger.verbose('Initializing encoding');
//  var isMultipart     = new RegExp("^multipart\/", "i").test(req.header('content-type'));
//  var contentEncoding = req.header('content-encoding');
  var acceptEncoding = req.header('accept-encoding');
  var unzip;
  var zip;

//   if (!isMultipart && contentEncoding) {
//     if (contentEncoding == 'gzip' || contentEncoding == 'deflate') {
//       unzip = zlib.createUnzip();
//       req.pipe(unzip);
//     } else {
//       job.logger.warn('Content encoding not supported');
//       next([406, 4005]);
//       return;
//     }
//   }

  if (acceptEncoding) {
    var encodings = acceptEncoding.split(',');
    for (var j = 0, lth = encodings.length; j < lth; j++) {
      var encoding = encodings[j].trim();
      if (encoding == 'gzip') {
        job.logger.info("Gzip requested");
        job.headers['Content-Encoding'] = 'gzip';
        zip = zlib.createGzip();
        zip.pipe(res);
        break;
      } else if (encoding == 'deflate') {
        job.logger.info("Deflate requested");
        job.headers['Content-Encoding'] = 'deflate';
        zip = zlib.createDeflate();
        zip.pipe(res);
        break;
      }
    }
    if (!zip) {
      job.logger.warn("Requested encoding(s) not supported");
      next([406, 4005]);
      return;
    }
  }

  job.unzipReq = unzip;
  job.zipRes   = zip;

  next(null, unzip, zip);
};