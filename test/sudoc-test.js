/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');


var logFile = path.join(__dirname, 'dataset/es.sudoc.log');

function testSudoc(callback) {
  var headers = {
    'Accept': 'application/json',
    'sudoc-Enrich': 'true',
    'traces-level': 'silly'
  };

  helpers.post('/', logFile, headers, function (err, res, body) {
    if (!res) { throw new Error('ezPAARSE is not running'); }
    if (err)  { throw err; }
    res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

    var result = JSON.parse(body);
    result.should.have.length(3);
    var ec = result[0];

    // 1879-2065 => 83506357
    should.equal(ec['ppn'], '083506357');
    //should.equal(ec['sudoc-publisher'], 'The Endocrine Society');


    var reportURL = res.headers['job-report'];
    should.exist(reportURL, 'The header "Job-Report" was not sent by the server');

    helpers.get(reportURL, function (error, response, reportBody) {
      if (!response) { throw new Error('ezPAARSE is not running'); }
      if (error)     { throw error; }
      response.statusCode.should.equal(200,
        'failed to get the report, server responded with a code ' + response.statusCode);

      var report = JSON.parse(reportBody);
      report.should.have.property('general');
      report.general.should.have.property('sudoc-queries');
      report.general['sudoc-queries'].should.be.type('number');
      report.general['sudoc-queries'].should.be.below(3,
        'too many sudoc requests, one at least should be cached');

      callback();
    });
  });
}


describe('sudoc consultations', function () {
  it('should be correctly enriched (@01)', function (done) {
    testSudoc(function() {
      testSudoc(done);
    });
  });
});