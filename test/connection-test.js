/*global describe, it*/
'use strict';

const helpers = require('./helpers.js');
const appname = require('../client/nuxt.config.js').head.title;

describe('The server', () => {
  it('sends a page containing the application name (@01)', (done) => {
    helpers.get('/', (err, res) => {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.should.have.status(200);
      res.body.should.containEql(appname);
      done();
    });
  });
});