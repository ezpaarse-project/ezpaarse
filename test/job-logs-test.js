/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var fs      = require('fs');
var should  = require('should');

var logFile                = __dirname + '/dataset/sd.mini.log';
var wrongSecondLineLogFile = __dirname + '/dataset/sd.wrong-second-line.log';
var ignoredDomain          = __dirname + '/dataset/ignored-domain.log';

describe('The server', function () {
  describe('receives a log file', function () {
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
  describe('receives a log file', function () {
    it('and correctly handles Job-Traces.log', function (done) {
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

        helpers.get('/logs/' + jobID + '/job-traces.log', function (error, res, body) {
          res.should.have.status(200);
          done();
        });
      });
    });
  });
  describe('receives a log file with a bad line', function () {
    it('and correctly handles Job-Unknown-Formats.log', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', wrongSecondLineLogFile, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);

        body = body.trim().split('\n');
        should.ok(body.length === 2, 'One EC should be returned');

        var jobID = res.headers['job-id'];
        should.exist(jobID, 'The header "Job-ID" was not sent by the server');
        should.exist(res.headers['job-unknown-formats'],
          'The header "Job-Unknown-Formats" was not sent by the server');

        helpers.get('/logs/' + jobID + '/job-unknown-formats.log',
        function (error, res, logBody) {
          res.should.have.status(200);

          logBody = logBody.trim().split('\n');
          should.ok(logBody.length === 1, 'One line should be present in the log file');

          var logLine = fs.readFileSync(wrongSecondLineLogFile).toString().split('\n')[1]
          logBody[0].should.equal(logLine);
          done();
        });
      });
    });
  });
  describe('receives a log file with an ignored domain', function () {
    it('and correctly handles Job-Ignored-Domains.log', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', ignoredDomain, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);
        should.not.exist(body);

        var jobID = res.headers['job-id'];
        should.exist(jobID, 'The header "Job-ID" was not sent by the server');
        should.exist(res.headers['job-unknown-formats'],
          'The header "Job-Unknown-Formats" was not sent by the server');

        helpers.get('/logs/' + jobID + '/job-ignored-domains.log',
        function (error, res, logBody) {
          res.should.have.status(200);

          var logLine = fs.readFileSync(ignoredDomain).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
  describe('receives a log file', function () {
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