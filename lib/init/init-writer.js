'use strict';

var InitError = require('../initerror.js');
var ezJobs    = require('../jobs.js');
var Writer    = require('../outputformats/writer.js');
var iconv     = require('iconv-lite');
var path      = require('path');
var fs        = require('fs');

/**
 * Creates a writer depending on the required data format (json, csv..)
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Function} callback returns the writer
 */
module.exports = function (req, res, callback) {
  var job = ezJobs[req._jobID];
  job.logger.verbose('Initializing EC writer');

  function getWriterOutputStream(resType, ext) {
    var stream;
    if (job.resIsDeferred) {
      job.logger.info("Deferred response requested: ECs will be writen in a temp file");

      // create a file writer stream to store ECs into
      job.ecsPath      = job.jobPath + '/job-ecs.' + ext;
      job.contentType  = resType;
      job.ecsStreamEnd = false;

      var jobPath = job.jobPath;
      var reg     = /^job-ecs\.([a-z]+)$/;
      var files   = fs.readdirSync(jobPath);

      files.forEach(function (file) {
        if (reg.test(file)) {
          fs.unlink(path.join(jobPath, file));
        }
      });

      job.ecsStream = fs.createWriteStream(job.ecsPath);
      stream        = job.ecsStream;
      stream.on('end', function () {
        job.logger.info("Temp file for deferred download completely written");
      });
      stream.write('');
    } else {
      stream = res;
    }

    // Overwrite the stream write method to convert data before writing it
    var _write = stream.write;
    stream.write  = function (data) {
      return _write.call(this, iconv.encode(data, job.outputCharset || 'utf-8'));
    };
    return stream;
  }

  function setDeniedWriter(type, ext) {
    job.deniedStream = fs.createWriteStream(path.join(job.jobPath, '/denied.' + (ext || type)));
    job.deniedWriter = new Writer(job.deniedStream, type);

    var _write = job.deniedStream.write;
    job.deniedStream.write  = function (data) {
      return _write.call(this, iconv.encode(data, job.outputCharset || 'utf-8'));
    };
  }

  // configure the correct Writer depending on the "Accept" HTTP header
  // example : "Accept: text/csv"
  if (job.cleanOnly) {
    job.logger.info("Clean-Only job");
    job.headers['Content-Type'] = 'text/x-log';
    job.writer = new Writer(getWriterOutputStream('text/x-log', 'log'), 'log');

    setDeniedWriter('log');
    callback(null);
  } else {
    var accept = req.header('Accept') || 'text/csv';
    switch (accept) {
    case '*/*':
    case 'text/csv':
      job.logger.info("CSV requested for response");
      job.headers['Content-Type'] = 'text/csv';
      job.writer = new Writer(getWriterOutputStream('text/csv', 'csv'), 'csv');

      setDeniedWriter('csv');
      callback(null);
      break;
    case 'text/tab-separated-values':
      job.logger.info("TSV requested for response");
      job.headers['Content-Type'] = 'text/tab-separated-values';
      job.writer = new Writer(getWriterOutputStream('text/tab-separated-values', 'txt'), 'tsv');

      setDeniedWriter('tsv', 'txt');
      callback(null);
      break;
    case 'application/json':
      job.logger.info("JSON requested for response");
      job.headers['Content-Type'] = 'application/json';
      job.writer = new Writer(getWriterOutputStream('application/json', 'json'), 'json');

      setDeniedWriter('json');
      callback(null);
      break;
    default:
      job.logger.warn("Requested content-type '"
                  + req.header('accept')
                  + "' not acceptable for response");
      callback(new InitError(406, 4006));
    }
  }
};