/*global describe, it*/
'use strict';

var path    = require('path');
var request = require('request');
var should  = require('should');
var helpers = require('./helpers.js');

var logFile = path.join(__dirname, '/dataset/sd.mini.log');

describe('The server', function () {
  describe('receives a log file', function () {
    it('and correctly generate the report (@01)', function (done) {
      var headers = {
        'Accept' : 'text/csv'
      };
      helpers.post('/', logFile, headers, function (err, res) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        var logURL = res.headers['job-report'];
        var jobID  = res.headers['job-id'];
        should.exist(logURL,
          'The header "Job-Report" was not sent by the server');
        should.exist(jobID,
          'The header "Job-ID" was not sent by the server');

        helpers.get(logURL, function (error, response, reportBody) {
          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }
          res.should.have.status(200);

          var report = JSON.parse(reportBody);

          should.exist(report.general,
            'the section "general" was not found in the report');
          should.exist(report.general['Job-ID'],
            'Job-ID was not found in the report');
          should.exist(report.general['Job-Done'],
            'Job-Done was not found in the report');
          should.exist(report.general['nb-lines-input'],
            'nb-lines-input was not found in the report');

          report.general['Job-ID'].should.equal(jobID,
            'The job ID in the report is not the one expected');
          should.ok(report.general['Job-Done'] === true,
            'The flag "Job-Done" has not be set to TRUE');
          report.general['nb-lines-input'].should.equal(2,
            'nb-lines-input should equal 2');

          done();
        });
      });
    });
  });
});