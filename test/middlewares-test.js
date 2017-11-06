/*global describe, it*/
'use strict';

const helpers = require('./helpers.js');
const path    = require('path');
const should  = require('should');

const logFile = path.join(__dirname, '/dataset/sd.mini.log');

describe('The server', function () {
  describe('receives the ezPAARSE-middlewares header with the "only" predicate', function () {
    it('and uses only the specified middlewares (@01)', function (done) {
      const headers = {
        'Accept': 'application/json',
        'ezPAARSE-Middlewares': '(only) anonymizer, parser'
      };

      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        const bodyJson = JSON.parse(body);
        bodyJson.should.be.an.instanceOf(Array);
        bodyJson.should.have.length(2);

        const reportURL = res.headers['job-report'];
        should.exist(reportURL, 'The header "Job-Report" was not sent by the server');

        helpers.get(reportURL, function (error, response, reportBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          res.should.have.status(200);

          const report = JSON.parse(reportBody);

          should.exist(report.general, 'the section "general" was not found in the report');
          should.exist(report.general.middlewares,
            'middlewares field is missing in the report'
          );

          const middlewares = report.general.middlewares.split(',').map(m => m.trim());
          middlewares.should.have.length(2);
          middlewares[0].should.equal('anonymizer');
          middlewares[1].should.equal('parser');

          done();
        });
      });
    });
  });
});
