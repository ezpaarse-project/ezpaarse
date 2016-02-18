/*global describe, it*/
'use strict';

var fs      = require('fs');
var path    = require('path');
var should  = require('should');
var helpers = require('./helpers.js');

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
        should.ok(body.length == 4, 'The server should return 2 lines, but it returned ' +
          body.length);

        fs.readFile(multipleStatus, 'utf8', function (err, logContent) {
          if (err) { throw err; }

          logContent.should.containEql(body[0]);
          logContent.should.containEql(body[1]);
          should.ok(/(200|304|401|403) [0-9]+$/.test(body[0]), 'a line was not filtered');
          should.ok(/(200|304|401|403) [0-9]+$/.test(body[1]), 'a line was not filtered');
          done();
        });
      });
    });
  });
});