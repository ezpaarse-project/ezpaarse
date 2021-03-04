/*global describe, it*/
/*eslint max-len: ["error", 120]*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');


var logFile = path.join(__dirname, 'dataset/crossref-paquet.log');


describe('crossref consultations', function () {
  this.timeout(25000);
  it('should correctly return  doi/pii package (@01 @tdd @big)', function (done) {
    // crossref-enrich has to be explicitly set due to helpers configuration
    var headers = {
      'Accept': 'application/json',
      'Crossref-enrich': 'true',
      'Crossref-buffer-size' : '20',
      'Traces-level': 'verbose'
    };
    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var result = JSON.parse(body);

      result.should.be.an.instanceOf(Array).and.have.lengthOf(61);

      should.equal(result[0]['type'], 'journal-article');
      should.equal(result[0]['doi'], '10.1002/jez.1990');

      should.equal(result[1]['type'], 'journal');
      should.equal(result[1]['doi'], '10.1111/(ISSN)1365-294X');

      should.equal(result[2]['type'], 'journal-article');
      should.equal(result[2]['doi'], '10.1111/jav.00619');

      should.equal(result[3]['publication_date'], '2015');
      should.equal(result[3]['doi'], '10.1111/zsc.12117');

      should.equal(result[4]['type'], 'journal-article');
      should.equal(result[4]['doi'], '10.1007/s00125-002-0828-3');

      should.equal(result[5]['type'], 'journal-article');
      should.equal(result[5]['print_identifier'], '0282-0080');
      should.equal(result[5]['online_identifier'], '1573-4986');
      should.equal(result[5]['doi'], '10.1007/s10719-015-9625-3');

      should.equal(result[6]['print_identifier'], '1936-0851');
      should.equal(result[6]['online_identifier'], '1936-086X');
      should.equal(result[6]['doi'], '10.1021/nn901499c');

      should.equal(result[7]['type'], 'book');
      should.equal(result[7]['doi'], '10.1210/MN1.9781936704842');

      should.equal(result[8]['type'], 'journal-article');
      should.equal(result[8]['doi'], '10.1210/jc.2014-3282');

      should.equal(result[9]['type'], 'journal-article');
      should.equal(result[9]['doi'], '10.1007/BF01597009');

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
        report.general['crossref-queries'].should.be.below(3);

        done();
      });
    });
  });
});

