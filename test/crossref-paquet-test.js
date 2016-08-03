/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');


var logFile = path.join(__dirname, 'dataset/crossref-paquet.log');

var enrichOverwriteFields1 = '<publisher_name,<publication_title,<print_identifier';


describe('crossref consultations', function () {
  this.timeout(25000);
  it('should be correctly overwrited (@01 @big)', function (done) {
    var headers = {
      'Accept': 'application/json',
      'crossref-Enrich': 'true',
      'enrich-overwrite': 'true',
      'enrich-enabled-fields' : 'false',
      'enrich-overwrite-fields': enrichOverwriteFields1,
      'crossref-buffer-size' : '20'
    };
    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var result = JSON.parse(body);


      should.equal(result[0]['doi-ISSN'], '1932-5223');
      should.equal(result[1]['doi-ISSN'], '0962-1083');/* changer le title pub
     // should.equal(result[2]['doi-publication-title'], 'Journal of Avian Biology');
      //should.equal(result[3]['doi-publication-title'], 'Zoologica Scripta');
      should.equal(result[4]['doi-publication-title'], 'Diabetologia');
      //should.equal(result[5]['doi-publication-title'], 'Glycoconjugate Journal');
     // should.equal(result[6]['doi-publication-title'], 'ACS Nano');
     // should.equal(result[7]['doi-publisher'], 'The Endocrine Society');

     console.error(result[9]);
      should.equal(result[9]['doi-publication-title'], 'Czechoslovak Journal of Physics');
      should.equal(result[10]['doi-publisher'], '');
      should.equal(result[11]['doi-publication-title'], 'Methods in Molecular Biology');
      should.equal(result[12]['doi-publication-title'], 'Digestive Diseases and Sciences');
      should.equal(result[13]['doi-ISSN'], '1463-6409');
      should.equal(result[14]['doi-ISSN'], '1461-023X');
      should.equal(result[15]['doi-ISSN'], '1932-5223');
*/
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

