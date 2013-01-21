/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var fs = require('fs');
var should = require('should');
var csvextractor = require('../csvextractor.js');

var logFile = __dirname + '/dataset/sd.2012-11-30.300.log';
var resultFile = __dirname + '/dataset/sd.2012-11-30.300.result.json';
var gzipLogFile = __dirname + '/dataset/sd.2013-01-15.log.gz';
var csvResultFile = __dirname + '/dataset/sd.2013-01-15.result.csv';

describe('The server', function () {
  describe('receiving a normal log file', function () {
    it('sends back a correct output', function (done) {
      var headers = {
        accept: 'application/json'
      };
      helpers.post('/ws/', logFile, headers,
      function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('The application is not running');
        }
        res.should.have.status(200);
        
        var correctOutput = fs.readFileSync(resultFile, 'UTF-8');
        var correctJson = JSON.parse(correctOutput);
        correctJson.should.be.a('object');

        var bodyJson = JSON.parse(body);
        bodyJson.should.be.a('object');

        should.ok(helpers.compareArrays(bodyJson, correctJson),
          'The response of the server does not match the expected one');

        done();
      });
    });
  });
  describe('receiving a gzipped log file', function () {
    this.timeout(7000);
    it('sends back a correct output', function (done) {
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
        fs.writeFileSync('truc.log', body);
        csvextractor(fs.createReadStream(csvResultFile), [], function (correctRecords) {
          csvextractor([body], [], function (bodyRecords) {
            should.ok(helpers.compareArrays(bodyRecords, correctRecords),
              'The response of the server does not match the expected one');
            done();
          }, {type: 'strings'});
        });
      });
    });
  });
});