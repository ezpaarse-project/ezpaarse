/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs        = require('fs');
var path      = require('path');
var winston   = require('winston');
var ezJobs    = require('./jobs.js');

// var initFiles = [
//   'init-anonymization.js',
//   'init-deduplication.js',
//   'init-encoding.js',
//   'init-fieldsplitters.js',
//   'init-logparser.js',
//   'init-outputfields.js',
//   'init-writer.js'
// ];

var initFiles = fs.readdirSync(path.join(__dirname, 'init'));

/**
 * Initialize a request before processing logs
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Object}   logger   the log writer
 * @param  {Function} callback called when all functions were done
 */
exports.init = function (req, res, logger, callback) {
  logger.info('Initializing request');
  var fileIndex = 0;

  var loop = function (cb) {
    var file = initFiles[fileIndex++];
    if (!file) {
      cb();
      return;
    }
    var initMethod = require(path.join(__dirname, 'init', file));
    initMethod(req, res, logger, function (err) {
      if (err) { cb(err); }
      else     { loop(cb); }
    });
  };
  loop(callback);
}