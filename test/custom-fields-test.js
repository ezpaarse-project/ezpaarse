/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var fs      = require('fs');
var should  = require('should');

var logFile = __dirname + '/dataset/customformat.log';

describe('The server', function () {
  describe('receives a log on the HTTP POST / route with a specific log format', function () {
    it('and sends back a CSV containing the fields specified by the custom format (@01)',
        function (done) {
      var headers = {
        'Accept'             : 'text/csv',
        'Log-Format-ezproxy' : '%u %{col1}<[0-9]+> %t "%r" %{col2}<[A-Z]+>'
      };
      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);
        
        body = body.trim().split('\n');
        should.ok(body.length == 2, 'One EC should be returned');
        
        var csvheader = body[0].split(';');
        csvheader.should.include('col1');
        csvheader.should.include('col2');
        
        var ec        = body[1].split(';');
        ec.should.include('chucknorris');
        ec.should.include('012');
        ec.should.include('ABC');
        
        done();
      });
    });
  });
  describe('receives a log on the HTTP POST / route with additional fields', function () {
    it('and sends back a CSV containing the default fields altered with the given ones (@02)',
        function (done) {
      var headers = {
        'Accept'             : 'text/csv',
        'Log-Format-ezproxy' : '%u %{col1}<[0-9]+> %t "%r" %{col2}<[A-Z]+>',
        'Output-Fields'      : '-url,+newCol'
      };
      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(200);
        
        body = body.trim().split('\n');
        should.ok(body.length == 2, 'One EC should be returned');
        
        var csvheader = body[0].split(';');
        csvheader.should.include('col1');
        csvheader.should.include('col2');
        csvheader.should.include('newCol');
        csvheader.should.not.include('url');
        
        var ec = body[1].split(';');
        ec.should.not.include('fulltext.pdf');
        ec.should.include('chucknorris');
        ec.should.include('012');
        ec.should.include('ABC');
        
        done();
      });
    });
  });
  describe('receives a log on the HTTP POST / route with an '
  + ' empty field in Output-Fields header', function () {
    it('and sends back a 4012 error code (@03)', function (done) {
      var headers = {
        'Output-Fields' : ',+newCol'
      };
      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(400);
        
        should.ok(body === '', 'The body is not empty');
        res.should.have.header('ezpaarse-status');
        res.should.have.header('ezpaarse-status-message');

        var status = res.headers['ezpaarse-status'];
        status.should.equal('4012', 'ezPAARSE returned a wrong status header');
        
        done();
      });
    });
  });
  describe('receives a log on the HTTP POST / route with an '
  + 'operator-less field in Output-Fields header', function () {
    it('and sends back a 4013 error code (@04)', function (done) {
      var headers = {
        'Output-Fields' : '-url,newCol'
      };
      helpers.post('/', logFile, headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }
        res.should.have.status(400);
        
        should.ok(body === '', 'The body is not empty');
        res.should.have.header('ezpaarse-status');
        res.should.have.header('ezpaarse-status-message');

        var status = res.headers['ezpaarse-status'];
        status.should.equal('4013', 'ezPAARSE returned a wrong status header');
        
        done();
      });
    });
  });
});