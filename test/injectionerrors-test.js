/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers       = require('./helpers.js');
var should        = require('should');

var logFile               = __dirname + '/dataset/sd.mini.log';
var gzipLogFile           = __dirname + '/dataset/sd.mini.log.gz';
var wrongFirstLineLogFile = __dirname + '/dataset/sd.wrong-first-line.log';

describe('The server', function () {
  describe('receives a log file whose first line is incorrect', function () {
    it('and sends back an empty body with an error 4003 (@01)', function (done) {
      var headers = {};
      helpers.post('/', wrongFirstLineLogFile, headers,
      function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        should.ok(body === '', 'The body is not empty');
        res.should.have.status(400);
        res.should.have.header('ezpaarse-status');
        res.should.have.header('ezpaarse-status-message');
        var status = res.headers['ezpaarse-status'];
        status.should.equal('4003', 'ezPAARSE returned a wrong status header');
        done();
      });
    });
  });
  describe('receives a gzipped log file with no content-encoding', function () {
    it('and sends back an empty body with an error 4003 (@02)', function (done) {
      var headers = {};
      helpers.post('/', gzipLogFile, headers,
      function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        should.ok(body === '', 'The body is not empty');
        res.should.have.status(400);
        res.should.have.header('ezpaarse-status');
        res.should.have.header('ezpaarse-status-message');
        var status = res.headers['ezpaarse-status'];
        status.should.equal('4003', 'ezPAARSE returned a wrong status header');
        done();
      });
    });
  });
  describe('receives a non-gzipped log file with a gzip content-encoding', function () {
    it('and sends back an empty body with an error 4002 (@03)', function (done) {
      var headers = {
        'content-encoding': 'gzip'
      };
      helpers.post('/', logFile, headers,
      function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        should.ok(body === '', 'The body is not empty');
        res.should.have.status(400);
        res.should.have.header('ezpaarse-status');
        res.should.have.header('ezpaarse-status-message');
        var status = res.headers['ezpaarse-status'];
        status.should.equal('4002', 'ezPAARSE returned a wrong status header');
        done();
      });
    });
  });
  describe('receives a gzipped log file with an unknown content-encoding', function () {
    it('and sends back an empty body with an error 4005 (@04)', function (done) {
      var headers = {
        'content-encoding': 'unsupported/encoding'
      };
      helpers.post('/', gzipLogFile, headers,
      function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        should.ok(body === '', 'The body is not empty');
        res.should.have.status(406);
        res.should.have.header('ezpaarse-status');
        res.should.have.header('ezpaarse-status-message');
        var status = res.headers['ezpaarse-status'];
        status.should.equal('4005', 'ezPAARSE returned a wrong status header');
        done();
      });
    });
  });
  describe('receives a log file with an unsupported hash for anonymization', function () {
    it('and sends back an empty body with an error 4004 (@05)', function (done) {
      var headers = {
        'Anonymize-Host': 'unsupported/hash'
      };
      helpers.post('/', logFile, headers,
      function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        should.ok(body === '', 'The body is not empty');
        res.should.have.status(400);
        res.should.have.header('ezpaarse-status');
        res.should.have.header('ezpaarse-status-message');
        var status = res.headers['ezpaarse-status'];
        status.should.equal('4004', 'ezPAARSE returned a wrong status header');
        done();
      });
    });
  });
  describe('receives a log file with an unsupported output format requested', function () {
    it('and sends back an empty body with an error 4006 (@06)', function (done) {
      var headers = {
        'Accept': 'unsupported/format'
      };
      helpers.post('/', logFile, headers,
      function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        should.ok(body === '', 'The body is not empty');
        res.should.have.status(406);
        res.should.have.header('ezpaarse-status');
        res.should.have.header('ezpaarse-status-message');
        var status = res.headers['ezpaarse-status'];
        status.should.equal('4006', 'ezPAARSE returned a wrong status header');
        done();
      });
    });
  });
});