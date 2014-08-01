/* jshint maxlen: 260 */
/* global describe, it */
'use strict';

var helper   = require('./helpers.js');
var Lazy     = require('lazy');
var StreamPT = require('stream').PassThrough;
var logLine  = '16.2.255.24 - 13BBIU1158 [01/Aug/2013:16:56:36 +0100] "GET http://onlinelibrary.wiley.com:80/doi/10.1111/dme.12357/pdf HTTP/1.1" 200 13639' + '\n';

describe('Real time ECs', function () {

  it('should be generated when Double-Click-Removal is false (@01)', function (done) {

    // create a stream and write 2 lines logs into it
    var stream = new StreamPT();
    stream.write(logLine);
    // but wait 2 second before writing the second one
    setTimeout(function () {
      stream.write(logLine);
      stream.end();
    }, 2000);

    // send the logs to ezPAARSE
    var jobStream = helper.postPiped('/', { 'Double-Click-Removal': false }, stream, function (err, res) {
      res.should.have.status(200);
    });

    // read the result real time
    var chunksRead = [];
    jobStream.on('data', function (chunk) {
      chunksRead.push('' + chunk);
    });

    // test how many chunk has been received
    setTimeout(function () {
      chunksRead.length.should.be.above(0);
      done();
    }, 100);

  });

});