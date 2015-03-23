/*jshint maxlen: 130*/
/*global describe, it*/
'use strict';

var fs      = require('fs');
var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');

var logFormat            = '%h %u %{session}<[a-zA-Z0-9\\-]+> %t "%r" %s';
var multipleStatus       = path.join(__dirname, '/dataset/sd.multiple-status.log');
var redundantLogFile     = path.join(__dirname, '/dataset/sd.duplicates.log');
var manyclickLogFile     = path.join(__dirname, '/dataset/sd.duplicates-manyclick.log');
var manyclickResultFile  = path.join(__dirname, '/dataset/sd.duplicates-manyclick.result.json');
var manyclickLogFile2    = path.join(__dirname, '/dataset/sd.duplicates-manyclick2.log');
var manyclickResultFile2 = path.join(__dirname, '/dataset/sd.duplicates-manyclick2.result.json');
var sessionResultFile    = path.join(__dirname, '/dataset/sd.duplicates-session.result.json');
var loginResultFile      = path.join(__dirname, '/dataset/sd.duplicates-login.result.json');
var mixedLoginResultFile = path.join(__dirname, '/dataset/sd.duplicates-mixed-login.result.json');
var ipResultFile         = path.join(__dirname, '/dataset/sd.duplicates-ip.result.json');

