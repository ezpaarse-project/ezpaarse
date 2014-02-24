// ##EZPAARSE

/*global describe, it*/
'use strict';

var helpers  = require('./helpers.js');
var logF     = require('../lib/logfaker.js');
var should   = require('should');
var request  = require('request');
var duration = 60;
var rate     = 10000;


var headers = {};

describe('The server', function () {

  this.timeout(0);

  it('bear high loads (@01 @big)', function (done) {

    var params = {};
    params.rate = rate;
    params.duration = duration;

    logF.logFaker(params, function (stream) {
      helpers.postPiped('/', headers, stream, function (err, res) {

        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        request({
          method: 'GET',
          url: res.headers['job-report']
        }, function (error, response, body) {

          if (!response) { throw new Error('ezPAARSE is not running'); }
          if (error)     { throw error; }

          var report = JSON.parse(body);

          should.exist(report['general'], 'the "general" section of the report is missing');
          should.ok(report['general']['Job-Done'] === true,
            'Job-Done in the report does not equal to true');

          done();
        });
      });
    });
  });
});