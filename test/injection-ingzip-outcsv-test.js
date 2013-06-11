/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
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
        'Accept'           : 'text/csv',
        'Content-encoding' : 'gzip',
        'Anonymize-host'   : 'md5'
      };
      helpers.post('/', gzipLogFile, headers,
      function (error, res, body) {
        if (error) {
          throw error;
        }
        if (!res) {
          throw new Error('The application is not running');
        }
        res.should.have.status(200);

        csvextractor.extract(fs.createReadStream(csvResultFile), [], function (correctRecords) {
          csvextractor.extract([body], [], function (bodyRecords) {
            should.ok(helpers.compareArrays(bodyRecords, correctRecords),
              'The response of the server does not match the expected one');
            done();
          }, {silent: true});
        }, {silent: true});
      });
    });
  });
});