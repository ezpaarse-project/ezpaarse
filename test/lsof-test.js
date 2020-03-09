/*global describe, it*/
/*eslint no-sync:0*/
'use strict';

const helpers = require('./helpers.js');
const fs      = require('fs');
const lsof    = require('lsof');
const path    = require('path');

// to check the number of open file descriptors by the ezpaarse process
// we need to know the pid of the process
const ezpaarsePid = fs.readFileSync(path.resolve(__dirname, '../ezpaarse.pid'), 'utf8');

describe('ezPAARSE processes', () => {
  describe('a basic log file', () => {
    it('should have closed all the used file descriptors (@00)', (done) => {
      const log = path.resolve(__dirname, '/dataset/sd.mini.log');
      processLogAndTestLsof(log, {}, done);
    }).timeout(10000);
  });

  describe('a log file with an unsupported output format requested', () => {
    it('should have closed all the used file descriptors (@02)', (done) => {
      const log = path.resolve(__dirname, '/dataset/sd.mini.log');
      processLogAndTestLsof(log, { 'Accept': 'unsupported/format' }, done);
    }).timeout(10000);
  });

  describe('a basic log file with an empty field in the Output-Fields header', () => {
    it('should have closed all the used file descriptors (@03)', (done) => {
      const log = path.resolve(__dirname, '/dataset/sd.mini.log');
      processLogAndTestLsof(log, { 'Output-Fields' : ',+newCol' }, done);
    }).timeout(10000);
  });

  describe('a basic log file with an operator-less field in Output-Fields header', () => {
    it('should have closed all the used file descriptors (@04)', (done) => {
      const log = path.resolve(__dirname, '/dataset/sd.mini.log');
      processLogAndTestLsof(log, { 'Output-Fields' : '-url,newCol' }, done);
    }).timeout(10000);
  });

  describe('a basic log file with a user-field header group missing SRC', () => {
    it('should have closed all the used file descriptors (@05)', (done) => {
      const log = path.resolve(__dirname, '/dataset/user-multi-plus.log');
      const headers = {
        'Accept'                     : 'application/json',
        'user-field0-dest-groupe'    : 'etu|persecr|uncas|unautre',
        'user-field0-dest-categorie' : '[0-9]{3}',
        'user-field0-sep'            : '+'
      };
      processLogAndTestLsof(log, headers, done);
    }).timeout(10000);
  });

  describe('a basic log file with a user-field header group missing SEP', () => {
    it('should have closed all the used file descriptors (@06)', (done) => {
      const log = path.resolve(__dirname, '/dataset/user-multi-plus.log');
      const headers = {
        'Accept'                     : 'application/json',
        'user-field0-src'            : 'user',
        'user-field0-dest-groupe'    : 'etu|persecr|uncas|unautre',
        'user-field0-dest-categorie' : '[0-9]{3}'
      };
      processLogAndTestLsof(log, headers, done);
    }).timeout(10000);
  });

  describe('a basic log file with a user-field header group missing DEST', () => {
    it('should have closed all the used file descriptors (@07)', (done) => {
      const log = path.resolve(__dirname, '/dataset/user-multi-plus.log');
      const headers = {
        'Accept'          : 'application/json',
        'user-field0-src' : 'user',
        'user-field0-sep' : '+'
      };
      processLogAndTestLsof(log, headers, done);
    }).timeout(10000);
  });

  describe('a basic log file with a user-field header' +
           ' group containing fieldname doublons', () => {
    it('should have closed all the used file descriptors (@08)', (done) => {
      const log = path.resolve(__dirname, '/dataset/user-multi-plus.log');
      const headers = {
        'Accept'                     : 'application/json',
        'user-field0-src'            : 'user',
        'user-field0-dest-user'      : 'etu|persecr|uncas|unautre',
        'user-field0-dest-categorie' : '[0-9]{3}',
        'user-field0-sep'            : '+'
      };
      processLogAndTestLsof(log, headers, done);
    }).timeout(10000);
  });

  function filterTypes(element) {
    return /^(?:DIR|REG)$/i.test(element.type);
  }

  function processLogAndTestLsof(log, headers, done) {
    let lsofBefore  = [];
    let lsofAfter   = [];
    lsof.raw(ezpaarsePid, (data) => {
      lsofBefore = data.filter(filterTypes);
      lsofBefore.should.be.instanceof(Array);

      helpers.post('/', log, headers, (err, res) => {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }

        const test = (tries, callback) => {
          tries++;

          lsof.raw(ezpaarsePid, (data) => {
            lsofAfter = data.filter(filterTypes);
            // test the number of open files before the log processing is equal
            // to the number of open file after the log processing
            lsofAfter.should.be.instanceof(Array);

            if (lsofAfter.length == lsofBefore.length) {
              return callback(null);
            }

            if (tries <= 10) {
              return setTimeout(() => { test(tries, callback); }, 200);
            }

            const unclosedFiles = [];
            lsofBefore = lsofBefore.map((file) => { return file.name; });

            lsofAfter.forEach((file) => {
              if (lsofBefore.indexOf(file.name) == -1) {
                unclosedFiles.push(file.name);
              }
            });

            const msg = unclosedFiles.length + ' file descriptors have not been properly closed';
            callback(new Error(msg));
          });
        };

        test(0, (err) => {
          if (err) { throw err; }
          done();
        });
      });
    });
  }

});
