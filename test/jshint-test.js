/*global describe, it*/
'use strict';

var should = require('should');
var path   = require('path');
var spawn  = require('child_process').spawn;

describe('jsHint', function () {
  this.timeout(10000);
  it('validates javascript files (@01)', function (done) {
    var child = spawn('make', ['jshint'], { cwd: path.join(__dirname, '..') });

    child.on('exit', function (code) {
      should.equal(code, 0, 'code was not validated by jsHint');
      done();
    });
  });
  it('validates JSON files (@02)', function (done) {
    var child = spawn('make', ['jsonhint'], { cwd: path.join(__dirname, '..') });

    child.on('exit', function (code) {
      should.equal(code, 0, 'JSON was not validated by jsHint');
      done();
    });
  });
});