/* global describe, it */
'use strict';

const path = require('path');
const should = require('should');
const helpers = require('./helpers.js');

const logFile = path.join(__dirname, '/dataset/multi-platforms.log');

describe('The server', function () {
  it('should filter specified platforms and ignore the other (@01)', function (done) {
    const headers = {
      'Accept': 'application/json',
      'Filter-Platforms': 'wiley,springer'
    };
    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) {
        throw new Error('ezPAARSE is not running');
      }
      if (err) {
        throw err;
      }

      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      const result = JSON.parse(body);
      result.should.have.length(2);
      result[0].should.have.property('platform', 'wiley');
      result[1].should.have.property('platform', 'springer');

      const reportURL = res.headers['job-report'];
      should.exist(reportURL, 'The header "Job-Report" was not sent by the server');

      helpers.get(reportURL, function (error, response, reportBody) {
        if (!response) { throw new Error('ezPAARSE is not running'); }
        if (error)     { throw error; }

        response.statusCode.should.equal(200,
          'failed to get the report, server responded with a code ' + response.statusCode);

        const report = JSON.parse(reportBody);
        report.should.have.property('rejets');
        report.rejets.should.have.property('nb-lines-ignored', 1);

        done();
      });
    });
  });
});
