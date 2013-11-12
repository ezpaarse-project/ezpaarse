/* jshint maxlen: 260 */
/* global describe, it */
'use strict';

var path        = require('path');
var spawn       = require('child_process').spawn;


var noHeaderLineFile = "no-header-line.validator.pkb.csv";
var ridFile = "rid.validator.pkb.csv";


describe('The pkbvalidator command', function () {

  it('must be able to detect missing header line in pkb file (@01)', function (done) {
    var testValidatorFile = path.join(__dirname, '/dataset/' + noHeaderLineFile);
    var child   = spawn('pkbvalidator', [testValidatorFile], { cwd: path.join(__dirname, '/../bin/') });

    child.on('close', function (code) {
      code.should.be.equal(1);
      done();
    });

  });

  it('should not crash if parsing a not syntaxicaly valid CSV file (@02)', function (done) {
    var testValidatorFile = path.join(__dirname, '/dataset/' + ridFile);
    var child   = spawn('pkbvalidator', [testValidatorFile], { cwd: path.join(__dirname, '/../bin/') });

    child.on('close', function (code) {
      code.should.be.equal(7);
      done();
    });
  });

});