/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var fs            = require('fs');
var should        = require('should');
var shell         = require('shelljs');

describe('The "make jshint" command', function () {
  this.timeout(5000);
  it('returns 0 if source code respects coding rules (@01)', function (done) {
    shell.exec('make jshint', { silent: true, async: true }, function (code, output) {
      if (code !== 0) {
        console.error(output);
      }
      should.equal(code, 0);
      done();
    });
  });
});