/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');


var logFile = path.join(__dirname, 'dataset/test-trype-istex.log');

describe('istex consultations rtype', function () {
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
      result.should.be.an.instanceOf(Array).and.have.lengthOf(21);
      should.equal(result[0]['istex_genre'], 'brief-communication');
      should.equal(result[0]['istex_rtype'], 'fulltext');
      should.equal(result[0]['rtype'], 'ARTICLE');

      should.equal(result[1]['istex_genre'], 'research-article');
      should.equal(result[1]['istex_rtype'], 'metadata');
      should.equal(result[1]['rtype'], 'METADATA');

      should.equal(result[3]['istex_genre'], 'research-article');
      should.equal(result[3]['istex_rtype'], 'fulltext');
      should.equal(result[3]['rtype'], 'ARTICLE');

      should.equal(result[6]['istex_genre'], 'other');
      should.equal(result[6]['istex_rtype'], 'fulltext');
      should.equal(result[6]['rtype'], 'OTHER');

      should.equal(result[7]['istex_genre'], 'article');
      should.equal(result[7]['istex_rtype'], 'fulltext');
      should.equal(result[7]['rtype'], 'ARTICLE');

      should.equal(result[20]['istex_genre'], 'review-article');
      should.equal(result[20]['istex_rtype'], 'annexes');
      should.equal(result[20]['rtype'], 'MISC');


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
  });
});
