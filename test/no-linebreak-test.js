/*global describe, it*/
'use strict';

var PassThrough = require('stream').PassThrough;
var helpers     = require('./helpers.js');

describe('The server receives data with no line breaks', function () {
  it('and should stop the process (@01)', function (done) {
    // Since Nuxt dev mode adds 15 second to this request (for whatever reason)
    // we set the timeout accordingly
    if (process.env.NODE_ENV !== 'production') {
      // (15s * 1000ms) + base timeout
      this.timeout((15 * 1000) + this.timeout());
    }

    var stream      = new PassThrough();
    var gotResponse = false;
    var canWrite    = true;

    helpers.postPiped('/', {}, stream, function (err, res, body) {
      gotResponse = true;
      stream.end();

      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.should.have.status(400);

      res.headers.should.have.property('ezpaarse-status');
      res.headers.should.have.property('ezpaarse-status-message');
      var status = res.headers['ezpaarse-status'];
      status.should.equal('4022', 'expected status 4022, got ' + status);

      done();
    });

    // Try to send 200kb of text
    var i = 10000;
    (function writeSomedata() {
      if (gotResponse || --i < 0) { return; }

      canWrite = stream.write('20 bytes long string');

      if (canWrite) { setImmediate(writeSomedata); }
      else { stream.once('drain', writeSomedata); }
    })();
  });
});
