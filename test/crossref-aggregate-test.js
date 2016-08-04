/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');


var logFile = path.join(__dirname, 'dataset/cut.log');

describe('crossref consultations', function () {
  this.timeout(15000);
  it('should be correctly overwrited (@01 @big @tdd)', function (done) {
    // crossref-enrich has to be explicitly set due to helpers configuration
    var headers = {
      'Crossref-enrich': 'true',
      'Accept': 'application/json'
    };
    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var result = JSON.parse(body);
      result.should.be.an.instanceOf(Array).and.have.lengthOf(1);

      var ec = result[0];

      should.equal(ec['publisher_name'], 'American Chemical Society');
      should.equal(ec['publication_title'], 'ACS Nano');
      should.equal(ec['doi'], '10.1021/nn901499c');


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

        done();
      });
    });
  });
});

