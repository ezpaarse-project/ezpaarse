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
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
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
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
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
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
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
 * Get the objects used to split extra fields
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
 * @param  {Function} callback returns the log parser
 */
function initFieldSpliters(app, req, res, logger, callback) {
  logger.verbose('Initializing field splitters');
  var headers  = req.headers;
  var ufSplitters = {};

  var num;
  var match;
  for (var header in headers) {
    match = /^user-field([0-9]+)-dest-([a-zA-Z]+)$/i.exec(header);
    if (match && match[1] && match[2]) {
      num = match[1];
      if (!ufSplitters[num])      { ufSplitters[num] = {}; }
      if (!ufSplitters[num].dest) { ufSplitters[num].dest = []; }
      ufSplitters[num].dest.push({ regexp: headers[header], fieldName: match[2] });
    } else {
      match = /^user-field([0-9]+)-(src|sep|residual)$/i.exec(header);
      if (match && match[1] && match[2]) {
        if (match[2] == 'sep' && headers[header] == 'space') {
          headers[header] = ' ';
        }
        num = match[1];
        if (!ufSplitters[num]) { ufSplitters[num] = {}; }
        ufSplitters[num][match[2]] = headers[header];
      }
    }
  }
  for (var i in ufSplitters) {
    var splitter = ufSplitters[i];
    if (!splitter.src) {
      callback(new InitError(400, 4008));
      return;
    } else if (!splitter.sep) {
      callback(new InitError(400, 4009));
      return;
    } else if (!splitter.dest || splitter.dest.length === 0) {
      callback(new InitError(400, 4010));
      return;
    }
  }
  callback(null, ufSplitters);
}

/**
 * Creates a writer depending on the required data format (json, csv..)
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
 * @param  {Function} callback returns the writer
 */
function initWriter(app, req, res, logger, callback) {
  logger.verbose('Initializing EC writer');
  var writer = false;

  function getWriterOutputStream(resType) {
    if (app.ezJobs[req.ezRID].resIsDeferred) {
      logger.info("Deferred response requested: ECs will be writen in a temp file");

      // create a file writer stream to store ECs into
      app.ezJobs[req.ezRID].ecsPath      = app.ezJobs[req.ezRID].jobPath + '/job-ecs';
      app.ezJobs[req.ezRID].contentType  = resType;
      app.ezJobs[req.ezRID].byteWriten   = 0;
      app.ezJobs[req.ezRID].ecsStreamEnd = false;
      // output stream wrapper (needed to count number of bytes writen)
      app.ezJobs[req.ezRID].ecsStream = {
        write: function (data) {
          process.nextTick(function () {
            fs.appendFileSync(app.ezJobs[req.ezRID].ecsPath, data);
            app.ezJobs[req.ezRID].byteWriten += Buffer.byteLength(data, 'utf8');
          });
        },
        end: function () {
          logger.info("Temp file for deferred download completly writen");
          app.ezJobs[req.ezRID].ecsStreamEnd = true;
        }
      };
      // create an empty result file
      app.ezJobs[req.ezRID].ecsStream.write('');
      return app.ezJobs[req.ezRID].ecsStream;
    } else {
      return res;
    }
  }

  // configure the correct Writer depending on the "Accept" HTTP header
  // example : "Accept: text/csv"
  res.format({
    'text/csv': function () {
      logger.info("CSV requested for response");
      res.type('text/csv');
      writer = new Writer(getWriterOutputStream(res.get('Content-Type')), 'csv');
      callback(null, writer);
    },
    'application/json': function () {
      logger.info("JSON requested for response");
      res.type('application/json');
      writer = new Writer(getWriterOutputStream(res.get('Content-Type')), 'json');
      callback(null, writer);
    },
    'default': function () {
      logger.warn("Requested content-type '"
                  + req.header('accept')
                  + "' not acceptable for response");
      callback(new InitError(406, 4006));
    }
  });
}

/**
 * Decodes request and encodes response if needed
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
 * @param  {Function} callback returns the encoded/decoded streams
 */
function initEncoding(app, req, res, logger, callback) {
  logger.verbose('Initializing encoding');
//  var isMultipart        = new RegExp("^multipart\/", "i").test(req.header('content-type'));
//  var contentEncoding    = req.header('content-encoding');
  var acceptEncoding     = req.header('accept-encoding');
  var unzip;
  var zip;
  
//   if (!isMultipart && contentEncoding) {
//     if (contentEncoding == 'gzip' || contentEncoding == 'deflate') {
//       unzip = zlib.createUnzip();
//       req.pipe(unzip);
//     } else {
//       logger.warn('Content encoding not supported');
//       callback(new InitError(406, 4005));
//       return;
//     }
//   }

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

/**
 * Initialize a request before processing logs
 * @param  {Object}   app      the express application
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
 * @param  {Function} callback called when all functions were done
 */
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

        initFieldSpliters(app, req, res, logger, function (err, splitters) {
          if (err) { callback(err); return; }
          init.splitters = splitters;

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
  });
}