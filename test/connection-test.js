/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var appname = require('../package.json').name;

describe('The server', function () {
  it('sends a page containing the application name', function (done) {
    helpers.get('/', function (error, res, body) {
      if (error) {
        throw error;
      }
      if (!res) {
        throw new Error('The application is not running');
      }
      res.should.have.status(200);
      res.body.should.include(appname);
      done();
    });
  });
});