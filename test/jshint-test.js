/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var should = require('should');
var path   = require('path');
var spawn  = require('child_process').spawn;

describe('The "make jshint" command', function () {
  this.timeout(5000);
  it('returns 0 if source code respects coding rules (@01)', function (done) {
    var child = spawn('make', ['jshint'], { cwd: path.join(__dirname, '..') });

    child.on('exit', function (code) {
      should.equal(code, 0, 'code was not validated by jsHint');
      done();
    });
  });
});