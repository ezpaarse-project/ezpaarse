/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers       = require('./helpers.js');
var should        = require('should');

var custom1      = __dirname + '/dataset/custom-1.log';
var custom2      = __dirname + '/dataset/custom-2.log';
var custom3      = __dirname + '/dataset/custom-3.log';

function sendRequest(logFile, headers, callback) {
  helpers.post('/ws/', logFile, headers, function (error, res, body) {
    if (error) {
      throw error;
    }
    if (!res) {
      throw new Error('ezPAARSE is not running');
    }
    res.should.have.status(200);
    callback();
  });
}

describe('The server', function () {
  describe('receives different log files on the HTTP POST /ws/ route', function () {
    it('and recognizes lines format using the HTTP headers', function (done) {
      var headers = { 'ezPAARSE-LogFormat': '%s %b %h %l %u %t %r' };
      sendRequest(custom1, headers, function () {
        headers['ezPAARSE-LogFormat'] = '%l %u %t %h %r %s %b';
        sendRequest(custom2, headers, function () {
          headers['ezPAARSE-LogFormat'] = '%r %l %u %t %h %s %b';
          sendRequest(custom3, headers, done);
        });
      });
    });
  });
});