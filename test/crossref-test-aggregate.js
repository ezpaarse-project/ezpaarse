/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');


var logFile = path.join(__dirname, 'dataset/cut.log');

function testCrossref(callback) {
  var headers = {
    'Accept': 'application/json',
    'crossref-Enrich': 'true',
    'enrich-overwrite': 'true',
    'enrich-overwrite-feilds': '<publisher_name,publication_title,>print_identifier'
  };

  helpers.post('/', logFile, headers, function (err, res, body) {
    if (!res) { throw new Error('ezPAARSE is not running'); }
    if (err)  { throw err; }
    res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

    var result = JSON.parse(body);
    result.should.have.length(1);

    var ec = result[0];

    should.equal(ec['doi-publisher'], 'Springer New York');
    should.equal(ec['print_identifier'], '2192-4791');


    var reportURL = res.headers['job-report'];
    should.exist(reportURL, 'The header "Job-Report" was not sent by the server');

    helpers.get(reportURL, function (error, response, reportBody) {
      if (!response) { throw new Error('ezPAARSE is not running'); }
      if (error)     { throw error; }
      response.statusCode.should.equal(200,
          'failed to get the report, server responded with a code ' + response.statusCode);

      var report = JSON.parse(reportBody);
      report.should.have.property('general');
      report.general.should.have.property('crossref-queries');
      report.general['crossref-queries'].should.be.type('number');
      report.general['crossref-queries'].should.be.below(2,
          'too many Crossref requests, one at least should be cached');

      callback();
    });
  });

}


describe('crossref consultations', function () {
  it('should be correctly enriched (@01)', function (done) {
    testCrossref(function() {
      testCrossref(done);
    });
  });
});