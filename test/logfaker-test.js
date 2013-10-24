/*global describe, it*/
'use strict';

var should      = require('should');
var Lazy        = require('lazy');
var spawn       = require('child_process').spawn;
var logF        = require('../lib/logfaker.js');
var path        = require('path');

describe('logfaker', function () {
  describe('called using command line with --nb=1', function () {
    it('sends one line of log (@01)', function (done) {
      var nblines = 0;
      var child   = spawn('logfaker', ['--nb=1'], { cwd: path.join(__dirname, '/../bin/') });
      var lazy    = new Lazy(child.stdout);

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
    it('sends one line of log (@02)', function (done) {
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