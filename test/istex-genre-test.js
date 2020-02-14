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
      'Istex-Enrich': true,
      'Istex-Cache': false
    };

    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var result = JSON.parse(body);
      result.should.be.an.instanceOf(Array).and.have.lengthOf(17);

      // [istex_genre, istex_rtype, rtype]
      const expected = [
        // /document/55420CDEEA0F6538E215A511C72E2E5E57570138/fulltext/original
        ['brief-communication', 'fulltext', 'ARTICLE' ],
        // /document/FFFFECE31185AD0CD6638205503ABBF7C3AEFBC3/metadata/xml
        ['research-article', 'metadata', 'METADATA' ],
        // /document/FFFFD010AA7CB80B5EE02241C77FBB354F17278B/metadata/mods
        ['book-reviews', 'metadata', 'METADATA'],
        // /document/FFFFE83ADC4E41D5FC3E9EA789C66B8FE9723711/fulltext/pdf
        ['research-article', 'fulltext', 'ARTICLE' ],
        // /document/A3595E273E718E27C6A564EC1921FE503B86A597/fulltext/tiff
        ['other', 'fulltext', 'OTHER' ],
        // /document/FBB4ACBF88D191A9CB6F6F4EF851689C77E44940/fulltext/zip
        ['article', 'fulltext', 'ARTICLE' ],
        // /document/FEF92F6FF38DF114C5ADC56167B4C787E208883F/enrichments/catWos
        ['research-article', 'enrichments', 'METADATA'],
        // /document/CBD4E08CC85C30F77BAFE20017E8E198AD41CA45/fulltext/tei
        ['collected-courses', 'fulltext', 'BOOK' ],
        // /document/0C7B31AD3DF088BD3D1F1849326C48D3DFD10068/fulltext/tei
        ['book-reviews', 'fulltext', 'ARTICLE'],
        // /document/3B5F4FCE604FD4CC7F8D1483527C0661046FC72C/fulltext/tei
        ['chapter', 'fulltext', 'BOOK_SECTION' ],
        // /document/41F22B20135237E68A6B7FB6D351B57BA2B7A22D/fulltext/tei
        ['conference', 'fulltext', 'BOOK' ],
        // /document/DDDC614762E3FDD265DA33A71A6FC81C670C9B22/fulltext/tei
        ['case-report', 'fulltext', 'ARTICLE' ],
        // /document/9A62AFAC9BF666F145FF2AD8D614548EE8410B8C/fulltext/tei
        ['editorial', 'fulltext', 'ARTICLE' ],
        // /document/7DD7EBA61BDD98457AD162C5AA7FE5DB2893F061/fulltext/tei
        ['abstract', 'fulltext', 'ABS' ],
        // /document/E8D367408302AE80C464B38829351ADFCC9AEF91/fulltext/tei
        ['book-reviews', 'fulltext', 'ARTICLE' ],
        // /document/C8568A855DF02A947DE9A0C674EAA630CC35B63E/annexes/ppt
        ['review-article', 'annexes', 'MISC' ],
        // /ark:/67375/NVC-CGWCQNDK-X/record.json
        ['research-article', 'record', 'METADATA' ]
      ];

      result.forEach((ec, index) => {
        should.equal(ec['istex_genre'], expected[index][0]);
        should.equal(ec['istex_rtype'], expected[index][1]);
        should.equal(ec['rtype'], expected[index][2]);
      });

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
