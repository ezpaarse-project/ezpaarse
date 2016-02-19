/* eslint max-len: 0 */
/* global describe, it */
'use strict';

var helper   = require('./helpers.js');
var StreamPT = require('stream').PassThrough;
var logLine  = '16.2.255.24 - 13BBIU1158 [01/Aug/2013:16:56:36 +0100] "GET http://onlinelibrary.wiley.com:80/doi/10.1111/dme.12357/pdf HTTP/1.1" 200 13639' + '\n';

describe('Real time ECs', function () {

  it('should be generated when Double-Click-Removal is false (@01)', function (done) {

    // create a stream and write 2 lines logs into it
    var stream = new StreamPT();

    var opt = {
      'Double-Click-Removal': false
    };

    // send the logs to ezPAARSE
    var jobStream = helper.postPiped('/', opt, stream, function (err, res) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      res.should.have.status(200);
    });

    // read the result real time
    var readData = '';
    jobStream.on('data', function (chunk) {
      readData += chunk.toString();
    });

    stream.write(logLine);

    // check that we immediately get two lines (header + one EC)
    var tries = 0;
    setTimeout(function checkResponse() {
      var nbLines = readData.trim().split('\n').length;
      if (nbLines == 2) {
        done();
      } else if (++tries >= 5) {
        throw new Error('expected 2 lines, got ' + nbLines);
      } else {
        setTimeout(checkResponse, 200);
      }
    }, 100);

  });

});