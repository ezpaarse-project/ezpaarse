'use strict';

var InitError = require('../initerror.js');
var ezJobs    = require('../jobs.js');
var Writer    = require('../outputformats/writer.js');
var path      = require('path');
var fs        = require('fs');

/**
 * Creates a writer depending on the required data format (json, csv..)
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
 * @param  {Function} callback returns the writer
 */
module.exports = function (req, res, logger, callback) {
  logger.verbose('Initializing EC writer');
  var job    = ezJobs[req.ezRID];
  var writer = false;

  function getWriterOutputStream(resType, ext) {
    if (ezJobs[req.ezRID].resIsDeferred) {
      logger.info("Deferred response requested: ECs will be writen in a temp file");

      // create a file writer stream to store ECs into
      ezJobs[req.ezRID].ecsPath      = ezJobs[req.ezRID].jobPath + '/job-ecs.' + ext;
      ezJobs[req.ezRID].contentType  = resType;
      ezJobs[req.ezRID].byteWriten   = 0;
      ezJobs[req.ezRID].ecsStreamEnd = false;

      var jobPath = ezJobs[req.ezRID].jobPath;
      var reg     = /^job-ecs\.([a-z]+)$/;
      var files = fs.readdirSync(jobPath);

      files.forEach(function (file) {
        if (reg.test(file)) {
          fs.unlink(path.join(jobPath, file));
        }
      });
      // output stream wrapper (needed to count number of bytes writen)
      ezJobs[req.ezRID].ecsStream = {
        write: function (data) {
          process.nextTick(function () {
            fs.appendFileSync(ezJobs[req.ezRID].ecsPath, data);
            ezJobs[req.ezRID].byteWriten += Buffer.byteLength(data, 'utf8');
          });
        },
        end: function () {
          logger.info("Temp file for deferred download completly writen");
          ezJobs[req.ezRID].ecsStreamEnd = true;
        }
      };
      // create an empty result file
      ezJobs[req.ezRID].ecsStream.write('');
      return ezJobs[req.ezRID].ecsStream;
    } else {
      return res;
    }
  }

  // configure the correct Writer depending on the "Accept" HTTP header
  // example : "Accept: text/csv"
  var accept = req.header('Accept') || 'text/csv';
  switch (accept) {
  case '*/*':
  case 'text/csv':
    logger.info("CSV requested for response");
    job.headers['Content-Type'] = 'text/csv';
    job.writer = new Writer(getWriterOutputStream('text/csv', 'csv'), 'csv');
    callback(null);
    break;
  case 'application/json':
    logger.info("JSON requested for response");
    job.headers['Content-Type'] = 'application/json';
    job.writer = new Writer(getWriterOutputStream('application/json', 'json'), 'json');
    callback(null);
    break;
  default:
    logger.warn("Requested content-type '"
                + req.header('accept')
                + "' not acceptable for response");
    callback(new InitError(406, 4006));
  }
}