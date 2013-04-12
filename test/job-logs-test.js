/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var fs      = require('fs');
var should  = require('should');

var logFile     = __dirname + '/dataset/sd.mini.log';

describe('The server', function () {
  describe('receives a log on the HTTP POST / route', function () {
    it('and correctly sends log headers', function (done) {
      var headers = {
        'Accept'        : 'application/json'
      };
      helpers.post('/', logFile, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);
        should.exist(res.headers['jobid'], 'The JobID header was not sent by the server');

        done();
      });
    });
  });
});