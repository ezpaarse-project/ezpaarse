/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var debug     = require('debug')('log:initializer');
var Writer    = require('./outputformats/writer.js');
var LogParser = require('./logparser.js');
var zlib      = require('zlib');

var InitError = function (status, ezStatus) {
  this.status = status;
  this.ezStatus = ezStatus;
}

function initAnonymization(req, callback) {
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

function initLogParser(req, callback) {
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
  callback(null, new LogParser(logFormat, logProxy, dateFormat));
}

function initWriter(res, callback) {
  var writer = false;
  res.format({
    'text/csv': function () {
      debug("CSV requested");
      res.type('text/csv');
      writer = new Writer(res, 'csv');
    },
    'application/json': function () {
      debug("JSON requested");
      res.type('application/json');
      writer = new Writer(res, 'json');
    },
    'default': function () {
      debug("Requested format not acceptable");
      callback(new InitError(406, 4006));
      return;
    }
  });
  if (!writer) {
    debug("Writer not found");
    callback(new InitError(500, 5001));
    return;
  }
  callback(null, writer);
}

function initEncoding(req, res, callback) {
  var contentEncoding = req.header('content-encoding');
  var acceptEncoding  = req.header('accept-encoding');
  var unzip;
  var zip;

  if (contentEncoding) {
    if (contentEncoding == 'gzip' || contentEncoding == 'deflate') {
      unzip = zlib.createUnzip();
      req.pipe(unzip);
    } else {
      debug('Content encoding not supported');
      callback(new InitError(406, 4005));
      return;
    }
  }

  if (acceptEncoding) {
    var encodings = acceptEncoding.split(',');
    for (var j = 0, lth = encodings.length; j < lth; j++) {
      var encoding = encodings[j].trim();
      if (encoding == 'gzip') {
        debug("Gzip requested");
        res.set('Content-Encoding', 'gzip');
        zip = zlib.createGzip();
        zip.pipe(res);
        break;
      } else if (encoding == 'deflate') {
        debug("Deflate requested");
        res.set('Content-Encoding', 'deflate');
        zip = zlib.createDeflate();
        zip.pipe(res);
        break;
      }
    }
    if (!zip) {
      debug("Requested encoding(s) not supported");
      callback(new InitError(406, 4005));
      return;
    }
  }

  callback(null, unzip, zip);
}

exports.init = function (req, res, callback) {
  initAnonymization(req, function (err, anonymize) {
    if (err) { callback(err); return; }

    initLogParser(req, function (err, logParser) {
      if (err) { callback(err); return; }

      initEncoding(req, res, function (err, unzipReq, zipRes) {
        if (err) { callback(err); return; }

        initWriter(res, function (err, writer) {
          if (err) { callback(err); return; }

          callback(null, unzipReq, zipRes, anonymize, logParser, writer);
        });
      });
    });
  });
}