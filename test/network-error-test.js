/*global describe, it*/
'use strict';

var helpers       = require('./helpers.js');
var fs            = require('fs');
var should        = require('should');
var logF          = require('../lib/logfaker.js');
var lsof          = require('lsof');

// to check the number of open file descriptors by the ezpaarse process
// we need to know the pid of the process
var ezpaarsePid = fs.readFileSync(__dirname + '/../ezpaarse.pid', 'utf8');

describe('The server receives a log but network is cut during the transfer', function () {
  it('should stop the job process and free file descriptors (@01)', function (done) {

    var lsofBefore  = [];
    var lsofAfter   = [];

    // get the lsof value before the test
    lsof.raw(ezpaarsePid, function (data) {
      lsofBefore = data;
      logF.logFaker({ rate: 500 }, function (logStream) {
        var headers = { };
        var reqStream = helpers.postPiped('/', headers, logStream);

        // do nothing as long as the HTTP response
        // is not starting to be received
        reqStream.on('response', function (res)  {

          // abort the http request quickly once the process is running
          setTimeout(function () {
            reqStream.abort();
          }, 100);

          // stop the test once the ezpaarse response is closed
          res.on('end', function () {
            // test lsof !
            // get the lsof value before the test
            lsof.raw(ezpaarsePid, function (data) {
              lsofAfter = data;

              // test the number of open files before the log processing is equal
              // to the number of open file after the log processing
              lsofAfter.should.be.instanceof(Array);
              lsofBefore.should.be.instanceof(Array);
              
              // add a trace to help to understand which file descriptor is still open
              if (lsofAfter.length != lsofBefore.length) {
                console.error(lsofAfter);
              }

              should.equal(lsofAfter.length, lsofBefore.length);

              done();
            });
          });
        });
      });
    });
  });
});