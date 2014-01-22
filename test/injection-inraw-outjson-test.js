/*global describe, it*/
'use strict';

var helpers       = require('./helpers.js');
var fs            = require('fs');
var path          = require('path');
var should        = require('should');

var logFile    = path.join(__dirname, '/dataset/sd.2012-11-30.300.log');
var resultFile = path.join(__dirname, '/dataset/sd.2012-11-30.300.result.json');

describe('The server', function () {
  describe('receives a log on the HTTP POST / route', function () {
    it('and sends back a well formatted output file (@01)', function (done) {
      var headers = {
        'Accept'              : 'application/json',
        'Anonymize-host'      : 'md5',
        'Double-Click-Removal': false
      };
      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        var correctOutput = fs.readFileSync(resultFile, 'UTF-8');
        var correctJson   = JSON.parse(correctOutput);
        var bodyJson      = JSON.parse(body);

        correctJson.should.be.an.instanceOf(Array);
        bodyJson.should.be.an.instanceOf(Array);
        should.ok(helpers.equals(bodyJson, correctJson, true),
          'Server\'s answer do not match the intended result');

        done();
      });
    });
  });
});