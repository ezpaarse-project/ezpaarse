/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var Writer    = require('./outputformats/writer.js');
var LogParser = require('./logparser.js');
var zlib      = require('zlib');
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
function initAnonymization(logger, req, callback) {
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
 * Creates the log parser depending on the given log format
 * @param  {Object}   req      the request stream
 * @param  {Function} callback returns the log parser
 */
function initLogParser(logger, req, callback) {
  logger.verbose('Initializing log parser');
  var dateFormat = req.header('DateFormat');
  var logFormat  = '';
  var logProxy   = '';

  var proxies = ['ezproxy', 'bibliopam', 'squid'];
  for (var i = 0, l = proxies.length; i < l; i++) {
    var proxy = proxies[i];
    logFormat = req.header('LogFormat-' + proxy);
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
function initWriter(logger, res, callback) {
  logger.verbose('Initializing EC writer');
  var writer = false;
  res.format({
    'text/csv': function () {
      logger.info("CSV requested");
      res.type('text/csv');
      writer = new Writer(res, 'csv');
    },
    'application/json': function () {
      logger.info("JSON requested");
      res.type('application/json');
      writer = new Writer(res, 'json');
    },
    'default': function () {
      logger.warn("Requested format not acceptable");
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
function initEncoding(logger, req, res, callback) {
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

exports.init = function (logger, req, res, callback) {
  logger.info('Initializing request');
  initAnonymization(logger, req, function (err, anonymize) {
    if (err) { callback(err); return; }

    initLogParser(logger, req, function (err, logParser) {
      if (err) { callback(err); return; }

      initEncoding(logger, req, res, function (err, unzipReq, zipRes) {
        if (err) { callback(err); return; }

        initWriter(logger, res, function (err, writer) {
          if (err) { callback(err); return; }

          callback(null, unzipReq, zipRes, anonymize, logParser, writer);
        });
      });
    });
  });
}