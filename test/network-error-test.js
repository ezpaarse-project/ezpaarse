/*global describe, it*/
/*eslint no-sync:0*/
'use strict';

var helpers = require('./helpers.js');
var fs      = require('fs');
var logF    = require('../lib/logfaker.js');
var lsof    = require('lsof');
var path    = require('path');

// to check the number of open file descriptors by the ezpaarse process
// we need to know the pid of the process
var ezpaarsePid = fs.readFileSync(path.resolve(__dirname, '../ezpaarse.pid'), 'utf8');

function filterTypes(element) {
  return /^(?:DIR|REG)$/i.test(element.type);
}

describe('The server receives a log but network is cut during the transfer', function () {
  it('should stop the job process and free file descriptors (@01)', function (done) {
    this.timeout(10000);

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
                  return callback(null);
                }

                if (tries <= 10) {
                  return setTimeout(function() { test(tries, callback); }, 200);
                }

                var unclosedFiles = [];
                lsofBefore = lsofBefore.map(function (file) { return file.name; });

                lsofAfter.forEach(function (file) {
                  if (lsofBefore.indexOf(file.name) == -1) {
                    unclosedFiles.push(file.name);
                  }
                });

                var msg = 'Some file descriptors were not properly closed: \n';
                msg += unclosedFiles.join('\n');
                callback(new Error(msg));
              });
            };

            test(0, function (err) {
              if (err) { throw err; }
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
