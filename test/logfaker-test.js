/*global describe, it*/
'use strict';

var should      = require('should');
var Lazy        = require('lazy');
var shell       = require('shelljs');
var PassThrough = require('stream').PassThrough;
var logF        = require('../lib/logfaker.js');

describe('logfaker', function () {
  describe('called using command line with --nb=1', function () {
    it('sends one line of log (@01)', function (done) {
      var nblines = 0;
      var child   = shell.exec(__dirname + '/../bin/logfaker --nb=1', {async: true, silent: true});
      var pt      = new PassThrough();
      var lazy    = new Lazy(pt);
      child.stdout.pipe(pt);

      lazy.lines
        .map(String)
        .map(function () {
          nblines++;
        });
      lazy.on('end', function () {
        should.equal(nblines, 1);
        done();
      });
    });
  });
  describe('called using javascript with nb=1', function () {
    it('sends one line of log (@01)', function (done) {
      var nblines = 0;

      logF.logFaker({ nb: 1 }, function (s) {
        var lazy = new Lazy(s);

        lazy.lines
          .map(String)
          .map(function () {
            nblines++;
          });
        lazy.on('end', function () {
          should.equal(nblines, 1);
          done();
        });
      });
    });
  });
});