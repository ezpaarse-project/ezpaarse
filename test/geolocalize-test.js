/*global describe, it*/
'use strict';

var path    = require('path');
require('should');
var helpers = require('./helpers.js');

var logFile = path.join(__dirname, '/dataset/geolocalize.log');



describe('The server', function () {
  describe('receives a log file', function () {
    it('and correctly handles geolocalization (@01)', function (done) {
      var headers = {
        'Accept' : 'application/json',
        'Geoip' : 'geoip-country'
      };
      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        var result = JSON.parse(body);
        result[0].should.have.property('geoip-country');
        result[0]['geoip-country'].should.equal('US');
        result[0]['geoip-region'].should.equal('CA');
        done();
      });
    });
  });
  describe('receives a log file', function () {
    it('and correctly handles data without geolocalization (@02)', function (done) {
      var headers = {
        'Accept' : 'application/json',
        'Geoip' : 'none'
      };
      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);

        var result = JSON.parse(body);
        result[0].should.not.have.property('geoip-country');
        result[0].should.have.property('host');
        result[0]['host'].should.equal('66.249.65.107');
        done();
      });
    });
  });
});