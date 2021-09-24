/* eslint max-len: 0 */
/* global describe, it */
'use strict';

var helper   = require('./helpers.js');
var StreamPT = require('stream').PassThrough;

describe('Alert', function () {

  it('should be spawned when more than 10% of unknown domains are present in the logs (@01)', function (done) {

    // prepare known and unknown lines of log
    var knownDomainLog   = '247.63.228.176 - TEO [30/Nov/2012:00:13:10 +0100] "GET http://pdn.sciencedirect.com HTTP/1.1" 200 444';
    var unknownDomainLog = '247.63.228.176 - TEO [30/Nov/2012:00:13:10 +0100] "GET http://www.unknowndomain.com HTTP/1.1" 200 444';

    // create a stream and write 1100 lines of logs into it
    // with about 13% of www.unknowndomain.com
    var stream = new StreamPT();
    var i = 0;
    while (i < 1100) {
      if (i % 8 === 0) { // write about 13% of www.unknowndomain.com
        stream.write(unknownDomainLog + '\n');
      } else {
        stream.write(knownDomainLog + '\n');
      }
      i++;
    }
    stream.end();

    // send the logs to ezPAARSE
    helper.postPiped('/', {}, stream, function (err, res) {
      res.should.have.status(200);
      res.headers.should.have.property('job-id');

      // download the ezpaarse job report
      // to check the alerts section
      helper.get('/' + res.headers['job-id'] + '/job-report.json', function (err, res) {
        res.body = JSON.parse(res.body);
        res.body.should.have.property('alerts');
        res.body.alerts.should.have.property('active-alerts');
        res.body.alerts.should.have.property('alert-1');
        res.body.alerts['alert-1'].should.equal('www.unknowndomain.com is unknown but represents 13% of the log lines');
        done();
      });
    });

  });

  it('should not be spawned if headers contains a high rate of activation (@02)', function (done) {

    // prepare known and unknown lines of log
    var knownDomainLog   = '247.63.228.176 - TEO [30/Nov/2012:00:13:10 +0100] "GET http://pdn.sciencedirect.com HTTP/1.1" 200 444';
    var unknownDomainLog = '247.63.228.176 - TEO [30/Nov/2012:00:13:10 +0100] "GET http://www.unknowndomain.com HTTP/1.1" 200 444';

    // create a stream and write 1100 lines of logs into it
    // with about 13% of www.unknowndomain.com
    var stream = new StreamPT();
    var i = 0;
    while (i < 1100) {
      if (i % 8 === 0) { // write about 13% of www.unknowndomain.com
        stream.write(unknownDomainLog + '\n');
      } else {
        stream.write(knownDomainLog + '\n');
      }
      i++;
    }
    stream.end();

    // send the logs to ezPAARSE
    helper.postPiped('/', { 'Alerts-Unknown-Domains-Rate': 50 }, stream, function (err, res) {

      res.should.have.status(200);
      res.headers.should.have.property('job-id');

      // download the ezpaarse job report
      // to check the alerts section
      helper.get('/' + res.headers['job-id'] + '/job-report.json', function (err, res) {
        res.body = JSON.parse(res.body);
        res.body.should.have.property('alerts');
        res.body.alerts.should.have.property('active-alerts');
        res.body.alerts.should.not.have.property('alert-1');
        done();
      });
    });

  });

});