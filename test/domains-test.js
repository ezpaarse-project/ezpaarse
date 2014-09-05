/*global describe, it*/
'use strict';

var parserlist = require('../lib/parserlist.js');

describe('All domains', function () {
  this.timeout(2000);

  it('should be pointing to one parser only', function (done) {
    parserlist.init(function (errors, duplicates) {

      if (errors && errors.length > 0) { throw errors[0]; }

      if (duplicates && duplicates.length > 0) {
        var msg = duplicates[0].domain + ' is used twice in ';
        msg    += duplicates[0].first + ' and ' + duplicates[0].ignored;
        throw new Error(msg);
      }

      done();
    });
  });
});