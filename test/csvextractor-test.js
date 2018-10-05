/* eslint max-len: 0 */
/* global describe, it */
'use strict';

const csvextractor = require('../lib/csvextractor.js');
const should = require('should');

describe('The csvextractor command', function () {

  it('must be able to extract the title_id column from a CSV file (@01)', function (done) {

    const csvString = 'publication_title;print_identifier;online_identifier;title_id\nee;ff;vv;ll';
    csvextractor.extract(csvString, { silent: false, key: 'title_id' }, function (err, records) {
      should.ok(err === null);
      records.should.have.property('ll');
      records.ll.should.have.property('publication_title');
      done();
    });

  });

  it('should not crash when parsing an invalid CSV file (@02)', function (done) {

    const csvString = 'publication_title;print_identifier;online_identifier;title_id\nee;ff;vv;ll\n"The Farce of the Fart" and Other Ribaldries;9780812243239;9780812205015;9780812205015';
    csvextractor.extract(csvString, { silent: false, key: 'title_id' }, function (err, records) {
      should.exist(err);
      done();
    });

  });

});