describe('The server', function () {
  describe('receives a log with multiple HTTP status codes', function () {
    it('and correctly filter them (@01)', function (done) {
      var headers = {
        'Accept' : 'application/json'
      };
      helpers.post('/', multipleStatus, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        should.exist(body);
        should.ok(body.length, 'The server returned an empty response');
        var json = JSON.parse(body);
        json.should.be.an.instanceOf(Array);
        should.ok(json.length == 2, 'The server should return 2 ECs, but it returned '
                                  + json.length);

        json.forEach(function (ec) {
          ec.should.have.property('status');
          should.ok(['200', '304'].indexOf(ec.status) != -1, 'An EC with status "' + ec.status
                                                           + '" was not filtered');
        });
        done();
      });
    });
  });
  describe('receives a log with redundant consultations on the HTTP POST / route', function () {
    it('and sends back a deduplicated output file using session (@02)', function (done) {
      var headers = {
        'Accept'               : 'application/json',
        'Log-Format-ezproxy'   : logFormat,
        'Double-Click-HTML'    : 10,
        'Double-Click-MISC'    : 20,
        'Double-Click-PDF'     : 30,
        'Double-Click-C-Field' : 'session',
        'Double-Click-Strategy': 'CLI'
      };
      helpers.post('/', redundantLogFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        var correctOutput = fs.readFileSync(sessionResultFile, 'UTF-8');
        var correctJson   = JSON.parse(correctOutput);
        var bodyJson      = JSON.parse(body);

        correctJson.should.be.an.instanceOf(Array);
        bodyJson.should.be.an.instanceOf(Array);
        should.equal(correctJson.length, bodyJson.length);
        should.ok(helpers.equalJSONList(bodyJson, correctJson, true, ['date', 'rtype', 'mime']),
          'Server\'s answer do not match the intended result');

        done();
      });
    });
  });
  describe('receives a log with redundant consultations on the HTTP POST / route', function () {
    it('and sends back a deduplicated output file using login (@03)', function (done) {
      var headers = {
        'Accept'              : 'application/json',
        'Log-Format-ezproxy'  : '%h %u %{session}<[a-zA-Z0-9\\-]+> %t "%r" %s',
        'Double-Click-HTML'   : 10,
        'Double-Click-MISC'   : 20,
        'Double-Click-PDF'    : 30,
        'Double-Click-C-Field': 'session',
        'Double-Click-Strategy': 'LCI'
      };
      helpers.post('/', redundantLogFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        var correctOutput = fs.readFileSync(loginResultFile, 'UTF-8');
        var correctJson   = JSON.parse(correctOutput);
        var bodyJson      = JSON.parse(body);

        correctJson.should.be.an.instanceOf(Array);
        bodyJson.should.be.an.instanceOf(Array);
        should.equal(correctJson.length, bodyJson.length);
        should.ok(helpers.equalJSONList(bodyJson, correctJson, true, ['date', 'rtype', 'mime']),
          'Server\'s answer do not match the intended result');

        done();
      });
    });
  });
  describe('receives a log with redundant consultations on the HTTP POST / route', function () {
    it('and sends back a deduplicated output file using IP (@04)', function (done) {
      var headers = {
        'Accept'              : 'application/json',
        'Log-Format-ezproxy'  : '%h %u %{session}<[a-zA-Z0-9\\-]+> %t "%r" %s',
        'Double-Click-HTML'   : 10,
        'Double-Click-MISC'   : 20,
        'Double-Click-PDF'    : 30,
        'Double-Click-C-Field': 'session',
        'Double-Click-Strategy': 'ILC'
      };
      helpers.post('/', redundantLogFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        var correctOutput = fs.readFileSync(ipResultFile, 'UTF-8');
        var correctJson   = JSON.parse(correctOutput);
        var bodyJson      = JSON.parse(body);

        correctJson.should.be.an.instanceOf(Array);
        bodyJson.should.be.an.instanceOf(Array);
        should.equal(correctJson.length, bodyJson.length);
        should.ok(helpers.equalJSONList(bodyJson, correctJson, true, ['date', 'rtype', 'mime']),
          'Server\'s answer do not match the intended result');

        done();
      });
    });
  });

  describe('receives a log with many redundant consultations on the HTTP POST / route', function () {
    it('and sends back a deduplicated output file (@05)', function (done) {
      var headers = {
        'Accept'               : 'application/json',
        'Log-Format-ezproxy'   : logFormat,
        'Double-Click-HTML'    : 10,
        'Double-Click-MISC'    : 20,
        'Double-Click-PDF'     : 30,
        'Double-Click-C-Field' : 'session',
        'Double-Click-Strategy': 'CLI'
      };
      helpers.post('/', manyclickLogFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        var correctOutput = fs.readFileSync(manyclickResultFile, 'UTF-8');
        var correctJson   = JSON.parse(correctOutput);
        var bodyJson      = JSON.parse(body);

        correctJson.should.be.an.instanceOf(Array);
        bodyJson.should.be.an.instanceOf(Array);
        should.equal(correctJson.length, bodyJson.length);
        should.ok(helpers.equalJSONList(bodyJson, correctJson, true, ['date', 'rtype', 'mime']),
          'Server\'s answer do not match the intended result');

        done();
      });
    });
  });

  describe('receives a log with only two redundant HTML consultations on the HTTP POST / route', function () {
    it('and sends back a deduplicated output file (@05)', function (done) {
      var headers = {
        'Accept'               : 'application/json',
        'Log-Format-ezproxy'   : logFormat,
        'Double-Click-HTML'    : 10,
        'Double-Click-MISC'    : 20,
        'Double-Click-PDF'     : 30,
        'Double-Click-C-Field' : 'session',
        'Double-Click-Strategy': 'CLI'
      };
      helpers.post('/', manyclickLogFile2, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        var correctOutput = fs.readFileSync(manyclickResultFile2, 'UTF-8');
        var correctJson   = JSON.parse(correctOutput);
        var bodyJson      = JSON.parse(body);

        correctJson.should.be.an.instanceOf(Array);
        bodyJson.should.be.an.instanceOf(Array);
        should.equal(correctJson.length, bodyJson.length);
        should.ok(helpers.equalJSONList(bodyJson, correctJson, true, ['date', 'rtype', 'mime']),
          'Server\'s answer do not match the intended result');

        done();
      });
    });
  });
  describe('receives a log with redundant consultations', function () {
    it('and deduplicates them into the same window (@06)', function (done) {
      var headers = {
        'Accept'               : 'application/json',
        'Log-Format-ezproxy'   : logFormat,
        'Double-Click-Strategy': 'LCI',
        'Double-Click-MIXED'   : 10
      };
      helpers.post('/', redundantLogFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        fs.writeFileSync('res.json', body);
        var correctOutput = fs.readFileSync(mixedLoginResultFile, 'UTF-8');
        var correctJson   = JSON.parse(correctOutput);
        var bodyJson      = JSON.parse(body);

        correctJson.should.be.an.instanceOf(Array);
        bodyJson.should.be.an.instanceOf(Array);
        should.equal(correctJson.length, bodyJson.length);
        should.ok(helpers.equalJSONList(bodyJson, correctJson, true,
          ['timestamp', 'rtype', 'mime', 'unitid']),
          'Server\'s answer do not match the intended result');

        done();
      });
    });
  });
});