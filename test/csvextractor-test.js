/* jshint maxlen: 260 */
/* global describe, it */
'use strict';

var csvextractor = require('../lib/csvextractor.js');
var should       = require('should');

describe('The csvextractor command', function () {

  it('must be able to extract the pid column from a valid CSV file (@01)', function (done) {

    var csvString = 'publication_title;print_identifier;online_identifier;title_id\nee;ff;vv;ll';
    csvextractor.extract(csvString, { silent: false, key: 'title_id' }, function (err, records) {
      should.ok(err === null);
      records.should.have.property('ll');
      records.ll.should.have.property('publication_title');
      done();
    });

  });

  it('should not crash if parsing a not syntaxicaly valid CSV file (@02)', function (done) {

    var csvString = 'publication_title;print_identifier;online_identifier;title_id\nee;ff;vv;ll\n"The Farce of the Fart" and Other Ribaldries;9780812243239;9780812205015;9780812205015';
    csvextractor.extract(csvString, { silent: false, key: 'title_id' }, function (err, records) {
      records.should.have.property('ll');
      should.ok(err !== null);
      done();
    });

  });

});