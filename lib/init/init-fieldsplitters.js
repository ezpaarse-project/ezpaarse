'use strict';

var InitError = require('../initerror.js');
var ezJobs    = require('../jobs.js');

/**
 * Create the objects used to split user fields
 * @param  {Object}   req      the request stream
 * @param  {Object}   res      the response stream
 * @param  {Function} callback returns splitters and extra fields
 *                             returns an error if a doublon or a
 *                             missing header is detected
 */
module.exports = function (req, res, callback) {
  var job            = ezJobs[req._jobID];
  job.logger.verbose('Initializing field splitters');
  job.outputFields   = job.outputFields || { added: [], removed: [] };

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

  userFields.forEach(function (field) {
    if (job.outputFields.added.indexOf(field) == -1) {
      job.outputFields.added.push(field);
    }
  });
  job.ufSplitters = ufSplitters;
  callback(null);
};