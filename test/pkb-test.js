/*global describe, it*/
'use strict';

var should    = require('should');
var pkbManager = require('../lib/pkbmanager.js');

describe('The pkb manager', function () {
  it('works properly (@01)', function (done) {
    pkbManager.get('npg', function (pkb) {
      should.exist(pkb);
      var record = pkb.get('aps');
      should.exist(record.print_identifier);
      should.exist(record.online_identifier);
      should.exist(record.publication_title);
      record.print_identifier.should.equal('1671-4083');
      record.online_identifier.should.equal('1745-7254');
      record.publication_title.should.equal('Acta Pharmacologica Sinica');
      done();
    });
  });
});