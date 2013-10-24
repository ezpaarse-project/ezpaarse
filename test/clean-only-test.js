/*global describe, it*/
'use strict';

var fs      = require('fs');
var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');

// var logFormat      = '%h %u %{session}<[a-zA-Z0-9\\-]+> %t "%r" %s';
var multipleStatus = path.join(__dirname, '/dataset/sd.multiple-status.log');

describe('The server', function () {
  describe('receives a log with multiple HTTP status codes', function () {
    it('and correctly filter them (@01)', function (done) {
      var headers = {
        'Accept': 'application/json',
        'Clean-Only': true
      };

      helpers.post('/', multipleStatus, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);
        should.exist(body);

        body = body.trim().split('\n');
        should.ok(body.length == 2, 'The server should return 2 lines, but it returned ' +
          body.length);

        var logContent = fs.readFileSync(multipleStatus, 'utf-8');
        logContent.should.contain(body[0]);
        logContent.should.contain(body[1]);
        done();
      });
    });
  });
});