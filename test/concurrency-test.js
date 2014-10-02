// ##EZPAARSE

/*global describe, it*/
'use strict';

var helpers  = require('./helpers.js');
var logF     = require('../lib/logfaker.js');
var should   = require('should');
var async    = require('async');

var headers = {};

describe('The server', function () {
  this.timeout(15000);
  it('correctly handles short concurrent requests (@01)', function (done) {
    var nbRequests  = 3;
    var maxDuration = 5;
    var minDuration = 3;
    var maxRate     = 2000;
    var minRate     = 800;

    var getLaunchFunction = function () {
      var launchRequest = function (callback) {
        var rate     = Math.floor(Math.random() * (maxRate - minRate + 1) + minRate);
        var duration = Math.floor(Math.random() * (maxDuration - minDuration + 1) + minDuration);

        logF.logFaker({ rate: rate, duration: duration }, function (stream) {
          helpers.postPiped('/', headers, stream, function (err, res, body) {

            if (!res) { throw new Error('ezPAARSE is not running'); }
            if (err)  { throw err; }
            res.should.have.status(200);
            should.ok(body !== '', 'One or more responses are empty');

            callback(null);
          });
        });
      };

      return launchRequest;
    };

    var requests = [];
    for (var i = 0; i < nbRequests; i++) {
      requests.push(getLaunchFunction());
    }

    async.parallel(requests, done);
  });

  this.timeout(0);
  it('correctly handles big concurrent requests (@02 @big)', function (done) {
    var nbRequests  = 15;
    var maxDuration = 30;
    var minDuration = 20;
    var maxRate     = 2000;
    var minRate     = 800;

    var getLaunchFunction = function () {
      var launchRequest = function (callback) {
        var rate     = Math.floor(Math.random() * (maxRate - minRate + 1) + minRate);
        var duration = Math.floor(Math.random() * (maxDuration - minDuration + 1) + minDuration);

        logF.logFaker({ rate: rate, duration: duration }, function (stream) {
          helpers.postPiped('/', headers, stream, function (err, res, body) {

            if (!res) { throw new Error('ezPAARSE is not running'); }
            if (err)  { throw err; }
            res.should.have.status(200);
            should.ok(body !== '', 'One or more responses are empty');

            callback(null);
          });
        });
      };

      return launchRequest;
    };

    var requests = [];
    for (var i = 0; i < nbRequests; i++) {
      requests.push(getLaunchFunction());
    }

    async.parallel(requests, done);
  });
});