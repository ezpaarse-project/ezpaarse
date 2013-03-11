/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers  = require('./helpers.js');
var should   = require('should');
var fs       = require('fs');

var folder   = __dirname + '/dataset/multiformat';
var ezproxyTestSets =
[
  { logFile: folder + '/univ_limoges.ezproxy.log',
    format: '%<[ ]>[%t] %h %U' },
  { logFile: folder + '/univ_lyon.ezproxy.log',
    format: '%h %l %u [%t] "%r" %s %b' },
  { logFile: folder + '/univ_strasbourg.ezproxy.log',
    format: '[%t] %h %u %U %b %{session}<[a-zA-Z0-9]+>' },
  { logFile: folder + '/ul.ezproxy.log',
    format: '%h %u %<[0-9]> [%t] "%r" %s %b %<[a-zA-Z\\+]+>' },
  { logFile: folder + '/upmc.ezproxy.log',
    format: '%h %{session} %u [%t] "%r" %s %b %<.*>' }
];
var bibliopamTestSets =
[
  { logFile: folder + '/univ_toulouse.bibliopam.log',
    format: '%h %l %u %t "%r" %>s %b %<.*>' },
  { logFile: folder + '/univ_parisdescartes.bibliopam.log',
    format: '%h %l %u %t "%r" %>s %b %<.*>' }
];
var squidTestSets =
[
  { logFile: folder + '/upmc.squid.log',
    format: '%ts.%03tu %6tr %>a %Ss/%03>Hs %<st %rm %ru %[un %Sh/%<a %mt' },
  { logFile: folder + '/inria.squid.log',
    format: '%<A:%lp %>a %ui %[un [%tl] "%rm %ru HTTP/%rv" %>Hs %<st %<.*>' }
];

function check(testSet, formatHeader, callback) {
  var testCase = testSet.pop();
  if (!testCase) {
    callback();
    return;
  }
  testCase.resultFile = testCase.logFile.replace(/\.log$/, '.result.json');
  if (fs.existsSync(testCase.logFile) && fs.existsSync(testCase.resultFile)) {
    var headers = {
      'Accept': 'application/json',
      'Anonymise-host': 'md5'
    };
    headers[formatHeader] = testCase.format;
    helpers.post('/ws/', testCase.logFile, headers, function (error, res, body) {
      if (error) {
        throw error;
      }
      if (!res) {
        throw new Error('ezPAARSE is not running');
      }
      res.should.have.status(200);

      var resultJson = require(testCase.resultFile);
      if (resultJson.length === 0) {
        should.not.exist(body);
      } else {
        var bodyJson   = JSON.parse(body);

        bodyJson.should.be.a('object');
        should.ok(helpers.compareArrays(bodyJson, resultJson),
          'Server\'s answer do not match the intended result');
      }
      check(testSet, formatHeader, callback);
    });
  } else {
    check(testSet, formatHeader, callback);
  }
}

describe('The server', function () {
  describe('receives different ezproxy log files', function () {
    it('and recognizes the format of the lines using the HTTP headers', function (done) {
      check(ezproxyTestSets, 'LogFormat-ezproxy', done);
    });
  });
  describe('receives different bibliopam log files', function () {
    it('and recognizes the format of the lines using the HTTP headers', function (done) {
      check(bibliopamTestSets, 'LogFormat-bibliopam', done);
    });
  });
  describe('receives different squid log files', function () {
    it('and recognizes the format of the lines using the HTTP headers', function (done) {
      check(squidTestSets, 'LogFormat-squid', done);
    });
  });
});