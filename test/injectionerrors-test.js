/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers       = require('./helpers.js');
var fs            = require('fs');
var should        = require('should');
var csvextractor  = require('../lib/csvextractor.js');

var logFile               = __dirname + '/dataset/sd.mini.log';
var gzipLogFile           = __dirname + '/dataset/sd.mini.log.gz';
var wrongFirstLineLogFile = __dirname + '/dataset/sd.wrong-first-line.log';

describe('The server', function () {
  describe('receives a log file whose first line is incorrect', function () {
    it('and sends back an empty body with an error 400', function (done) {
      var headers = {
        'Anonymise-host': 'md5'
      };
      helpers.post('/ws/', wrongFirstLineLogFile, headers,
      function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('The application is not running');
        }
        should.not.exist(body);
        res.should.have.status(400);
        done();
      });
    });
  });
  describe('receives a gzipped log file with no content-encoding', function () {
    it('and sends back an empty body with an error 400', function (done) {
      var headers = {
        'Anonymise-host': 'md5'
      };
      helpers.post('/ws/', gzipLogFile, headers,
      function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('The application is not running');
        }
        should.not.exist(body);
        res.should.have.status(400);
        done();
      });
    });
  });
  describe('receives a non-gzipped log file with a gzip content-encoding', function () {
    it('and sends back an empty body with an error 400', function (done) {
      var headers = {
        'content-encoding': 'gzip',
        'Anonymise-host': 'md5'
      };
      helpers.post('/ws/', logFile, headers,
      function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('The application is not running');
        }
        should.not.exist(body);
        res.should.have.status(400);
        done();
      });
    });
  });
});