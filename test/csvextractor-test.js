/* jshint maxlen: 260 */
/* global describe, it */
'use strict';

var csvextractor = require('../lib/csvextractor.js');
var should       = require('should');

describe('The csvextractor command', function () {

  it('must be able to extract the pid column from a valid CSV file (@01)', function (done) {

    var csvString = 'title;pisbn;eisbn;pid\nee;ff;vv;ll';
    csvextractor.extract(csvString, [], function (err, records) {
      should.ok(err === null);
      records.should.have.property('ll');
      records.ll.should.have.property('title');
      done();
    }, { silent: false, key: 'pid' });

  });

  it('should not crash if parsing a not syntaxicaly valid CSV file (@02)', function (done) {

    var csvString = 'title;pisbn;eisbn;pid\nee;ff;vv;ll\n"The Farce of the Fart" and Other Ribaldries;9780812243239;9780812205015;9780812205015';
    csvextractor.extract(csvString, [], function (err, records) {
      records.should.have.property('ll');
      should.ok(err !== null);
      done();
    }, { silent: false, key: 'pid' });

  });

});