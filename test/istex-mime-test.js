/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');


var logFile = path.join(__dirname, 'dataset/istex-mime-test.log');

describe('istex consultations test mime', function () {
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
      should.equal(result[0]['mime'], 'PDF');
      should.equal(result[0]['istex_rtype'], 'fulltext');
      should.equal(result[0]['rtype'], 'ARTICLE');
      ///document/FFFFECE31185AD0CD6638205503ABBF7C3AEFBC3/metadata/xml
      should.equal(result[1]['mime'], 'XML');
      should.equal(result[1]['istex_rtype'], 'metadata');
      should.equal(result[1]['rtype'], 'METADATA');
      ///document/FFFFD010AA7CB80B5EE02241C77FBB354F17278B/metadata/mods
      should.equal(result[2]['mime'], 'MODS');
      should.equal(result[2]['istex_rtype'], 'metadata');
      should.equal(result[2]['rtype'], 'METADATA');
      ///document/FFFFE83ADC4E41D5FC3E9EA789C66B8FE9723711/fulltext/pdf
      should.equal(result[3]['mime'], 'PDF');
      should.equal(result[3]['istex_rtype'], 'fulltext');
      should.equal(result[3]['rtype'], 'ARTICLE');
      ///document/FFFE0102381DC1DE4474C134B5371550F8B42137/fulltext/tei
      should.equal(result[4]['mime'], 'TEI');
      should.equal(result[4]['istex_rtype'], 'fulltext');
      should.equal(result[4]['rtype'], 'ARTICLE');
      ///document/63405002ACBE7356897E94747F8C3DB514537881/fulltext/txt
      should.equal(result[5]['mime'], 'TEXT');
      should.equal(result[5]['istex_rtype'], 'fulltext');
      should.equal(result[5]['rtype'], 'ARTICLE');
      ///document/A3595E273E718E27C6A564EC1921FE503B86A597/fulltext/tiff
      should.equal(result[6]['mime'], 'TIFF');
      should.equal(result[6]['istex_rtype'], 'fulltext');
      should.equal(result[6]['rtype'], 'OTHER');
      ///document/FBB4ACBF88D191A9CB6F6F4EF851689C77E44940/fulltext/zip
      should.equal(result[7]['mime'], 'ZIP');
      should.equal(result[7]['istex_rtype'], 'fulltext');
      should.equal(result[7]['rtype'], 'ARTICLE');
      ///document/FEF92F6FF38DF114C5ADC56167B4C787E208883F/enrichments/catWos
      should.equal(result[8]['mime'], 'TEI');
      should.equal(result[8]['istex_rtype'], 'enrichments');
      should.equal(result[8]['rtype'], 'METADATA');
      ///document/FED05D0C6F49D6B0F0D0BA345C1822DCA14CFC00/enrichments/refBib
      should.equal(result[9]['mime'], 'TEI');
      should.equal(result[9]['istex_rtype'], 'enrichments');
      should.equal(result[9]['rtype'], 'METADATA');
      ///document/AF48586B716E282324FC512E5C93CB3E2A4689DC/enrichments/refbib
      should.equal(result[10]['mime'], 'TEI');
      should.equal(result[10]['istex_rtype'], 'enrichments');
      should.equal(result[10]['rtype'], 'METADATA');
      ///document/AF48586B716E282324FC512E5C93CB3E2A4689DC/enrichments/refbib?consolidate
      should.equal(result[11]['mime'], 'TEI');
      should.equal(result[11]['istex_rtype'], 'enrichments');
      should.equal(result[11]['rtype'], 'METADATA');
      ///document/AEEBE0D622E19D3ABC2518DF6B5965F5C9D29E1C/covers/tiff
      should.equal(result[12]['mime'], 'TIFF');
      should.equal(result[12]['istex_rtype'], 'covers');
      should.equal(result[12]['rtype'], 'MISC');
      ///document/AB9A8321DE26ACFC43471325B764DD42B28C300E/covers/jpeg
      should.equal(result[13]['mime'], 'JPEG');
      should.equal(result[13]['istex_rtype'], 'covers');
      should.equal(result[13]['rtype'], 'MISC');
      ///document/908057129A93AE346BD156BE836458F0F32B7A4E/covers/pdf
      should.equal(result[14]['mime'], 'PDF');
      should.equal(result[14]['istex_rtype'], 'covers');
      should.equal(result[14]['rtype'], 'MISC');
      ///document/1BD54174CCDE70CCDCAF3E46073C43709883F2D5/covers/html
      should.equal(result[15]['mime'], 'HTML');
      should.equal(result[15]['istex_rtype'], 'covers');
      should.equal(result[15]['rtype'], 'MISC');
      ///document/F7043DBE029C8727C1A2585E3E4FFD1A8054C96D/covers/gif
      should.equal(result[16]['mime'], 'GIF');
      should.equal(result[16]['istex_rtype'], 'covers');
      should.equal(result[16]['rtype'], 'MISC');
      ///document/E9659ED3168C9080264B49FD9D39AA8CCA33F61B/annexes/pdf
      should.equal(result[17]['mime'], 'PDF');
      should.equal(result[17]['istex_rtype'], 'annexes');
      should.equal(result[17]['rtype'], 'MISC');
      ///document/CA5D21E36EBDC44FE8BFEC188DD5D8445E41559F/annexes/jpeg
      should.equal(result[18]['mime'], 'JPEG');
      should.equal(result[18]['istex_rtype'], 'annexes');
      should.equal(result[18]['rtype'], 'MISC');
      ///document/4DDACF7F59E85A50A7BFA53896DA6891AFDC466B/annexes/qt
      should.equal(result[19]['mime'], 'QT');
      should.equal(result[19]['istex_rtype'], 'annexes');
      should.equal(result[19]['rtype'], 'MISC');
      ///document/C8568A855DF02A947DE9A0C674EAA630CC35B63E/annexes/ppt
      should.equal(result[20]['mime'], 'PPT');
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
