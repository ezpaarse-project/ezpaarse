/* eslint no-sync: 0 */
'use strict';

var getWriter = require('../outputformats/writer.js');
var iconv     = require('iconv-lite');
var moment    = require('moment');
var path      = require('path');
var fs        = require('graceful-fs');
var zlib      = require('zlib');

/**
 * Creates a writer depending on the required data format (json, csv..)
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 * @param  {Function} next  continue to next middleware
 */
module.exports = function (req, res, job, next) {
  job.logger.verbose('Initializing EC writer');

  var acceptEncoding = req.header('response-encoding');
  var zip;
  var zipExt;

  function getZipStream() {
    switch (zip) {
    case 'gzip':
      return zlib.createGzip();
    case 'deflate':
      return zlib.createDeflate();
    default:
      return null;
    }
  }

  if (acceptEncoding) {
    var encodings = acceptEncoding.split(',').map(function (s) { return s.toLowerCase(); });

    if (encodings.indexOf('gzip') >= 0) {
      job.logger.info('Gzip requested');
      job.headers['Content-Encoding'] = 'gzip';
      zip    = 'gzip';
      zipExt = '.gz';

    } else if (encodings.indexOf('deflate') >= 0) {
      job.logger.info('Deflate requested');
      job.headers['Content-Encoding'] = 'deflate';
      zip    = 'deflate';
      zipExt = '.zz';

    } else {
      job.logger.warn('Requested encoding(s) not supported', encodings);
      return next(job.error(4005, 406));
    }
  }

  function getWriterOutputStream(resType, ext) {
    var stream;

    if (zipExt) { ext += zipExt; }

    job.contentType   = resType;
    job.fileExtension = ext;

    var zipStream = getZipStream();

    if (!job.resIsDeferred) {
      stream = iconv.encodeStream(job.outputCharset || 'utf-8');
      if (zipStream) { stream = stream.pipe(zipStream); }
      stream.pipe(res);
      return stream;
    }

    job.logger.info('Deferred response requested: ECs will be writen in a temp file');

    var date = moment().format('YYYY-MM-DD_HH[h]mm');

    // create a file writer stream to store ECs into
    job.ecsPath       = path.join(job.jobPath, date + '.job-ecs.' + ext);
    job.ecsStreamEnd  = false;

    var jobPath = job.jobPath;
    var reg     = /.*\.job-ecs(\.[a-z]+){1,2}$/;
    var files   = fs.readdirSync(jobPath);

    files.forEach(function (file) {
      if (reg.test(file)) {
        fs.unlink(path.join(jobPath, file));
      }
    });

    stream = iconv.encodeStream(job.outputCharset || 'utf-8');
    if (zipStream) { stream = stream.pipe(zipStream); }
    job.ecsStream = stream;

    stream.pipe(fs.createWriteStream(job.ecsPath)).on('end', function () {
      job.logger.info('Temp file for deferred download completely written');
    });

    return stream;
  }

  function setDeniedWriter(type, ext) {
    ext = ext || type;
    if (zipExt) { ext += zipExt; }

    var deniedPath   = path.join(job.jobPath, '/denied-ecs.' + ext);
    var zipStream    = getZipStream();
    job.deniedStream = iconv.encodeStream(job.outputCharset || 'utf-8');

    if (zipStream) { job.deniedStream = job.deniedStream.pipe(zipStream); }

    job.deniedWriter = getWriter(job.deniedStream, type);
    job.deniedStream.pipe(fs.createWriteStream(deniedPath));
  }

  // configure the correct Writer depending on the "Accept" HTTP header
  // example : "Accept: text/csv"
  if (job.cleanOnly) {
    job.logger.info('Clean-Only job');
    job.headers['Content-Type'] = 'text/x-log';
    job.writer = getWriter(getWriterOutputStream('text/x-log', 'log'), 'log');

    setDeniedWriter('log');
    return next(null);
  }

  var accept = req.header('Accept') || 'text/csv';

  switch (accept) {
  case '*/*':
  case 'text/csv':
    job.logger.info('CSV requested for response');
    job.headers['Content-Type'] = 'text/csv';
    job.writer = getWriter(getWriterOutputStream('text/csv', 'csv'), 'csv');

    setDeniedWriter('csv');
    return next(null);
  case 'text/tab-separated-values':
    job.logger.info('TSV requested for response');
    job.headers['Content-Type'] = 'text/tab-separated-values';
    job.writer = getWriter(getWriterOutputStream('text/tab-separated-values', 'txt'), 'tsv');

    setDeniedWriter('tsv', 'txt');
    return next(null);
  case 'application/json':
    job.logger.info('JSON requested for response');
    job.headers['Content-Type'] = 'application/json';
    job.writer = getWriter(getWriterOutputStream('application/json', 'json'), 'json');

    setDeniedWriter('json');
    return next(null);
  case 'application/jsonstream':
    job.logger.info('JSONStream requested for response (one line of JSON per line)');
    job.headers['Content-Type'] = 'application/json';
    job.writer = getWriter(getWriterOutputStream('application/json', 'json'), 'jsonstream');

    setDeniedWriter('json');
    return next(null);
  default:
    job.logger.warn('Requested content-type \''
                + req.header('accept')
                + '\' not acceptable for response');
    return next(job.error(4006, 406));
  }
};
