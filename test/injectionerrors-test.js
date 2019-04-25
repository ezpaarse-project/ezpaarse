/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var path = require('path');

var logFile     = path.resolve(__dirname, 'dataset/sd.mini.log');
var gzipLogFile = path.resolve(__dirname, 'dataset/sd.mini.log.gz');

describe('The server', function () {
  describe('receives a gzipped log file with no content-encoding', function () {
    it('and sends back a JSON with an error 4003 (@02)', function (done) {
      var headers = {};

      helpers.post('/', gzipLogFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }

        res.should.have.status(400);
        const response = JSON.parse(body);

        response.should.have.property('message');
        response.should.have.property('code', 4003);

        done();
      });
    });
  });
  describe('receives a non-gzipped log file with a gzip content-encoding', function () {
    it('and sends back a JSON with an error 4002 (@03)', function (done) {
      var headers = {
        'content-encoding': 'gzip'
      };

      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }

        res.should.have.status(400);
        const response = JSON.parse(body);

        response.should.have.property('message');
        response.should.have.property('code', 4002);

        done();
      });
    });
  });
  describe('receives a gzipped log file with an unknown content-encoding', function () {
    it('and sends back a JSON with an error 4005 (@04)', function (done) {
      var headers = {
        'content-encoding': 'unsupported/encoding'
      };

      helpers.post('/', gzipLogFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }

        res.should.have.status(406);
        const response = JSON.parse(body);

        response.should.have.property('message');
        response.should.have.property('code', 4005);

        done();
      });
    });
  });
  describe('receives a log file with an unsupported output format requested', function () {
    it('and sends back a JSON with an error 4006 (@06)', function (done) {
      var headers = {
        'Accept': 'unsupported/format'
      };

      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }

        res.should.have.status(406);
        const response = JSON.parse(body);

        response.should.have.property('message');
        response.should.have.property('code', 4006);

        done();
      });
    });
  });
});
