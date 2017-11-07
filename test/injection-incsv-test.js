/*global describe, it*/
'use strict';

var helpers       = require('./helpers.js');
var fs            = require('fs');
var path          = require('path');
var should        = require('should');

var logFile    = path.join(__dirname, '/dataset/sd.2012-11-30.300.csv');
var resultFile = path.join(__dirname, '/dataset/sd.2012-11-30.300.result.json');

describe('The server', function () {
  describe('receives a CSV on the HTTP POST / route', function () {
    it('and sends back a well formatted JSON file (@01)', function (done) {
      var headers = {
        'Content-Type'        : 'text/csv',
        'Accept'              : 'application/json',
        'Crypted-Fields'      : 'none',
        'Crossref-Enrich'     : false,
        'Double-Click-Removal': false
      };
      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        fs.readFile(resultFile, function (err, correctOutput) {
          if (err) { throw err; }

          var correctJson = JSON.parse(correctOutput);
          var bodyJson    = JSON.parse(body);

          correctJson.should.be.an.instanceOf(Array);
          bodyJson.should.be.an.instanceOf(Array);
          should.ok(helpers.equalJSONList(bodyJson, correctJson, true, ['datetime']),
            'Server\'s answer do not match the intended result');

          done();
        });
      });
    });

    it('and adds all columns to output fields (@02)', function (done) {
      var headers = {
        'Content-Type'        : 'text/csv',
        'Accept'              : 'text/csv',
        'Crypted-Fields'      : 'none',
        'Crossref-Enrich'     : false,
        'Double-Click-Removal': false
      };
      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        fs.readFile(logFile, 'utf8', function (err, input) {
          if (err) { throw err; }

          const inputColumns = input.split('\n')[0].split(';');
          const outputColumns = body.split('\n')[0].split(';');

          inputColumns.forEach(column => {
            should.ok(outputColumns.includes(column), `column "${column}" is missing`);
          });

          done();
        });
      });
    });
  });
});
