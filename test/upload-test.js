// ##EZPAARSE

/*global describe, it*/
'use strict';

var should   = require('should');
var uuid     = require('uuid');
var helpers  = require('./helpers.js');
var logF     = require('../lib/logfaker.js');

var headers = {
  accept: 'application/json'
};

describe('The server', function () {

  this.timeout(20000);

  it('correctly handle a browser-like upload '
    + 'and multiple downloads of results (@01)', function (done) {
    var jobid = uuid.v1();

    logF.logFaker({ rate: 900, duration: 4 }, function (stream) {
      helpers.postPiped('/' + jobid + '/?_method=PUT', headers, stream, function (err, res, body) {

        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }

        // For a deferred result, the data must be written in a file and not in the body
        res.should.have.status(200);
        should.ok(body === '', 'The body is not empty');

        helpers.get('/' + jobid + '/', function (error1, response1, defBody1) {

          if (!response1) { throw new Error('ezPAARSE is not running'); }
          if (error1) { throw error1; }

          should.exist(defBody1);
          should.ok(defBody1.length, 'The second differed download is empty');
          var body1 = JSON.parse(defBody1);

          setTimeout(function () {
            helpers.get('/' + jobid + '/', function (error2, response2, defBody2) {

              if (!response2) { throw new Error('ezPAARSE is not running'); }
              if (error2) { throw error2; }

              should.exist(defBody2);
              should.ok(defBody2.length, 'The second differed download is empty');
              var body2 = JSON.parse(defBody2);

              should.ok(helpers.equals(body1, body2, true),
                'The server sent two different deferred results for the same upload');
              done();
            });
          }, 4500);
        });
      });
    });
  });
});