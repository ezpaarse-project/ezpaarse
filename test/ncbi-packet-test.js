/*global describe, it*/
/*eslint max-len: ["error", 120]*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');

// Pull in the log file
var logFile = path.join(__dirname, 'dataset/ncbi-packet.log');

describe('NCBI consultations', function () {
  // 5 second timeout
  this.timeout(5000);

  it('should correctly return doi and journal information', function (done) {
    // Setup headers to load information
    var headers = {
      'Accept': 'application/json',
      'ncbi-enrichment': 'true',
      'ncbi-buffer-size' : '5',
      'ncbi-packet-size' : '5',
      'ncbi-cache': 'false',
      'Traces-level': 'verbose'
    };

    helpers.post('/', logFile, headers, function (err, res, body) {
      // Check that ezpaarse is running
      if (!res) { throw new Error('ezPAARSE is not running'); }
      // Throw an error if any occurs
      if (err)  { throw err; }

      // Check that the return code from the post command is successful
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      // Get the output result
      var result = JSON.parse(body);

      result.should.be.an.instanceOf(Array).and.have.lengthOf(10);

      should.equal(result[0]['publication_title'], 'Biosensors & Bioelectronics');
      should.equal(result[0]['doi'], '10.1016/j.bios.2020.112752');
      should.equal(result[0]['title'], 'COVID-19 diagnosis —A review of current methods');

      should.equal(result[1]['publication_title'], 'Biosensors & bioelectronics');
      should.equal(result[1]['doi'], '10.1016/j.bios.2020.112752');
      should.equal(result[1]['issn'], '0956-5663');
      should.equal(result[1]['essn'], '1873-4235');
      should.equal(result[1]['title'], 'COVID-19 diagnosis -A review of current methods.');

      // Check the report ncbi results
      var reportURL = res.headers['job-report'];
      should.exist(reportURL, 'The header "Job-Report" was not sent by the server');
      helpers.get(reportURL, function (error, response, reportBody) {
        if (!response) { throw new Error('ezPAARSE is not running'); }
        if (error)     { throw error; }

        response.statusCode.should.equal(200,
          'Failed to get the report, server responded with code: ' + response.statusCode);

        var report = JSON.parse(reportBody);

        report.should.have.property('ncbi');
        report.ncbi.should.have.property('ncbi-queries');
        report.ncbi.should.have.property('ncbi-enriched-count');
        report.ncbi.should.have.property('ncbi-query-fails');
        report.ncbi['ncbi-queries'].should.be.type('number');
        report.ncbi['ncbi-queries'].should.be.below(4);
        report.ncbi['ncbi-enriched-count'].should.be.equal(10);
        report.ncbi['ncbi-query-fails'].should.be.equal(0);

        done();
      });
    });
  });
});
