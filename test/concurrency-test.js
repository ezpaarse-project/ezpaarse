// ##EZPAARSE

/*global describe, it*/
'use strict';

const helpers  = require('./helpers.js');
const logF     = require('../lib/logfaker.js');
const should   = require('should');

const headers = {};

const launchRequest = function ({ minRate, maxRate, minDuration, maxDuration }) {
  return new Promise((resolve) => {
    const rate     = Math.floor(Math.random() * (maxRate - minRate + 1) + minRate);
    const duration = Math.floor(Math.random() * (maxDuration - minDuration + 1) + minDuration);

    logF.logFaker({ rate: rate, duration: duration }, function (stream) {
      helpers.postPiped('/', headers, stream, function (err, res, body) {

        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);
        should.ok(body !== '', 'One or more responses are empty');

        resolve(null);
      });
    });
  });
};

describe('The server', function () {
  this.timeout(30000);
  it('correctly handles short concurrent requests (@01 @big)', function (done) {
    const nbRequests  = 3;
    const requests = [];

    for (let i = 0; i < nbRequests; i++) {
      requests.push(launchRequest({
        minDuration: 3,
        maxDuration: 5,
        minRate: 800,
        maxRate: 2000,
      }));
    }


    Promise.all(requests)
      .then(() => done())
      .catch((err) => done(err));
  });

  this.timeout(0);
  it('correctly handles big concurrent requests (@02 @big)', function (done) {
    const nbRequests  = 15;
    const requests = [];

    for (let i = 0; i < nbRequests; i++) {
      requests.push(launchRequest({
        minDuration: 20,
        maxDuration: 30,
        minRate: 800,
        maxRate: 2000,
      }));
    }

    Promise.all(requests)
      .then(() => done())
      .catch((err) => done(err));
  });
});
