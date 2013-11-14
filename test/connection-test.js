/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var appname = require('../package.json').name;

describe('The server', function () {
  it('sends a page containing the application name (@01)', function (done) {
    helpers.get('/', function (err, res) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.should.have.status(200);
      res.body.should.include(appname);
      done();
    });
  });
});