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
      should.equal(result[0]['mime'], 'PDF');
      should.equal(result[0]['istex_rtype'], 'fulltext');
      should.equal(result[0]['rtype'], 'ARTICLE');

      should.equal(result[1]['mime'], 'XML');
      should.equal(result[1]['istex_rtype'], 'metadata');
      should.equal(result[1]['rtype'], 'METADATA');

      should.equal(result[2]['mime'], 'MODS');
      should.equal(result[2]['istex_rtype'], 'metadata');
      should.equal(result[2]['rtype'], 'METADATA');

      should.equal(result[3]['mime'], 'PDF');
      should.equal(result[3]['istex_rtype'], 'fulltext');
      should.equal(result[3]['rtype'], 'ARTICLE');

      should.equal(result[4]['mime'], 'TEI');
      should.equal(result[4]['istex_rtype'], 'fulltext');
      should.equal(result[4]['rtype'], 'ARTICLE');


      should.equal(result[5]['mime'], 'TEXT');
      should.equal(result[5]['istex_rtype'], 'fulltext');
      should.equal(result[5]['rtype'], 'ARTICLE');

      should.equal(result[6]['mime'], 'TIFF');
      should.equal(result[6]['istex_rtype'], 'fulltext');
      should.equal(result[6]['rtype'], 'OTHER');

      should.equal(result[7]['mime'], 'ZIP');
      should.equal(result[7]['istex_rtype'], 'fulltext');
      should.equal(result[7]['rtype'], 'ARTICLE');

      should.equal(result[8]['mime'], 'TEI');
      should.equal(result[8]['istex_rtype'], 'enrichments');
      should.equal(result[8]['rtype'], 'METADATA');

      should.equal(result[9]['mime'], 'TEI');
      should.equal(result[9]['istex_rtype'], 'enrichments');
      should.equal(result[9]['rtype'], 'METADATA');

      should.equal(result[10]['mime'], 'TEI');
      should.equal(result[10]['istex_rtype'], 'enrichments');
      should.equal(result[10]['rtype'], 'METADATA');

      should.equal(result[11]['mime'], 'TEI');
      should.equal(result[11]['istex_rtype'], 'enrichments');
      should.equal(result[11]['rtype'], 'METADATA');

      should.equal(result[12]['mime'], 'TIFF');
      should.equal(result[12]['istex_rtype'], 'covers');
      should.equal(result[12]['rtype'], 'MISC');

      should.equal(result[13]['mime'], 'JPEG');
      should.equal(result[13]['istex_rtype'], 'covers');
      should.equal(result[13]['rtype'], 'MISC');


      should.equal(result[14]['mime'], 'PDF');
      should.equal(result[14]['istex_rtype'], 'covers');
      should.equal(result[14]['rtype'], 'MISC');

      should.equal(result[15]['mime'], 'HTML');
      should.equal(result[15]['istex_rtype'], 'covers');
      should.equal(result[15]['rtype'], 'MISC');


      should.equal(result[16]['mime'], 'GIF');
      should.equal(result[16]['istex_rtype'], 'covers');
      should.equal(result[16]['rtype'], 'MISC');


      should.equal(result[17]['mime'], 'PDF');
      should.equal(result[17]['istex_rtype'], 'annexes');
      should.equal(result[17]['rtype'], 'MISC');


      should.equal(result[18]['mime'], 'JPEG');
      should.equal(result[18]['istex_rtype'], 'annexes');
      should.equal(result[18]['rtype'], 'MISC');


      should.equal(result[19]['mime'], 'QT');
      should.equal(result[19]['istex_rtype'], 'annexes');
      should.equal(result[19]['rtype'], 'MISC');

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
