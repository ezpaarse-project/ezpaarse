/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers  = require('./helpers.js');
var should   = require('should');
var fs       = require('fs');

var folder   = __dirname + '/dataset/multiformat';
var ezproxyTestSets =
[
  { logFile: folder + '/univ_limoges.ezproxy.log',     format: '%<[ ]>[%t] %h %U' },
  { logFile: folder + '/univ_lyon.ezproxy.log',        format: '%h %l %u [%t] "%r" %s %b' },
  { logFile: folder + '/univ_strasbourg.ezproxy.log',  format: '[%t] %h %u %U %b %{session}<[a-zA-Z0-9]+>' },
  { logFile: folder + '/ul.ezproxy.log',          format: '%h %u %<[0-9]> [%t] "%r" %s %b %<[a-zA-Z\+]+>' },
  { logFile: folder + '/upmc.ezproxy.log',        format: '%h %{session}<[a-zA-Z0-9]+> %u [%t] "%r" %s %b %<.*>' }
];

function check(testCase, callback) {
  var testCase = ezproxyTestSets.pop();
  if (!testCase) {
    callback();
    return;
  }
  testCase.resultFile = testCase.logFile.replace(/\.log$/, '.result.json');
  if (fs.existsSync(testCase.logFile) && fs.existsSync(testCase.resultFile)) {
    var headers = {
      'Accept': 'application/json',
      'LogFormat-ezproxy': testCase.format
    };
    helpers.post('/ws/', testCase.logFile, headers, function (error, res, body) {
      if (error) {
        throw error;
      }
      if (!res) {
        throw new Error('ezPAARSE is not running');
      }
      res.should.have.status(200);

      var resultJson = require(testCase.resultFile);
      var bodyJson   = JSON.parse(body);

      bodyJson.should.be.a('object');
      should.ok(helpers.compareArrays(bodyJson, resultJson),
        'Server\'s answer do not match the intended result');
      check(ezproxyTestSets, callback);
    });
  } else {
    check(ezproxyTestSets, callback);
  }
}

describe('The server', function () {
  describe('receives different log files on the HTTP POST /ws/ route', function () {
    it('and recognizes lines format using the HTTP headers', function (done) {
      check(ezproxyTestSets, done);
    });
  });
});