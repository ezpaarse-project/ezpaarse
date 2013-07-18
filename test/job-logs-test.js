/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
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

describe('The server', function () {
  describe('receives a log file', function () {
    it('and sends a job ID in headers (@01)', function (done) {
      var headers = {
        'Accept' : 'application/json'
      };
      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);
        should.exist(res.headers['job-id'],
          'The header "Job-ID" was not sent by the server');
        done();
      });
    });
  });
  describe('receives a log file', function () {
    it('and correctly handles Job-Traces.log (@02)', function (done) {
      var headers = {
        'Accept' : 'application/json'
      };
      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        var logURL = res.headers['job-traces'];
        should.exist(logURL,
          'The header "Job-Traces" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          res.should.have.status(200);
          done();
        });
      });
    });
  });
  describe('receives a log file with a bad line', function () {
    it('and correctly handles Lines-Unknown-Formats.log (@03)', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', wrongSecondLineLogFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        body = body.trim().split('\n');
        should.ok(body.length === 2, 'One EC should be returned');

        var logURL = res.headers['lines-unknown-formats'];
        should.exist(logURL,
          'The header "Lines-Unknown-Formats" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
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
    it('and correctly handles Lines-Ignored-Domains.log (@04)', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', ignoredDomain, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);
        should.ok(body === '', 'The body is not empty');

        var logURL = res.headers['lines-ignored-domains'];
        should.exist(logURL,
          'The header "Lines-Ignored-Domains" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          res.should.have.status(200);

          var logLine = fs.readFileSync(ignoredDomain).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
  describe('receives a log file with an unknown domain', function () {
    it('and correctly handles Lines-Unknown-Domains.log (@05)', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', unknownDomain, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);
        should.ok(body === '', 'The body is not empty');

        var logURL = res.headers['lines-unknown-domains'];
        should.exist(logURL,
          'The header "Lines-Unknown-Domains" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          res.should.have.status(200);

          var logLine = fs.readFileSync(unknownDomain).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
  describe('receives a log file with an unqualified log line', function () {
    it('and correctly handles Lines-Unqualified-ECs.log (@06)', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', unqualifiedEC, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);
        should.ok(body === '', 'The body is not empty');

        var logURL = res.headers['lines-unqualified-ecs'];
        should.exist(logURL,
          'The header "Lines-Unqualified-ECs" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          res.should.have.status(200);

          var logLine = fs.readFileSync(unqualifiedEC).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
  describe('receives a log file with an unknown PID', function () {
    it('and correctly handles Lines-PKB-Miss-ECs.log (@07)', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', pkbmissEC, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        body = body.trim().split('\n');
        should.ok(body.length === 2, 'One EC should be returned');

        var logURL = res.headers['lines-pkb-miss-ecs'];
        should.exist(logURL,
          'The header "Lines-PKB-Miss-ECs" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          res.should.have.status(200);

          var logLine = fs.readFileSync(pkbmissEC).toString().trim();
          logBody.trim().should.equal(logLine, 'The logfile and the input should be identical');
          done();
        });
      });
    });
  });
  describe('receives a log file with duplicate consultations', function () {
    it('and correctly handles Lines-Duplicate-ECs.log (@08)', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', duplicateEC, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        body = body.trim().split('\n');
        should.ok(body.length === 2, 'One EC should be returned');
        var logURL = res.headers['lines-duplicate-ecs'];
        
        should.exist(logURL,
          'The header "Lines-Duplicate-ECs" was not sent by the server');

        request.get(logURL, function (error, response, logBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          res.should.have.status(200);

          var logLine = fs.readFileSync(duplicateEC).toString().split('\n')[0].trim();
          logBody.trim().should.equal(logLine, 'The logfile should match the first line');
          done();
        });
      });
    });
  });
});