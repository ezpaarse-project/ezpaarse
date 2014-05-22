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

function filterTypes(element) {
  return /^(?:DIR|REG)$/i.test(element.type);
}

describe('The server receives a log but network is cut during the transfer', function () {
  it('should stop the job process and free file descriptors (@01)', function (done) {

    var lsofBefore  = [];
    var lsofAfter   = [];

    // get the lsof value before the test
    lsof.raw(ezpaarsePid, function (data) {
      lsofBefore = data.filter(filterTypes);
      lsofBefore.should.be.instanceof(Array);

      logF.logFaker({ rate: 500 }, function (logStream) {
        var headers   = {};
        var reqStream = helpers.postPiped('/', headers, logStream);

        // do nothing as long as the HTTP response
        // is not starting to be received
        reqStream.on('response', function (res)  {

          // stop the test once the ezpaarse response is closed
          res.on('end', function () {
            var test = function (tries, callback) {
              tries++;

              lsof.raw(ezpaarsePid, function (data) {
                lsofAfter = data.filter(filterTypes);
                // test the number of open files before the log processing is equal
                // to the number of open file after the log processing
                lsofAfter.should.be.instanceof(Array);

                if (lsofAfter.length == lsofBefore.length) {
                  callback(null);
                } else if (tries > 5) {

                  var unclosedFiles = [];
                  lsofBefore = lsofBefore.map(function (file) { return file.name; });

                  lsofAfter.forEach(function (file) {
                    if (lsofBefore.indexOf(file.name) == -1) {
                      unclosedFiles.push(file.name);
                    }
                  });

                  // add a trace to help to understand which file descriptor is still open
                  console.error(JSON.stringify(unclosedFiles, null, 2));

                  callback(false);
                  return;
                } else {
                  setTimeout(function() {
                    test(tries, callback);
                  }, 200);
                }
              });
            };

            test(0, function (fail) {
              should.not.exist(fail, 'some file descriptors were not closed correctly');
              done();
            });
          });

          // abort the http request quickly once the process is running
          setTimeout(function () {
            // logStream.unpipe();
            reqStream.abort();
          }, 100);
        });
      });
    });
  });
});
