/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var Writer    = require('./outputformats/writer.js');
var LogParser = require('./logparser.js');
var zlib      = require('zlib');
var fs        = require('fs');
var winston   = require('winston');

var InitError = function (status, ezStatus) {
  this.status = status;
  this.ezStatus = ezStatus;
}

/**
 * Sets the variables used for anonymization
 * @param  {Object}   req      the request stream
 * @param  {Function} callback returns an array of fields to be anonymized
 */
function initAnonymization(app, req, res, logger, callback) {
  logger.verbose('Initializing anonymization');
  var anonymizeLogin  = req.header('Anonymize-login');
  var anonymizeHost   = req.header('Anonymize-host');
  var hashes          = ['md5', 'sha1'];
  var anonymize       = {};

  if (anonymizeHost) {
    if (hashes.indexOf(anonymizeHost) != -1) {
      anonymize.host = anonymizeHost;
    } else {
      callback(new InitError(400, 4004));
      return;
    }
  }

  if (anonymizeLogin) {
    if (hashes.indexOf(anonymizeLogin) != -1) {
      anonymize.login = anonymizeLogin;
    } else {
      callback(new InitError(400, 4004));
      return;
    }
  }

  callback(null, anonymize);
}

/**
 * Sets the array containing the fields to use when writing ECs
 * @param  {Object}   req      the request stream
 * @param  {Function} callback returns an array of fields to be written and their usage
 *                             (add to the default fields or replace them)
 */
function initOutputFields(app, req, res, logger, callback) {
  logger.verbose('Initializing output fields');
  var fields       = req.header('Output-Fields');
  var outputFields = false;
  var fieldsUsage  = false;
  if (fields) {
    logger.verbose('Fields header: ' + fields);
    var first = fields.charAt(0);
    if (first === '+') {
      fields      = fields.substring(1);
      fieldsUsage = 'add';
      logger.verbose('Fields added to the default ones');
    } else {
      fieldsUsage = 'replace';
      logger.verbose('Fields used instead of the default ones');
    }
    outputFields = [];
    fields.split(',').forEach(function (field) {
      outputFields.push(field.trim());
    });
    logger.verbose('Fields array: ', outputFields);
  } else {
    logger.verbose('Using default fields');
  }

  callback(null, outputFields, fieldsUsage);
}

/**
 * Creates the log parser depending on the given log format
 * @param  {Object}   req      the request stream
 * @param  {Function} callback returns the log parser
 */
function initLogParser(app, req, res, logger, callback) {
  logger.verbose('Initializing log parser');
  var dateFormat = req.header('Date-Format');
  var logFormat  = '';
  var logProxy   = '';

  var proxies = ['ezproxy', 'bibliopam', 'squid'];
  for (var i = 0, l = proxies.length; i < l; i++) {
    var proxy = proxies[i];
    logFormat = req.header('Log-Format-' + proxy);
    if (logFormat) {
      logProxy = proxy;
      break;
    }
  }
  callback(null, new LogParser(logger, logFormat, logProxy, dateFormat));
}

/**
 * Creates a writer depending on the required data format (json, csv..)
 * @param  {Object}   res      the response stream
 * @param  {Function} callback returns the writer
 */
function initWriter(app, req, res, logger, callback) {
  logger.verbose('Initializing EC writer');
  var writer = false;

  function getWriterOutputStream(resType) {
    if (req.query.redirect) {
      logger.info("Redirect requested: ECs will be writen in a temp file");

      // create a file writer stream to store ECs into
      app.ezJobs[req.ezRID].ecsPath     = app.ezJobs[req.ezRID].tmpPath + '/job-ecs';
      app.ezJobs[req.ezRID].ecsStream   = fs.createWriteStream(app.ezJobs[req.ezRID].ecsPath);

      // register the output type of the request
      app.ezJobs[req.ezRID].contentType = resType;

      return app.ezJobs[req.ezRID].ecsStream;
    } else {
      return res;
    }
  }

  res.format({
    'text/csv': function () {
      logger.info("CSV requested for response");
      res.type('text/csv');
      writer = new Writer(getWriterOutputStream(res.get('Content-Type')), 'csv');
    },
    'application/json': function () {
      logger.info("JSON requested for response");
      res.type('application/json');
      writer = new Writer(getWriterOutputStream(res.get('Content-Type')), 'json');
    },
    'default': function () {
      logger.warn("Requested content-type not acceptable for response");
      callback(new InitError(406, 4006));
      return;
    }
  });

  if (!writer) {
    logger.error("Writer not found");
    callback(new InitError(500, 5001));
    return;
  }
  callback(null, writer);
}

/**
 * Decodes request and encodes response if needed
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Function} callback returns the encoded/decoded streams
 */
function initEncoding(app, req, res, logger, callback) {
  logger.verbose('Initializing encoding');
  var contentEncoding = req.header('content-encoding');
  var acceptEncoding  = req.header('accept-encoding');
  var unzip;
  var zip;

  if (contentEncoding) {
    if (contentEncoding == 'gzip' || contentEncoding == 'deflate') {
      unzip = zlib.createUnzip();
      req.pipe(unzip);
    } else {
      logger.warn('Content encoding not supported');
      callback(new InitError(406, 4005));
      return;
    }
  }

  if (acceptEncoding) {
    var encodings = acceptEncoding.split(',');
    for (var j = 0, lth = encodings.length; j < lth; j++) {
      var encoding = encodings[j].trim();
      if (encoding == 'gzip') {
        logger.info("Gzip requested");
        res.set('Content-Encoding', 'gzip');
        zip = zlib.createGzip();
        zip.pipe(res);
        break;
      } else if (encoding == 'deflate') {
        logger.info("Deflate requested");
        res.set('Content-Encoding', 'deflate');
        zip = zlib.createDeflate();
        zip.pipe(res);
        break;
      }
    }
    if (!zip) {
      logger.warn("Requested encoding(s) not supported");
      callback(new InitError(406, 4005));
      return;
    }
  }

  callback(null, unzip, zip);
}

exports.init = function (app, req, res, logger, callback) {
  logger.info('Initializing request');
  var init = {};
  initAnonymization(app, req, res, logger, function (err, anonymize) {
    if (err) { callback(err); return; }
    init.anonymize = anonymize;
    
    initOutputFields(app, req, res, logger, function (err, outputFields, fieldsUsage) {
      if (err) { callback(err); return; }
      init.outputFields = outputFields;
      init.fieldsUsage  = fieldsUsage;

      initLogParser(app, req, res, logger, function (err, logParser) {
        if (err) { callback(err); return; }
        init.logParser = logParser;

        initEncoding(app, req, res, logger, function (err, unzipReq, zipRes) {
          if (err) { callback(err); return; }
          init.unzipReq = unzipReq;
          init.zipRes   = zipRes;

          initWriter(app, req, res, logger, function (err, writer) {
            if (err) { callback(err); return; }
            init.writer = writer;

            callback(null, init);
          });
        });
      });
    });
  });
}