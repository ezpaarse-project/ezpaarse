/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var fs            = require('fs');
var should        = require('should');
var shell         = require('shelljs');
var byline        = require('byline');

describe('The logfaker command', function () {
  describe('can be called with --nb=1', function () {
    it('and sends back one line of log', function (done) {
      var child  = shell.exec(__dirname + '/../bin/logfaker --nb=1', {async: true, silent: true});
      var stream = byline.createStream(child.stdout);
      var nbline = 0;
      stream.on('data', function (line) {
        nbline++;
      })
      stream.on('end', function () {
        should.equal(nbline, 1);
        done();
      });
    });
  });
});