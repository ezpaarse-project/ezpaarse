/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var fs      = require('fs');
var should  = require('should');

var logFile = __dirname + '/dataset/sd.mini.log';

describe('The server', function () {
  describe('receives a log', function () {
    it('and sends a job ID in headers', function (done) {
      var headers = {
        'Accept' : 'application/json'
      };
      helpers.post('/', logFile, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);
        should.exist(res.headers['job-id'],
          'The header "Job-ID" was not sent by the server');
        done();
      });
    });
  });
  describe('receives a log', function () {
    it('and correctly handles JobTraces.log', function (done) {
      var headers = {
        'Accept' : 'application/json'
      };
      helpers.post('/', logFile, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);
        var jobID = res.headers['job-id'];
        should.exist(jobID, 'The header "Job-ID" was not sent by the server');
        should.exist(res.headers['job-traces'],
          'The header "Job-Traces" was not sent by the server');

        var logDir = __dirname + '/../tmp/logs/' + jobID;
        should.ok(fs.existsSync(logDir),
          'The log folder has not been created');
        should.ok(fs.existsSync(logDir + '/jobtraces.log'),
          'JobTraces.log has not been created');

        done();
      });
    });
  });
  describe('receives a log', function () {
    it('and sends all log-related headers', function (done) {
      var headers = {
        'Accept' : 'application/json'
      };
      helpers.post('/', logFile, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);

        // TODO make a specific test for each header
        should.exist(res.headers['job-unknown-formats'],
          'The header "JobUnknownFormats" was not sent by the server');
        should.exist(res.headers['job-ignored-domains'],
          'The header "JobIgnoredDomains" was not sent by the server');
        should.exist(res.headers['job-unqualified-ecs'],
          'The header "JobUnqualifiedECs" was not sent by the server');
        should.exist(res.headers['job-pkb-miss-ecs'],
          'The header "JobPKBMissECs" was not sent by the server');
        done();
      });
    });
  });
});