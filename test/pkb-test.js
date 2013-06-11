/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var should    = require('should');
var PkbManager = require('../lib/pkbmanager.js');

describe('The pkb manager', function () {
  it('works properly (@01)', function (done) {
    var pkbManager = new PkbManager();
    pkbManager.get('npg', function (pkb) {
      should.exist(pkb);
      var record = pkb.get('aps');
      should.exist(record.issn);
      should.exist(record.eissn);
      record.issn.should.equal('1671-4083');
      record.eissn.should.equal('1745-7254');
      done();
    });
  });
});