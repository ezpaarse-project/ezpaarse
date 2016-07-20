/* eslint no-sync: 0 */
/*global describe, it*/
'use strict';

var helpers   = require('./helpers.js');
var fs        = require('fs');
var path      = require('path');
var should    = require('should');
var xmlParser = require('xml2js').Parser;
var cfg       = require('../lib/config.js');

var logFile = path.resolve(__dirname, 'dataset/npg.jr1.log');
var xmlFile = path.resolve(__dirname, 'dataset/npg.jr1.xml');
var tsvFile = path.resolve(__dirname, 'dataset/npg.jr1.txt');

describe('The server', function () {
  it('generates a correct XML JR1 report (@01)', function (done) {
    var headers = {
      'COUNTER-Reports': 'JR1',
      'COUNTER-Format': 'XML'
    };

    helpers.post('/', logFile, headers, function (err, res) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var logURL = res.headers['job-report-jr1'];
      should.exist(logURL,
        'The header "Job-Report-JR1" was not sent by the server');

      helpers.get(logURL, function (error, response, body) {
        if (!response) { throw new Error('ezPAARSE is not running'); }
        if (error)     { throw error; }
        response.statusCode.should.equal(200, 'expected 200, got ' + response.statusCode);

        checkXml(body, done);
      });
    });
  });

  function checkXml(body, done) {
    var parser = new xmlParser({ explicitArray: false });
    parser.parseString(body, function (err, result) {
      if (err) { throw err; }

      var xmlModel = fs.readFileSync(xmlFile);
      parser.parseString(xmlModel, function (err, expected) {
        if (err) { throw err; }

        // Remove all dates, because they can differ depending on locale
        delete expected.ReportResponse.$.Created;
        delete result.ReportResponse.$.Created;

        delete expected.ReportResponse.Report.$.Created;
        delete result.ReportResponse.Report.$.Created;

        delete expected.ReportResponse.ReportDefinition.Filters.UsageDateRange;
        delete result.ReportResponse.ReportDefinition.Filters.UsageDateRange;

        result.ReportResponse.Report.Customer.ReportItems.map(function (item) {
          return item.ItemPerformance.map(function (subitem) {
            delete subitem.Period;
            return subitem;
          });
        });
        expected.ReportResponse.Report.Customer.ReportItems.map(function (item) {
          return item.ItemPerformance.map(function (subitem) {
            delete subitem.Period;
            return subitem;
          });
        });

        // Admin mail in the model could have been changed
        expected.ReportResponse.Report.Customer.Contact['E-mail'] = cfg.EZPAARSE_ADMIN_MAIL;

        should.ok(helpers.equals(result, expected), 'The result does not match the model');

        done();
      });
    });
  }

  it('generates a correct TSV JR1 report (@02)', function (done) {
    var headers = {
      'COUNTER-Reports': 'JR1',
      'COUNTER-Format': 'TSV'
    };
    helpers.post('/', logFile, headers, function (err, res) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

      var logURL = res.headers['job-report-jr1'];
      should.exist(logURL,
        'The header "Job-Report-JR1" was not sent by the server');

      helpers.get(logURL, function (error, response, body) {
        if (!response) { throw new Error('ezPAARSE is not running'); }
        if (error)     { throw error; }
        response.statusCode.should.equal(200, 'expected 200, got ' + response.statusCode);

        var expected = fs.readFileSync(tsvFile).toString().split('\n');
        body = (body || '').split('\n');

        // Remove all dates, because they can differ depending on locale
        expected.splice(6, 1);
        body.splice(6, 1);
        expected.splice(4, 1);
        body.splice(4, 1);

        should.ok(helpers.equals(body, expected), 'The result does not match the model');
        done();
      });
    });
  });
});
