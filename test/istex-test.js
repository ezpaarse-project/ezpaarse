/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');


var logFile = path.join(__dirname, 'dataset/istex.log');

describe('istex consultations', function () {
  it('should be correctly enriched (@01)', function (done) {
    var headers = {
      'Accept': 'application/json',
      'Force-Parser': 'istex',
      'Istex-Enrich': true
    };

    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var result = JSON.parse(body);
      result.should.have.length(1);

      var ec = result[0];
      ///document/8ED667CADC019F039A46F48235A56EAADF51A825/fulltext/tei
      should.equal(ec['platform_name'], 'Istex');
      should.equal(ec['publication_date'], '1991');
      should.equal(ec['doi'], '10.1007/BF02653325');
      var reportURL = res.headers['job-report'];
      should.exist(reportURL, 'The header "Job-Report" was not sent by the server');

      helpers.get(reportURL, function (error, response, reportBody) {
        if (!response) { throw new Error('ezPAARSE is not running'); }
        if (error)     { throw error; }
        response.statusCode.should.equal(200,
          'failed to get the report, server responded with a code ' + response.statusCode);

        var report = JSON.parse(reportBody);
        report.should.have.property('general');
        report.general.should.have.property('Job-Done');
        report.general['Job-Done'].should.not.equal(false, 'Istex has not completed treatment');

        done();
      });
    });
  }).timeout(10000);
});
