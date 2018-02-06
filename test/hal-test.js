/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');

var logFile = path.join(__dirname, 'dataset/hal.log');

describe('HAL consultations', function () {
  it('should be correctly enriched (@01)', function (done) {
    var headers = {
      'Accept': 'application/json',
      'Force-Parser': 'hal',
      'HAL-Enrich': 'true'
    };

    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var result = JSON.parse(body);
      result.should.have.length(2);

      should.equal(result[0].docid, '673420');
      should.equal(result[1].docid, '673420');

      var reportURL = res.headers['job-report'];
      should.exist(reportURL, 'The header "Job-Report" was not sent by the server');

      helpers.get(reportURL, function (error, response, reportBody) {
        if (!response) { throw new Error('ezPAARSE is not running'); }
        if (error)     { throw error; }
        response.statusCode.should.equal(200,
          'failed to get the report, server responded with a code ' + response.statusCode);

        var report = JSON.parse(reportBody);
        report.should.have.property('general');
        report.general.should.have.property('hal-queries');
        report.general['hal-queries'].should.be.type('number');
        report.general['hal-queries'].should.be.below(2,
          'too many HAL requests, one at least should be cached');

        done();
      });
    });
  });
});