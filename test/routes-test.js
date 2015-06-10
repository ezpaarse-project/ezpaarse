/*global describe, it*/
'use strict';

var should  = require('should');
var helpers = require('./helpers.js');

var infoRoutes = [
  '/info/platforms',
  '/info/rtype',
  '/info/mime',
  '/info/rid',
  '/info/codes',
  '/info/codes/4003',
  '/info/uuid',
  '/info/form-predefined',
  '/info/config'
];

var adminRoutes = [
  '/app/status',
  '/platforms/status',
  '/users'
];

function testNextRoute(routes, status, callback) {
  var route = routes.pop();
  if (!route) {
    callback();
    return;
  }
  helpers.get(route, function (err, res) {
    if (!res) { throw new Error('ezPAARSE is not running'); }
    if (err)  { throw err; }
    should.ok(res.statusCode == status, 'The route ' + route
      + ' returned a code ' + res.statusCode + ' (should return ' + status + ')');
    testNextRoute(routes, status, callback);
  });
}

describe('The server', function () {
  it('correctly handle all info routes (@01)', function (done) {
    testNextRoute(infoRoutes, 200, done);
  });
  it('correctly handle all admin routes (@02)', function (done) {
    testNextRoute(adminRoutes, 401, done);
  });
});