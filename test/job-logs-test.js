/*global describe, it*/
'use strict';

var fs      = require('fs');
var path    = require('path');
var request = require('request');
var should  = require('should');
var helpers = require('./helpers.js');

var logFile                = path.join(__dirname, '/dataset/sd.mini.log');
var wrongSecondLineLogFile = path.join(__dirname, '/dataset/sd.wrong-second-line.log');
var ignoredDomain          = path.join(__dirname, '/dataset/ignored-domain.log');
var unknownDomain          = path.join(__dirname, '/dataset/unknown-domain.log');
var unqualifiedEC          = path.join(__dirname, '/dataset/unqualified-ec.log');
var pkbmissEC              = path.join(__dirname, '/dataset/pkb-miss-ec.log');
var duplicateEC            = path.join(__dirname, '/dataset/duplicate-ecs.log');
var unorderedEC            = path.join(__dirname, '/dataset/unordered-ecs.log');
var deniedEC               = path.join(__dirname, '/dataset/sd.denied.log');
var filteredEC             = path.join(__dirname, '/dataset/filtered-ecs.log');

describe('The server', function () {
  describe('receives a log file', function () {
    it('and sends a job ID in headers (@01)', function (done) {
      var headers = {
        'Accept' : 'application/json'
      };
      helpers.post('/', logFile, headers, function (err, res) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);
        should.exist(res.headers['job-id'],
          'The header "Job-ID" was not sent by the server');
        done();
      });
    });
    it('and does not generate rejects files by default (@02)', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', wrongSecondLineLogFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

        var logHeaders = [];
        for (var header in res.headers) {
          if (header.substr(0, 6) == 'lines-') {
            logHeaders.push(header);
          }
        }

        logHeaders.length.should.not.equal(0);

        (function check() {
          var header = logHeaders.pop();
          if (!header) { return done(); }

          var logURL = res.headers[header];

          request.get(logURL, function (error, response, logBody) {
            if (!response) { throw new Error('ezPAARSE is not running'); }
            if (error)     { throw error; }
            response.statusCode.should.equal(404,
              'the URL of ' + header + ' should return 404, got ' + response.statusCode);
            check();
          });
        })();
      });
    });
  });
  describe('receives a log file', function () {
    it('and correctly handles Job-Traces.log (@03)', function (done) {
      var headers = {
        'Accept' : 'application/json'
      };
      helpers.post('/', logFile, headers, function (err, res) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

        var logURL = res.headers['job-traces'];
        should.exist(logURL,
          'The header "Job-Traces" was not sent by the server');

        request.get(logURL, function (error, response) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          response.statusCode.should.equal(200,
            'couldn\'t get the logfile, server sent ' + response.statusCode);
          done();
        });
      });
    });
  });
  describe('receives a log file with a bad line', function () {
    it('and correctly handles Lines-Unknown-Formats.log (@04)', function (done) {
      var headers = {
        'Accept' : 'text/csv',
        'Reject-Files': 'unknown-formats'
      };
      helpers.post('/', wrongSecondLineLogFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

        body = body.trim().split('\n');
        should.ok(body.length === 2, '1 EC should be returned, got ' + (body.length - 1));

        var logURL = res.headers['lines-unknown-formats'];
        should.exist(logURL,
          'The header "Lines-Unknown-Formats" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          response.statusCode.should.equal(200,
            'couldn\'t get the logfile, server sent ' + response.statusCode);

          logBody = logBody.trim().split('\n');
          should.ok(logBody.length === 1, '1 line should be present in the log file');

          var logLine = fs.readFileSync(wrongSecondLineLogFile).toString().split('\n')[1];
          logBody[0].should.equal(logLine);
          done();
        });
      });
    });
  });
  describe('receives a log file with an ignored domain', function () {
    it('and correctly handles Lines-Ignored-Domains.log (@05)', function (done) {
      var headers = {
        'Accept' : 'text/csv',
        'Reject-Files': 'ignored-domains'
      };
      helpers.post('/', ignoredDomain, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);
        should.ok(body === '', 'The body is not empty');

        var logURL = res.headers['lines-ignored-domains'];
        should.exist(logURL,
          'The header "Lines-Ignored-Domains" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          response.statusCode.should.equal(200,
            'couldn\'t get the logfile, server sent ' + response.statusCode);

          var logLine = fs.readFileSync(ignoredDomain).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
  describe('receives a log file with an unknown domain', function () {
    it('and correctly handles Lines-Unknown-Domains.log (@06)', function (done) {
      var headers = {
        'Accept' : 'text/csv',
        'Reject-Files': 'unknown-domains'
      };
      helpers.post('/', unknownDomain, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);
        should.ok(body === '', 'The body is not empty');

        var logURL = res.headers['lines-unknown-domains'];
        should.exist(logURL,
          'The header "Lines-Unknown-Domains" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          response.statusCode.should.equal(200,
            'couldn\'t get the logfile, server sent ' + response.statusCode);

          var logLine = fs.readFileSync(unknownDomain).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
  describe('receives a log file with an unqualified log line', function () {
    it('and correctly handles Lines-Unqualified-ECs.log (@07)', function (done) {
      var headers = {
        'Accept' : 'text/csv',
        'Reject-Files': 'unqualified-ecs'
      };
      helpers.post('/', unqualifiedEC, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);
        should.ok(body === '', 'The body is not empty');

        var logURL = res.headers['lines-unqualified-ecs'];
        should.exist(logURL,
          'The header "Lines-Unqualified-ECs" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          response.statusCode.should.equal(200,
            'couldn\'t get the logfile, server sent ' + response.statusCode);

          var logLine = fs.readFileSync(unqualifiedEC).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
  describe('receives a log file with an unknown PID', function () {
    it('and correctly handles Lines-PKB-Miss-ECs.log (@08)', function (done) {
      var headers = {
        'Accept' : 'text/csv',
        'Reject-Files': 'pkb-miss-ecs'
      };
      helpers.post('/', pkbmissEC, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

        body = body.trim().split('\n');
        should.ok(body.length === 2, '1 EC should be returned, got ' + (body.length - 1));

        var logURL = res.headers['lines-pkb-miss-ecs'];
        should.exist(logURL,
          'The header "Lines-PKB-Miss-ECs" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          response.statusCode.should.equal(200,
            'couldn\'t get the logfile, server sent ' + response.statusCode);

          var logLine = fs.readFileSync(pkbmissEC).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
  describe('receives a log file with duplicate consultations', function () {
    it('and correctly handles Lines-Duplicate-ECs.log (@09)', function (done) {
      var headers = {
        'Accept' : 'text/csv',
        'Reject-Files': 'duplicate-ecs'
      };
      helpers.post('/', duplicateEC, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

        body = body.trim().split('\n');
        should.ok(body.length === 2, '1 EC should be returned, got ' + (body.length - 1));
        var logURL = res.headers['lines-duplicate-ecs'];

        should.exist(logURL,
          'The header "Lines-Duplicate-ECs" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          response.statusCode.should.equal(200,
            'couldn\'t get the logfile, server sent ' + response.statusCode);

          var logLine = fs.readFileSync(duplicateEC).toString().split('\n')[0].trim();
          logBody.trim().should.equal(logLine, 'The logfile should match the first line');
          done();
        });
      });
    });
  });
  describe('receives a log file with chronological errors', function () {
    it('and correctly handles Lines-Unordered-ECs.log (@10)', function (done) {
      var headers = {
        'Accept' : 'text/csv',
        'Reject-Files': 'unordered-ecs'
      };
      helpers.post('/', unorderedEC, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

        body = body.trim().split('\n');
        should.ok(body.length === 2, '1 EC should be returned, got ' + (body.length - 1));
        var logURL = res.headers['lines-unordered-ecs'];

        should.exist(logURL,
          'The header "Lines-Unordered-ECs" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          response.statusCode.should.equal(200,
            'couldn\'t get the logfile, server sent ' + response.statusCode);

          var logLine = fs.readFileSync(unorderedEC).toString().split('\n')[1].trim();
          logBody.trim().should.equal(logLine, 'The logfile should match the second line');
          done();
        });
      });
    });
  });
  describe('receives a log file with chronological errors and Reject-File at none', function () {
    it('and does not handle Lines-Unordered-ECs.log (@11)', function (done) {
      var headers = {
        'Accept' : 'text/csv',
        'Reject-Files': 'none'
      };
      helpers.post('/', unorderedEC, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

        body = body.trim().split('\n');
        should.ok(body.length === 2, '1 EC should be returned, got ' + (body.length - 1));
        var logURL = res.headers['lines-unordered-ecs'];

        should.exist(logURL,
          'The header "Lines-Unordered-ECs" was not sent by the server');
        should.exist(res.headers['job-id'],
          'The header "Job-ID" was not sent by the server');

        request.get(logURL, function (error, response) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          response.should.have.status(404);
          done();
        });
      });
    });
  });
  describe('receives a log file with denied access', function () {
    it('and correctly handles denied-ecs.csv (@12)', function (done) {
      var headers = {
        'Accept' : 'text/csv',
        'Reject-Files': 'none'
      };
      helpers.post('/', deniedEC, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

        should.ok(body.length === 0, 'the response should be empty');

        var logURL = res.headers['denied-ecs'];
        should.exist(logURL,
          'The header "Denied-ECs" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          response.statusCode.should.equal(200,
            'couldn\'t get the logfile, server sent ' + response.statusCode);

          logBody = logBody.trim().split('\n');
          should.ok(logBody.length === 3, '3 lines should be present in the log file,'
            + ' got ' + logBody.length);
          done();
        });
      });
    });
  });
  describe('receives a log file with filtered lines', function () {
    it('and correctly handles Lines-Filtered-ECs.log (@13)', function (done) {
      var headers = {
        'Accept' : 'text/csv',
        'Reject-Files': 'filtered-ecs'
      };
      helpers.post('/', filteredEC, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

        body = body.trim().split('\n');
        should.ok(body.length === 2, '1 EC should be returned, got ' + (body.length - 1));
        var logURL = res.headers['lines-filtered-ecs'];

        should.exist(logURL,
          'The header "Lines-Filtered-ECs" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          response.statusCode.should.equal(200,
            'couldn\'t get the logfile, server sent ' + response.statusCode);

          var logLine = fs.readFileSync(filteredEC).toString().split('\n')[1].trim();
          logBody.trim().should.equal(logLine, 'The logfile should match the second line');
          done();
        });
      });
    });
  });
  describe('recives a log file with lines filtered by default', function() {
    it('and does not filter them when ezPAARSE-Filter-Redirects is false (@14)', function (done) {
      var headers = {
        'ezPAARSE-Filter-Redirects' : 'false',
        'Accept' : 'text/csv'
      };
      helpers.post('/', filteredEC, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

        body = body.trim().split('\n');
        should.ok(body.length === 3, '2 EC should be returned, got ' + (body.length - 1));
        done();
      });
    });
  });
});