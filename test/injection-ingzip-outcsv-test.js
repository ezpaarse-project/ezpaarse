/*global describe, it*/
'use strict';

var helpers       = require('./helpers.js');
var fs            = require('fs');
var should        = require('should');
var csvextractor  = require('../lib/csvextractor.js');

var gzipLogFile   = __dirname + '/dataset/sd.2013-01-15.log.gz';
var csvResultFile = __dirname + '/dataset/sd.2013-01-15.result.csv';

describe('The server', function () {
  describe('receives a gzipped log file', function () {
    it('and sends back a correct csv output (@01)', function (done) {
      var headers = {
        'Accept'              : 'text/csv',
        'Content-encoding'    : 'gzip',
        'Anonymize-host'      : 'md5',
        'Double-Click-Removal': false
      };
      helpers.post('/', gzipLogFile, headers,
      function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        var stream = fs.createReadStream(csvResultFile);
        csvextractor.extract(stream, { silent: true }, function (err, correctRecords) {
          should.ok(err === null);
          csvextractor.extract([body], { silent: true }, function (err, bodyRecords) {
            should.ok(err === null);
            should.ok(helpers.equalJSONList(bodyRecords, correctRecords, true, ['status', 'size']),
              'The response of the server does not match the expected one');
            done();
          });
        });
      });
    });
  });
});