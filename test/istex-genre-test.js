/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');


var logFile = path.join(__dirname, 'dataset/istex-rtype-test.log');

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

      ///document/55420CDEEA0F6538E215A511C72E2E5E57570138/fulltext/original
      should.equal(result[0]['istex_genre'], 'brief-communication');
      should.equal(result[0]['istex_rtype'], 'fulltext');
      should.equal(result[0]['rtype'], 'ARTICLE');
      ///document/FFFFECE31185AD0CD6638205503ABBF7C3AEFBC3/metadata/xml
      should.equal(result[1]['istex_genre'], 'research-article');
      should.equal(result[1]['istex_rtype'], 'metadata');
      should.equal(result[1]['rtype'], 'METADATA');
      ///document/FFFFE83ADC4E41D5FC3E9EA789C66B8FE9723711/fulltext/pdf
      should.equal(result[3]['istex_genre'], 'research-article');
      should.equal(result[3]['istex_rtype'], 'fulltext');
      should.equal(result[3]['rtype'], 'ARTICLE');
      ///document/A3595E273E718E27C6A564EC1921FE503B86A597/fulltext/tiff
      should.equal(result[6]['istex_genre'], 'other');
      should.equal(result[6]['istex_rtype'], 'fulltext');
      should.equal(result[6]['rtype'], 'OTHER');
      ///document/FBB4ACBF88D191A9CB6F6F4EF851689C77E44940/fulltext/zip
      should.equal(result[7]['istex_genre'], 'article');
      should.equal(result[7]['istex_rtype'], 'fulltext');
      should.equal(result[7]['rtype'], 'ARTICLE');
      ///document/61EE26F30DB2B7E75E257B6BE5871011D163460C/fulltext/tei
      should.equal(result[11]['istex_genre'], 'collected-courses');
      should.equal(result[11]['istex_rtype'], 'fulltext');
      should.equal(result[11]['rtype'], 'BOOK');
      ///document/B213E8814A782C8F3F44E2F11EA00615F51405E7/fulltext/tei
      should.equal(result[13]['istex_genre'], 'chapter');
      should.equal(result[13]['istex_rtype'], 'fulltext');
      should.equal(result[13]['rtype'], 'BOOK_SECTION');
      ///document/41F22B20135237E68A6B7FB6D351B57BA2B7A22D/fulltext/tei
      should.equal(result[14]['istex_genre'], 'conference');
      should.equal(result[14]['istex_rtype'], 'fulltext');
      should.equal(result[14]['rtype'], 'BOOK');
      ///document/C831343BDABD9B0B23F9E11BAD486579D5DA98E6/fulltext/tei
      should.equal(result[15]['istex_genre'], 'book-reviews');
      should.equal(result[15]['istex_rtype'], 'fulltext');
      should.equal(result[15]['rtype'], 'ARTICLE');
      ///document/DDDC614762E3FDD265DA33A71A6FC81C670C9B22/fulltext/tei
      should.equal(result[16]['istex_genre'], 'case-report');
      should.equal(result[16]['istex_rtype'], 'fulltext');
      should.equal(result[16]['rtype'], 'ARTICLE');
      ///document/9A62AFAC9BF666F145FF2AD8D614548EE8410B8C/fulltext/tei
      should.equal(result[17]['istex_genre'], 'editorial');
      should.equal(result[17]['istex_rtype'], 'fulltext');
      should.equal(result[17]['rtype'], 'ARTICLE');
      ///document/7DD7EBA61BDD98457AD162C5AA7FE5DB2893F061/fulltext/tei
      should.equal(result[18]['istex_genre'], 'abstract');
      should.equal(result[18]['istex_rtype'], 'fulltext');
      should.equal(result[18]['rtype'], 'ABS');
      ///document/E8D367408302AE80C464B38829351ADFCC9AEF91/fulltext/tei
      should.equal(result[19]['istex_genre'], 'book-reviews');
      should.equal(result[19]['istex_rtype'], 'fulltext');
      should.equal(result[19]['rtype'], 'ARTICLE');
      ///document/C8568A855DF02A947DE9A0C674EAA630CC35B63E/annexes/ppt
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
