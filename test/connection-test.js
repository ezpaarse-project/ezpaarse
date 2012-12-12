/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers = require('./helpers.js');
var appname = require('../package.json').name;
console.log(appname);
describe('Le serveur', function () {
  it('renvoie une page contenant le nom de l\'application', function (done) {
    helpers.get('/', function (error, res, body) {
      if (!res) {
        throw new Error('L\'application n\'est pas lancée');
      }
      res.should.have.status(200);
      res.body.should.include(appname);
      done();
    });
  });
});