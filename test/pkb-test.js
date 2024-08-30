/*global describe, it, before, after*/
'use strict';

var should     = require('should');
var fs         = require('fs');
var path       = require('path');
var pkbClean   = require('../lib/pkb-cleaner.js');

describe('The pkb cleaner', function () {
  var pkbDir  = path.join(__dirname, 'pkb');
  var oldPkb  = path.join(pkbDir, 'pkb_2014-03-11.txt');
  var oldPkb2 = path.join(pkbDir, 'pkb_2014-05-11.txt');
  var newPkb  = path.join(pkbDir, 'pkb_2014-09-17.txt');

  before(function (next) {
    fs.mkdir(pkbDir, function (err) {
      if (err && err.code != 'EEXIST') { throw err; }
      fs.writeFile(oldPkb, 'title_id\n1\n2\n3\n4\n5\n', function (err) {
        if (err) { throw err; }
        fs.writeFile(oldPkb2, 'title_id\n3\n4\n6\n', function (err) {
          if (err) { throw err; }
          fs.writeFile(newPkb, 'title_id\n3\n4\n5\n6\n7\n', function (err) {
            if (err) { throw err; }
            next();
          });
        });
      });
    });
  });

  after(function (next) {
    fs.unlink(oldPkb, function (err) {
      fs.unlink(oldPkb2, function (err) {
        fs.unlink(newPkb, function (err) {
          fs.rmdir(pkbDir, function (err) {
            next();
          });
        });
      });
    });
  });

  it('correctly remove duplicates (@02)', function (done) {

    pkbClean({ dir: pkbDir, rewrite: true })
      .on('error', function (err) { throw err; })
      .on('end', function () {

        fs.readFile(oldPkb, 'utf8', function (err, oldContent) {
          should.not.exist(err);
          oldContent = oldContent.toString().trim();
          oldContent.split('\n').length.should.equal(3);
          oldContent.should.containEql('1');
          oldContent.should.containEql('2');
          oldContent.should.not.containEql('3');
          oldContent.should.not.containEql('4');
          oldContent.should.not.containEql('5');

          fs.readFile(newPkb, 'utf8', function (err, newContent) {
            should.not.exist(err);
            newContent = newContent.toString().trim();
            newContent.split('\n').length.should.equal(6);
            newContent.should.containEql('3');
            newContent.should.containEql('4');
            newContent.should.containEql('5');
            newContent.should.containEql('6');
            newContent.should.containEql('7');

            fs.exists(oldPkb2, function (exist) {
              exist.should.equal(false, 'Le fichier ' + oldPkb2 + ' n\'a pas été supprimé');
              done();
            });
          });
        });
      });
  });
});
