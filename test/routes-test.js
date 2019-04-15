/*global describe, it*/
'use strict';

var should  = require('should');
var helpers = require('./helpers.js');

var infoRoutes = [
  '/api/info/platforms',
  '/api/info/rtype',
  '/api/info/mime',
  '/api/info/rid',
  '/api/info/fields.json',
  '/api/info/codes',
  '/api/info/codes/4003',
  '/api/info/uuid',
  '/api/info/form-predefined',
  '/api/info/config'
];

var adminRoutes = [
  '/api/admin/app/status',
  '/api/admin/platforms/status',
  '/api/admin/users'
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