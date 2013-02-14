/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers       = require('./helpers.js');
var fs            = require('fs');
var should        = require('should');
var csvextractor  = require('../lib/csvextractor.js');

var logFile               = __dirname + '/dataset/sd.2012-11-30.300.log';
var resultFile            = __dirname + '/dataset/sd.2012-11-30.300.result.json';
var gzipLogFile           = __dirname + '/dataset/sd.2013-01-15.log.gz';
var csvResultFile         = __dirname + '/dataset/sd.2013-01-15.result.csv';
var wrongFirstLineLogFile = __dirname + '/dataset/sd.wrong-first-line.log';

describe('The server', function () {
  describe('receives a log on the HTTP POST /ws/ route', function () {
    it('and sends back a well formatted output file', function (done) {
      var headers = {
        accept: 'application/json'
      };
      helpers.post('/ws/', logFile, headers, function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);
        
        var correctOutput = fs.readFileSync(resultFile, 'UTF-8');
        var correctJson   = JSON.parse(correctOutput);
        var bodyJson      = JSON.parse(body);

        correctJson.should.be.a('object');
        bodyJson.should.be.a('object');
        should.ok(helpers.compareArrays(bodyJson, correctJson, true),
          'Server\'s answer do not match the intended result');

        done();
      });
    });
  });
  describe('receives a gzipped log file', function () {
    it('and sends back a correct csv output', function (done) {
      var headers = {
        accept: 'text/csv',
        'content-encoding': 'gzip'
      };
      helpers.post('/ws/', gzipLogFile, headers,
      function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('The application is not running');
        }
        res.should.have.status(200);
        
        csvextractor.extract(fs.createReadStream(csvResultFile), [], function (correctRecords) {
          csvextractor.extract([body], [], function (bodyRecords) {
            should.ok(helpers.compareArrays(bodyRecords, correctRecords, true),
              'The response of the server does not match the expected one');
            done();
          }, {silent: true});
        }, {silent: true});
      });
    });
  });
});