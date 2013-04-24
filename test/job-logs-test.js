/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var fs      = require('fs');
var request = require('request');
var should  = require('should');

var logFile                = __dirname + '/dataset/sd.mini.log';
var wrongSecondLineLogFile = __dirname + '/dataset/sd.wrong-second-line.log';
var ignoredDomain          = __dirname + '/dataset/ignored-domain.log';
var unknownDomain          = __dirname + '/dataset/unknown-domain.log';
var unqualifiedEC          = __dirname + '/dataset/unqualified-ec.log';
var pkbmissEC              = __dirname + '/dataset/pkb-miss-ec.log';

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

        var logURL = res.headers['job-traces'];
        should.exist(logURL,
          'The header "Job-Traces" was not sent by the server');

        request.get(logURL, function (error, res, logBody) {
          if (error) {
            throw error;
          }
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

        var logURL = res.headers['job-unknown-formats'];
        should.exist(logURL,
          'The header "Job-Unknown-Formats" was not sent by the server');

        request.get(logURL, function (error, res, logBody) {
          if (error) {
            throw error;
          }
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

        var logURL = res.headers['job-ignored-domains'];
        should.exist(logURL,
          'The header "Job-Ignored-Domains" was not sent by the server');

        request.get(logURL, function (error, res, logBody) {
          if (error) {
            throw error;
          }
          res.should.have.status(200);

          var logLine = fs.readFileSync(ignoredDomain).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
  describe('receives a log file with an unknown domain', function () {
    it('and correctly handles Job-Unknown-Domains.log', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', unknownDomain, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);
        should.not.exist(body);

        var logURL = res.headers['job-unknown-domains'];
        should.exist(logURL,
          'The header "Job-Unknown-Domains" was not sent by the server');

        request.get(logURL, function (error, res, logBody) {
          if (error) {
            throw error;
          }
          res.should.have.status(200);

          var logLine = fs.readFileSync(unknownDomain).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
  describe('receives a log file with an unqualified log line', function () {
    it('and correctly handles Job-Unqualified-ECs.log', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', unqualifiedEC, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);
        should.not.exist(body);

        var logURL = res.headers['job-unqualified-ecs'];
        should.exist(logURL,
          'The header "Job-Unqualified-ECs" was not sent by the server');

        request.get(logURL, function (error, res, logBody) {
          if (error) {
            throw error;
          }
          res.should.have.status(200);

          var logLine = fs.readFileSync(unqualifiedEC).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
  describe('receives a log file with an unknown PID', function () {
    it('and correctly handles Job-PKB-Miss-ECs.log', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', pkbmissEC, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);

        body = body.trim().split('\n');
        should.ok(body.length === 2, 'One EC should be returned');

        var logURL = res.headers['job-pkb-miss-ecs'];
        should.exist(logURL,
          'The header "Job-PKB-Miss-ECs" was not sent by the server');

        request.get(logURL, function (error, res, logBody) {
          if (error) {
            throw error;
          }
          res.should.have.status(200);

          var logLine = fs.readFileSync(pkbmissEC).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
});