/*global describe, it*/
'use strict';

var should = require('should');
var Lazy   = require('lazy');
var logF   = require('../lib/logfaker.js');

describe('logfaker', function () {
  describe('called with nb=1', function () {
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