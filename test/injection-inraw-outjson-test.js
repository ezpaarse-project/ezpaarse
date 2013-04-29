/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers       = require('./helpers.js');
var fs            = require('fs');
var should        = require('should');
var csvextractor  = require('../lib/csvextractor.js');

var logFile               = __dirname + '/dataset/sd.2012-11-30.300.log';
var resultFile            = __dirname + '/dataset/sd.2012-11-30.300.result.json';

describe('The server', function () {
  describe('receives a log on the HTTP POST / route', function () {
    it('and sends back a well formatted output file', function (done) {
      var headers = {
        'Accept'        : 'application/json',
        'Anonymize-host': 'md5'
      };
      helpers.post('/', logFile, headers, function (error, res, body) {
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
        console.log(bodyJson);
        console.log(correctJson);
        should.ok(helpers.compareArrays(bodyJson, correctJson),
          'Server\'s answer do not match the intended result');

        done();
      });
    });
  });
});