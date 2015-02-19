/*global describe, it*/
'use strict';

var Browser = require('zombie');
var assert  = require('assert');
var config  = require('../lib/config.js');

Browser.localhost('ezpaarse.test.com', config.EZPAARSE_NODEJS_PORT);
var browser = Browser.create({
  proxy: null,
  features: "scripts css img",
  silent: true
});

browser.resources.mock('/feedback/status', { statusCode: 200 });
browser.resources.mock('/session', { statusCode: 200 });
browser.resources.mock(/googleapis/, { statusCode: 200 });

describe('The browser', function () {
  it('should correctly load the main page (@01)', function (done) {
    this.timeout(10000);

    browser.visit('/', function () {
      browser.assert.success("Failed to visit the main page");

      browser.wait(function (err) {
        browser.assert.evaluate('angular');
        browser.assert.element('#container', 'the main view was not loaded (#container not found)');

        browser.resources.forEach(function (resource) {
          var url = resource.request.url;
          assert(resource.response, url + ' did not return');

          var statusCode = resource.response.statusCode;
          assert([200,304].indexOf(statusCode) !== -1,
            url + ' returned with a code ' + statusCode);
        });
        done();
      });
    });
  });
});