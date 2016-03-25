/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');

var logFile = path.join(__dirname, 'dataset/els-enrich.log');

function testEls(callback) {
  var headers = {
    'Accept': 'application/json',
    'elsevier-enrich': 'true',
    'traces-level': 'silly'
  };

  helpers.post('/', logFile, headers, function (err, res, body) {
    if (!res) { throw new Error('ezPAARSE is not running'); }
    if (err)  { throw err; }
    res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

    var result = JSON.parse(body);
    result.should.have.length(3);
    var ec = result[2];

    // test doi on 3rd log line
    should.equal(ec['els-doi'], '10.1016/j.devcel.2015.01.032');

    var reportURL = res.headers['job-report'];
    should.exist(reportURL, 'The header "Job-Report" was not sent by the server');

    helpers.get(reportURL, function (error, response, reportBody) {
      if (!response) { throw new Error('ezPAARSE is not running'); }
      if (error)     { throw error; }
      response.statusCode.should.equal(200,
        'failed to get the report, server responded with a code ' + response.statusCode);

      var report = JSON.parse(reportBody);
      report.should.have.property('general');
      report.general.should.have.property('elsevier-queries');
      report.general['elsevier-queries'].should.be.type('number');
      report.general['elsevier-enriched-ecs'].should.be.equal(1,
        'elsevier enriched requests may be exactly 1');
      callback();
    });
  });
}


describe('elsevier consultations', function () {
  it('should be correctly enriched (@01)', function (done) {
    testEls(function () {
      testEls(done);
    });
  });
});