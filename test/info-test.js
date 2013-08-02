/*global describe, it*/
'use strict';

var should  = require('should');
var helpers = require('./helpers.js');

var routes = [
  '/info/platforms',
  '/info/rtype',
  '/info/mime',
  '/info/rid',
  '/info/codes',
  '/info/codes/4003',
  '/info/uuid',
  '/info/form-predefined',
  '/info/usage.json',
  '/info/usage.html',
];

function testNextRoute(callback) {
  var route = routes.pop();
  if (!route) {
    callback();
    return;
  }
  helpers.get(route, function (err, res) {
    if (!res) { throw new Error('ezPAARSE is not running'); }
    if (err)  { throw err; }
    should.ok(res.statusCode == 200,
      'la route ' + route + ' a retourné un code ' + res.statusCode);
    testNextRoute(callback);
  });
}

describe('The server', function () {
  it('correctly handle all info routes (@01)', function (done) {
    testNextRoute(done);
  });
});