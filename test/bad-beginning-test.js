/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var should  = require('should');
var path    = require('path');

var logFile = path.resolve(__dirname, 'dataset/sd.wrong-first-line.log');

describe('A file whose first line is incorrect', function () {
  it('is correctly processed by default (@01)', function (done) {
    var headers = {};

    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      should.ok(body === '', 'The body is not empty');
      res.should.have.status(200);
      res.headers.should.not.have.property('ezpaarse-status');
      res.headers.should.not.have.property('ezpaarse-status-message');
      done();
    });
  });
  it('results in a code 4003 if the Max-Parse-Attempts is set to 1 (@02)', function (done) {
    var headers = {
      'Max-Parse-Attempts': 1
    };

    helpers.post('/', logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      should.ok(body === '', 'The body is not empty');
      res.should.have.status(400);
      res.headers.should.have.property('ezpaarse-status');
      res.headers.should.have.property('ezpaarse-status-message');
      var status = res.headers['ezpaarse-status'];
      status.should.equal('4003', 'ezPAARSE returned a wrong status header');
      done();
    });
  });
});