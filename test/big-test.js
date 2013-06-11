// ##EZPAARSE

/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers  = require('./helpers.js');
var logF     = require('../lib/logfaker.js');
var fs       = require('fs');
var should   = require('should');
var shell    = require('shelljs');
var request  = require('request');
var config   = require('../config.json');
var duration = config.EZPAARSE_BIG_DURATION;
var rate     = config.EZPAARSE_BIG_RATE;


var headers = {};

describe('The server', function () {

  this.timeout(0);
  
  it('bear high loads (@01)', function (done) {
    
    var params = {};
    params.rate = rate;
    params.duration = duration;

    logF.logFaker(params, function (stream) {
      helpers.postPiped('/', headers, stream, function (err, res, bod) {
      
        if (err) {
          throw err;
        }
        if (!res) {
          throw new Error('ezPAARSE is not running');
        }
        res.should.have.status(200);
    
        request({
          method: 'GET',
          url: res.headers['job-report']
        }, function (error, response, body) {
        
          if (error) {
            throw error;
          }
          if (!response) {
            throw new Error('ezPAARSE is not running');
          }
      
          var report = JSON.parse(body);

          should.ok(report['Job-Done'] === true);
        
          done();
        });
      });
    });
  });
});