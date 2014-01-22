/*global describe, it*/
'use strict';

var helpers   = require('./helpers.js');
var fs        = require('fs');
var should    = require('should');
var xmlParser = require('xml2js').Parser;
var request   = require('request');
var cfg       = require('../lib/config.js');

var logFile = __dirname + '/dataset/sd.jr1.log';
var xmlFile = __dirname + '/dataset/sd.jr1.xml';
var csvFile = __dirname + '/dataset/sd.jr1.csv';

describe('The server', function () {
  it('generates a correct XML JR1 report (@01)', function (done) {
    var headers = {
      'COUNTER-Reports': 'JR1',
      'COUNTER-Format': 'XML',
    };
    helpers.post('/', logFile, headers,
    function (err, res) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.should.have.status(200);

      var logURL = res.headers['job-report-jr1'];
      should.exist(logURL,
        'The header "Job-Report-JR1" was not sent by the server');

      request.get(logURL, function (error, response, body) {
        if (!response) { throw new Error('ezPAARSE is not running'); }
        if (error)     { throw error; }
        response.should.have.status(200);

        var parser = new xmlParser({ explicitArray: false });
        parser.parseString(body, function (err, result) {
          if (err) { throw err; }

          var xmlModel = fs.readFileSync(xmlFile);
          parser.parseString(xmlModel, function (err, expected) {
            if (err) { throw err; }

            // Remove all dates, because they can differ depending on locale
            delete expected.Report.$.Created;
            delete result.Report.$.Created;
            result.Report.Customer.ReportItems.map(function (item) {
              return item.ItemPerformance.map(function (subitem) {
                delete subitem.Period;
                return subitem;
              });
            });
            expected.Report.Customer.ReportItems.map(function (item) {
              return item.ItemPerformance.map(function (subitem) {
                delete subitem.Period;
                return subitem;
              });
            });

            // Admin mail in the model could have been changed
            expected.Report.Customer.Contact['E-mail'] = cfg.EZPAARSE_ADMIN_MAIL;

            should.ok(helpers.equals(result, expected), 'The result does not match the model');

            done();
          });
        });
      });
    });
  });

  it('generates a correct CSV JR1 report (@02)', function (done) {
    var headers = {
      'COUNTER-Reports': 'JR1',
      'COUNTER-Format': 'CSV'
    };
    helpers.post('/', logFile, headers,
    function (err, res) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.should.have.status(200);

      var logURL = res.headers['job-report-jr1'];
      should.exist(logURL,
        'The header "Job-Report-JR1" was not sent by the server');

      request.get(logURL, function (error, response, body) {
        if (!response) { throw new Error('ezPAARSE is not running'); }
        if (error)     { throw error; }
        response.should.have.status(200);

        var expected = fs.readFileSync(csvFile).toString().split('\n');
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