/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var should    = require('should');
var pkbManager = require('../lib/pkbmanager.js');

describe('The pkb manager', function () {
  it('works properly (@01)', function (done) {
    pkbManager.get('npg', function (pkb) {
      should.exist(pkb);
      var record = pkb.get('aps');
      should.exist(record.issn);
      should.exist(record.eissn);
      should.exist(record.title);
      record.issn.should.equal('1671-4083');
      record.eissn.should.equal('1745-7254');
      record.title.should.equal('Acta Pharmacologica Sinica');
      done();
    });
  });
});