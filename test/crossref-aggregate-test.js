/*global describe, it*/
'use strict';

var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');


var logFile = path.join(__dirname, 'dataset/cut.log');

var enrichOverwriteFields1 = 'publisher_name,publication_title,print_identifier';
var enrichOverwriteFields2 = '<publisher_name,<publication_title,<print_identifier';
var enrichOverwriteFields3 = '<publisher_name,publication_title,print_identifier';
var enrichOverwriteFields4 = '>publisher_name,<publication_title,print_identifier';

describe('crossref consultations', function () {
  this.timeout(15000);
  it('should be correctly overwrited (@01 @big)', function (done) {
    var headers = {
      'Accept': 'application/json',
      'crossref-Enrich': 'true',
      'enrich-overwrite': 'true',
      'enrich-overwrite-fields': enrichOverwriteFields1,
      'crossref-buffer-size' : '1'
    };
    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var result = JSON.parse(body);
      result.should.have.length(1);

      var ec = result[0];

      should.equal(ec['doi-publisher'], 'American Chemical Society (ACS)');
      should.equal(ec['publication_title'], 'ACS Nano');
      should.equal(ec['publisher_name'], 'American Chemical Society (ACS)');

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



describe('crossref consultations', function () {
  this.timeout(15000);
  it('should be correctly overwrited (@02  @big)', function (done) {
    var headers = {
      'Accept': 'application/json',
      'crossref-Enrich': 'true',
      'enrich-overwrite': 'true',
      'enrich-enabled-fields': 'false',
      'crossref-buffer-size' : '1',
      'enrich-overwrite-fields': enrichOverwriteFields2
    };
    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var result = JSON.parse(body);
      result.should.have.length(1);

      var ec = result[0];

      should.equal(ec['doi-publisher'], 'American Chemical Society (ACS)');
      should.equal(ec['publication_title'], 'ACS Nano');
      should.equal(ec['publisher_name'], 'American Chemical Society');

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

describe('crossref consultations', function () {
  this.timeout(15000);
  it('should be correctly overwrited (@03 @big)', function (done) {
    var headers = {
      'Accept': 'application/json',
      'crossref-Enrich': 'true',
      'enrich-overwrite': 'true',
      'crossref-buffer-size' : '1',
      'enrich-overwrite-fields': enrichOverwriteFields3
    };
    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var result = JSON.parse(body);
      result.should.have.length(1);

      var ec = result[0];

      should.equal(ec['doi-publisher'], 'American Chemical Society (ACS)');
      should.equal(ec['publication_title'], 'ACS Nano');
      should.equal(ec['publisher_name'], 'American Chemical Society');

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

describe('crossref consultations', function () {
  this.timeout(15000);
  it('should be correctly overwrited (@04  @big)', function (done) {
    var headers = {
      'Accept': 'application/json',
      'crossref-Enrich': 'true',
      'enrich-overwrite': 'true',
      'crossref-buffer-size' : '1',
      'enrich-overwrite-fields': enrichOverwriteFields4
    };
    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var result = JSON.parse(body);
      result.should.have.length(1);

      var ec = result[0];

      should.equal(ec['doi-publisher'], 'American Chemical Society (ACS)');
      should.equal(ec['publication_title'], 'ACS Nano');
      should.equal(ec['publisher_name'], 'American Chemical Society (ACS)');

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