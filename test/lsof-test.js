/*global describe, it*/
/*eslint no-sync:0*/
'use strict';

var helpers = require('./helpers.js');
var fs      = require('fs');
var lsof    = require('lsof');
var path    = require('path');

// to check the number of open file descriptors by the ezpaarse process
// we need to know the pid of the process
var ezpaarsePid = fs.readFileSync(path.resolve(__dirname, '../ezpaarse.pid'), 'utf8');

describe('ezPAARSE processes', function () {
  describe('a basic log file', function () {
    it('should have closed all the used file descriptors (@00)', function (done) {
      var log = path.resolve(__dirname, '/dataset/sd.mini.log');
      processLogAndTestLsof(log, {}, done);
    });
  });

  describe('a log file with an unsupported output format requested', function () {
    it('should have closed all the used file descriptors (@02)', function (done) {
      var log = path.resolve(__dirname, '/dataset/sd.mini.log');
      processLogAndTestLsof(log, { 'Accept': 'unsupported/format' }, done);
    });
  });

  describe('a basic log file with an empty field in the Output-Fields header', function () {
    it('should have closed all the used file descriptors (@03)', function (done) {
      var log = path.resolve(__dirname, '/dataset/sd.mini.log');
      processLogAndTestLsof(log, { 'Output-Fields' : ',+newCol' }, done);
    });
  });

  describe('a basic log file with an operator-less field in Output-Fields header', function () {
    it('should have closed all the used file descriptors (@04)', function (done) {
      var log = path.resolve(__dirname, '/dataset/sd.mini.log');
      processLogAndTestLsof(log, { 'Output-Fields' : '-url,newCol' }, done);
    });
  });

  describe('a basic log file with a user-field header group missing SRC', function () {
    it('should have closed all the used file descriptors (@05)', function (done) {
      var log = path.resolve(__dirname, '/dataset/user-multi-plus.log');
      var headers = {
        'Accept'                     : 'application/json',
        'user-field0-dest-groupe'    : 'etu|persecr|uncas|unautre',
        'user-field0-dest-categorie' : '[0-9]{3}',
        'user-field0-sep'            : '+'
      };
      processLogAndTestLsof(log, headers, done);
    });
  });

  describe('a basic log file with a user-field header group missing SEP', function () {
    it('should have closed all the used file descriptors (@06)', function (done) {
      var log = path.resolve(__dirname, '/dataset/user-multi-plus.log');
      var headers = {
        'Accept'                     : 'application/json',
        'user-field0-src'            : 'user',
        'user-field0-dest-groupe'    : 'etu|persecr|uncas|unautre',
        'user-field0-dest-categorie' : '[0-9]{3}'
      };
      processLogAndTestLsof(log, headers, done);
    });
  });

  describe('a basic log file with a user-field header group missing DEST', function () {
    it('should have closed all the used file descriptors (@07)', function (done) {
      var log = path.resolve(__dirname, '/dataset/user-multi-plus.log');
      var headers = {
        'Accept'          : 'application/json',
        'user-field0-src' : 'user',
        'user-field0-sep' : '+'
      };
      processLogAndTestLsof(log, headers, done);
    });
  });

  describe('a basic log file with a user-field header' +
           ' group containing fieldname doublons', function () {
    it('should have closed all the used file descriptors (@08)', function (done) {
      var log = path.resolve(__dirname, '/dataset/user-multi-plus.log');
      var headers = {
        'Accept'                     : 'application/json',
        'user-field0-src'            : 'user',
        'user-field0-dest-user'      : 'etu|persecr|uncas|unautre',
        'user-field0-dest-categorie' : '[0-9]{3}',
        'user-field0-sep'            : '+'
      };
      processLogAndTestLsof(log, headers, done);
    });
  });

  function filterTypes(element) {
    return /^(?:DIR|REG)$/i.test(element.type);
  }

  function processLogAndTestLsof(log, headers, done) {
    var lsofBefore  = [];
    var lsofAfter   = [];
    lsof.raw(ezpaarsePid, function (data) {
      lsofBefore = data.filter(filterTypes);
      lsofBefore.should.be.instanceof(Array);

      helpers.post('/', log, headers, function (err, res) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }

        var test = function (tries, callback) {
          tries++;

          lsof.raw(ezpaarsePid, function (data) {
            lsofAfter = data.filter(filterTypes);
            // test the number of open files before the log processing is equal
            // to the number of open file after the log processing
            lsofAfter.should.be.instanceof(Array);

            if (lsofAfter.length == lsofBefore.length) {
              return callback(null);
            }

            if (tries <= 10) {
              return setTimeout(function() { test(tries, callback); }, 200);
            }

            var unclosedFiles = [];
            lsofBefore = lsofBefore.map(function (file) { return file.name; });

            lsofAfter.forEach(function (file) {
              if (lsofBefore.indexOf(file.name) == -1) {
                unclosedFiles.push(file.name);
              }
            });

            var msg = unclosedFiles.length + ' file descriptors have not been properly closed';
            callback(new Error(msg));
          });
        };

        test(0, function (err) {
          if (err) { throw err; }
          done();
        });
      });
    });
  }

});
