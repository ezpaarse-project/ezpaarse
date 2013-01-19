/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var fs = require('fs');
var should = require('should');

var logFile = __dirname + '/dataset/sd.2012-11-30.300.log';
var resultFile = __dirname + '/dataset/sd.2012-11-30.300.result.json';

describe('The server', function () {
  describe('receives a log on the HTTP POST /ws/ route', function () {
    it('and sends back a well formatted output file', function (done) {
      helpers.post('/ws/', logFile,
      function (error, res, body) {
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);
        
        var correctOutput = fs.readFileSync(resultFile, 'UTF-8');
        var correctJson = JSON.parse(correctOutput);
        correctJson.should.be.a('object');

        var bodyJson = JSON.parse(body);
        bodyJson.should.be.a('object');

        should.ok(helpers.compareArrays(bodyJson, correctJson),
          'Server\'s answer do not match the intended result');

        done();
      });
    });
  });
});