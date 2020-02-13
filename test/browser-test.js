/*global describe, it*/
'use strict';

const Browser = require('zombie');
const assert  = require('assert');
const config  = require('../lib/config.js');

const host = `http://localhost:${config.EZPAARSE_NODEJS_PORT || 59599}/`;

describe('The browser', () => {
  const browser = new Browser({
    silent: true,
    features: 'scripts css img',
  });

  it('should correctly load page and all resources', (done) => {
    browser.visit(host, () => {
      browser.assert.success();

      browser.assert.text('title', 'ezPAARSE');

      browser.resources.forEach((resource) => {
        const url = resource.request.url;
        if (url.indexOf('Roboto') === -1) {
          assert(resource.response, url + ' did not return');

          const statusCode = resource.response.status;
          assert([200, 304, 401, 501].indexOf(statusCode) !== -1,
            url + ' returned with a code ' + statusCode);
        }
      });
      done();
    });
  }).timeout(10000);
});