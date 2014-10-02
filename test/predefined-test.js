/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var path    = require('path');

var upmcLogFile = path.join(__dirname, '/dataset/multiformat/ul.ezproxy.log');

describe('Sending a logfile with a non-standard format', function () {
  it('should result in a code 400 without a predefined setting (@01)', function (done) {

    var headers = {
      'ezPAARSE-enrich': 'false'
    };

    helpers.post('/', upmcLogFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(400, 'expected a status code of 400, got ' + res.statusCode);

      done();
    });
  });
  it('should result in a code 200 with a predefined setting (@01)', function (done) {

    var headers = {
      'ezPAARSE-enrich': 'false',
      'ezPAARSE-Predefined-Settings': '00-fr-univ-lorr'
    };

    helpers.post('/', upmcLogFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.statusCode.should.equal(200, 'expected a status code of 200, got ' + res.statusCode);

      done();
    });
  });
});
