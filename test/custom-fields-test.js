/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var should  = require('should');
var path    = require('path');

var logFile = path.resolve(__dirname, 'dataset/customformat.log');

describe('The server', function () {
  describe('receives a log on the HTTP POST / route with a specific log format', function () {
    it('and sends back a CSV containing the fields specified by the custom format (@01)',
      function (done) {
        var headers = {
          'Accept'             : 'text/csv',
          'Crypted-Fields'     : 'disabled',
          'Log-Format-ezproxy' : '%u %{col1}<[0-9]+> %t "%r" %{col2}<"[A-Z]+">'
        };
        helpers.post('/', logFile, headers, function (err, res, body) {
          if (!res) { throw new Error('ezPAARSE is not running'); }
          if (err)  { throw err; }
          res.should.have.status(200);

          body = body.trim().split('\n');
          should.ok(body.length == 2, 'One EC should be returned');

          var csvheader = body[0].split(';');
          csvheader.should.containEql('col1');
          csvheader.should.containEql('col2');

          var ec        = body[1].split(';');
          ec.should.containEql('chucknorris');
          ec.should.containEql('012');
          ec.should.containEql('ABC');

          done();
        });
      });
  });
  describe('receives a log on the HTTP POST / route with additional fields', function () {
    it('and sends back a CSV containing the default fields altered with the given ones (@02)',
      function (done) {
        var headers = {
          'Accept'             : 'text/csv',
          'Crypted-Fields'     : 'disabled',
          'Log-Format-ezproxy' : '%u %{col1}<[0-9]+> %t "%r" %{col2}<"[A-Z]+">',
          'Output-Fields'      : '-url,+newCol'
        };
        helpers.post('/', logFile, headers, function (err, res, body) {
          if (!res) { throw new Error('ezPAARSE is not running'); }
          if (err)  { throw err; }
          res.should.have.status(200);

          body = body.trim().split('\n');
          should.ok(body.length == 2, 'One EC should be returned');

          var csvheader = body[0].split(';');
          csvheader.should.containEql('col1');
          csvheader.should.containEql('col2');
          csvheader.should.containEql('newCol');
          csvheader.should.not.containEql('url');

          var ec = body[1].split(';');
          ec.should.not.containEql('fulltext.pdf');
          ec.should.containEql('chucknorris');
          ec.should.containEql('012');
          ec.should.containEql('ABC');

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
        const response = JSON.parse(body);

        response.should.have.property('message');
        response.should.have.property('code', 4012);

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
        const response = JSON.parse(body);

        response.should.have.property('message');
        response.should.have.property('code', 4013);

        done();
      });
    });
  });
});
