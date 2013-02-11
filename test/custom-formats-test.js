/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var should  = require('should');

var logFile     = __dirname + '/dataset/sd.mini.log';
var gzipLogFile = __dirname + '/dataset/sd.mini.log.gz';

function sendRequest(logFile, headers, status, callback) {
  helpers.post('/ws/', logFile, headers, function (error, res, body) {
    if (error) {
      throw error;
    }
    if (!res) {
      throw new Error('ezPAARSE is not running');
    }
    res.should.have.status(status);
    callback();
  });
}

describe('The server', function () {
  describe('receives different log files on the HTTP POST /ws/ route', function () {
    it('and recognizes lines format using the HTTP headers', function (done) {
      var headers = { 'ezPAARSE-LogFormat': '%h %l %u %t %r %s %b' };
      sendRequest(logFile, headers, 200, function () {
        headers['ezPAARSE-LogFormat'] = '%h %l %u %r %s %b %t';
        sendRequest(logFile, headers, 400, function () {
          headers['Content-Encoding'] = 'gzip';
          sendRequest(gzipLogFile, headers, 400, function () {
            headers['ezPAARSE-LogFormat'] = '%h %l %u %t %r %s %b';
            sendRequest(gzipLogFile, headers, 200, done);
          });
        });
      });
    });
  });
});