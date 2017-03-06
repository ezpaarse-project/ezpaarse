/*global describe, it*/
'use strict';

const path    = require('path');
const should  = require('should');
const helpers = require('./helpers.js');

const logFile = path.join(__dirname, 'dataset/cut.log');

const testCases = [
  {
    description: 'should correctly extract data with a regex (@01)',
    headers: {
      'Accept': 'application/json',
      'Extract': 'login => /^(\\w+)\\w_\\w(\\w+)$/i => firstname,lastname'
    },
    result: {
      firstname: 'THEODOR',
      lastname: 'CCLURE'
    }
  },
  {
    description: 'should correctly split with a regex (@02)',
    headers: {
      'Accept': 'application/json',
      'Extract': 'login => split(/[od_]+/i) => first,second,third'
    },
    result: {
      first: 'THE',
      second: 'RE',
      third: 'MCCLURE'
    }
  },
  {
    description: 'should correctly split with a string (@03)',
    headers: {
      'Accept': 'application/json',
      'Extract': 'login => split(_) => firstname,lastname'
    },
    result: {
      firstname: 'THEODORE',
      lastname: 'MCCLURE'
    }
  }
];

const errCases = [
  {
    description: 'should return an error if the extract expression is invalid (@04)',
    headers: {
      'Extract': 'login => invalid => firstname'
    }
  },
  {
    description: 'should return an error if the extract header is invalid (@05)',
    headers: {
      'Extract': 'login invalid => firstname'
    }
  }
];

describe('the cut middleware', function () {
  testCases.forEach(testCase => {
    it(testCase.description, function (done) {
      helpers.post('/', logFile, testCase.headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }

        res.statusCode.should.equal(200, 'expected 200, got ' + res.statusCode);

        const result = JSON.parse(body);
        result.should.be.an.instanceOf(Array).and.have.lengthOf(1);

        const ec = result[0];

        for (const p in testCase.result) {
          should.equal(testCase.result[p], ec[p]);
        }

        done();
      });
    });
  });

  errCases.forEach(testCase => {
    it(testCase.description, function (done) {
      helpers.post('/', logFile, testCase.headers, function (err, res, body) {
        if (!res) { throw new Error('ezPAARSE is not running'); }
        if (err)  { throw err; }

        res.statusCode.should.equal(400, 'expected 400, got ' + res.statusCode);
        res.headers.should.have.property('ezpaarse-status-message', 'Invalid extract expression');

        done();
      });
    });
  });
});

