/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var Writer    = require('./outputformats/writer.js');
var LogParser = require('./logparser.js');
var zlib      = require('zlib');
var path      = require('path');
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
 * Create the objects used to split user fields
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
 * @param  {Function} callback returns splitters and extra fields
 *                             returns an error if a doublon or a
 *                             missing header is detected
 */
function initFieldSplitters(app, req, res, logger, callback) {
  logger.verbose('Initializing field splitters');
  var headers      = req.headers;
  var ufSplitters  = {};
  var userFields   = []; // Those fields will be added to the output
  var sourceFields = [];
  var num;
  var match;

  for (var header in headers) {
    match = /^user-field([0-9]+)-dest-([a-zA-Z0-9]+)$/i.exec(header);
    if (match && match[1] && match[2]) {

      var destName = match[2];
      num = match[1];


      // Residual fieldname must have no doublon
      if (sourceFields.indexOf(destName) !== -1 || userFields.indexOf(destName) !== -1) {
        callback(new InitError(400, 4011));
        return;
      } else {
        userFields.push(destName);
      }

      if (!ufSplitters[num])      { ufSplitters[num] = {}; }
      if (!ufSplitters[num].dest) { ufSplitters[num].dest = []; }
      ufSplitters[num].dest.push({ regexp: headers[header], fieldName: destName });
    } else {

      var value = headers[header];
      match = /^user-field([0-9]+)-(src|sep|residual)$/i.exec(header);
      if (match && match[1] && match[2]) {
        switch (match[2]) {
        case 'sep':
          // Space character can not be used alone in a header, so use word "space" instead
          if (value == 'space') {
            value = ' ';
          }
          break;
        case 'src':
          // Src fieldname must not equal an extra field (dest or residual)
          // but multiple src can share a same fieldname
          if (userFields.indexOf(value) !== -1) {
            callback(new InitError(400, 4011));
            return;
          }
          sourceFields.push(value);
          break;
        case 'residual':
          // Residual fieldname must have no doublon
          if (sourceFields.indexOf(value) !== -1 || userFields.indexOf(value) !== -1) {
            callback(new InitError(400, 4011));
            return;
          }
          userFields.push(value);
          break;
        }

        num = match[1];
        if (!ufSplitters[num]) { ufSplitters[num] = {}; }
        ufSplitters[num][match[2]] = value;
      }
    }
  }

  // All splitters must have SRC, SEP and at least one DEST
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
  callback(null, ufSplitters, userFields);
}

/**
 * Sets the array containing the fields to use when writing ECs
 * @param  {Object}   req        the request stream
 * @param  {Object}   res        the response stream
 * @param  {Object}   userFields the extra fields made from user fields
 * @param  {Object}   logger     the log writer
 * @param  {Function} callback   returns an array of fields to add
 *                                   and an array of fields do remove
 */
function initOutputFields(app, req, res, logger, userFields, callback) {
  logger.verbose('Initializing output fields');
  var fieldsHeader  = req.header('Output-Fields');
  var addedFields   = userFields || [];
  var removedFields = [];

  if (fieldsHeader) {
    logger.verbose('Fields header: ' + fieldsHeader);
    var fields = fieldsHeader.split(',');
    for (var i = 0, l = fields.length; i < l; i++) {
      var field    = fields[i].trim();
      var operator = field.charAt(0);
      field        = field.substring(1).trim();
      if (!field) {
        callback(new InitError(400, 4012));
        return;
      }
      
      switch (operator) {
      case '+':
        addedFields.push(field);
        break;
      case '-':
        removedFields.push(field);
        break;
      default:
        callback(new InitError(400, 4013));
        return;
      }
    }
    logger.verbose('Fields added: ', addedFields);
    logger.verbose('Fields removed: ', removedFields);
  } else {
    logger.verbose('Using default fields');
  }

  callback(null, { added: addedFields, removed: removedFields });
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

  var proxies = ['ezproxy', 'apache', 'squid'];
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
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
 * @param  {Function} callback returns the writer
 */
function initWriter(app, req, res, logger, callback) {
  logger.verbose('Initializing EC writer');
  var writer = false;

  function getWriterOutputStream(resType, ext) {
    if (app.ezJobs[req.ezRID].resIsDeferred) {
      logger.info("Deferred response requested: ECs will be writen in a temp file");

      // create a file writer stream to store ECs into
      app.ezJobs[req.ezRID].ecsPath      = app.ezJobs[req.ezRID].jobPath + '/job-ecs.' + ext;
      app.ezJobs[req.ezRID].contentType  = resType;
      app.ezJobs[req.ezRID].byteWriten   = 0;
      app.ezJobs[req.ezRID].ecsStreamEnd = false;

      var jobPath = app.ezJobs[req.ezRID].jobPath;
      var reg     = /^job-ecs\.([a-z]+)$/;
      var files = fs.readdirSync(jobPath);

      files.forEach(function (file) {
        if (reg.test(file)) {
          fs.unlink(path.join(jobPath, file));
        }
      });
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
      writer = new Writer(getWriterOutputStream(res.get('Content-Type'), 'csv'), 'csv');
      callback(null, writer);
    },
    'application/json': function () {
      logger.info("JSON requested for response");
      res.type('application/json');
      writer = new Writer(getWriterOutputStream(res.get('Content-Type'), 'json'), 'json');
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
    
    initFieldSplitters(app, req, res, logger, function (err, ufSplitters, userFields) {
      if (err) { callback(err); return; }
      init.ufSplitters = ufSplitters;

      initOutputFields(app, req, res, logger, userFields, function (err, outputFields) {
        if (err) { callback(err); return; }
        init.outputFields = outputFields;

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
  });
}