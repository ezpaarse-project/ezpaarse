/*global describe, it*/
'use strict';

var Browser = require('zombie');
var assert  = require('assert');
var config  = require('../lib/config.js');

var browser = new Browser({
  silent: true,
  proxy: null,
  features: "scripts css img"
});

var host = 'http://localhost:' + config.EZPAARSE_NODEJS_PORT;

describe('The browser', function () {

  it('should correctly download the main page', function () {
    this.timeout(10000);
    return browser.visit(host);
  });
  it('should correctly load all resources', function (done) {

    browser.resources.forEach(function (resource) {
      var url = resource.request.url;

      assert(resource.response, url + ' did not return');

      var statusCode = resource.response.status;
      assert([200,304,401,501].indexOf(statusCode) !== -1,
        url + ' returned with a code ' + statusCode);
    });

    done();
  });
});