/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers  = require('./helpers.js');
var should   = require('should');
var fs       = require('fs');
var path     = require('path');

var folder   = path.join(__dirname, '/dataset/multiformat');
var ezproxyTestSets =
[
  { logFile: path.join(folder, '/univ_limoges.ezproxy.log'),
    format: '%t %h %U' },
  { logFile: path.join(folder, '/univ_lyon.ezproxy.log'),
    format: '%h %l %u %t "%r" %s %b' },
  { logFile: path.join(folder, '/univ_strasbourg.ezproxy.log'),
    format: '%t %h %u %U %b %{session}<[a-zA-Z0-9]+>' },
  { logFile: path.join(folder, '/ul.ezproxy.log'),
    format: '%h %u %<[0-9]> %t "%r" %s %b %<[a-zA-Z\\+]+>' },
  { logFile: path.join(folder, '/upmc.ezproxy.log'),
    format: '%h %{session} %u %t "%r" %s %b %<.*>' },
  { logFile: path.join(folder, '/univ_rennes1.ezproxy.log'),
    format: '%h %{session1}<[a-zA-Z0-9\\-\\+]+> %{session2}<[a-zA-Z0-9\\-\\+]+>'
           + ' %t \"%r\" %s %b %{user}<[a-zA-Z0-9\\-\\+]+>' }
];
var bibliopamTestSets =
[
  { logFile: path.join(folder, '/univ_toulouse.apache.log') },
  { logFile: path.join(folder, '/univ_parisdescartes.apache.log') }
];
var apacheTestSets =
[
  { logFile: path.join(folder, '/test.apache.log'),
    format: '%h %l %u %t "%r" %>s %b %<.*>' },
];
var squidTestSets =
[
  { logFile: path.join(folder, '/upmc.squid.log'),
    format: '%ts.%03tu %6tr %>a %Ss/%03>Hs %<st %rm %ru %[un %Sh/%<a %mt' },
  { logFile: path.join(folder, '/inria.squid.log'),
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
      'Anonymize-host': 'md5',
      'Double-Click-Removal': false
    };
    if (testCase.format) {
      headers[formatHeader] = testCase.format;
    }
    helpers.post('/', testCase.logFile, headers, function (err, res, body) {
      if (!res) { throw new Error('ezPAARSE is not running'); }
      if (err)  { throw err; }
      res.should.have.status(200);

      var resultJson = require(testCase.resultFile);
      if (resultJson.length === 0) {
        should.ok(body === '', 'The body is not empty, but the result file is.');
      } else {
        should.ok(body !== '', 'The body is empty');
        var bodyJson = JSON.parse(body);

        bodyJson.should.be.a('object');
        should.ok(helpers.compareArrays(bodyJson, resultJson),
          'Server\'s answer do not match the intended result at ' + testCase.logFile);

      }
      check(testSet, formatHeader, callback);
    });
  } else {
    check(testSet, formatHeader, callback);
  }
}

describe('The server', function () {
  describe('receives different ezproxy log files', function () {
    it('and recognizes the format of the lines using the HTTP headers (@01)', function (done) {
      check(ezproxyTestSets, 'Log-Format-ezproxy', done);
    });
  });
  describe('receives different bibliopam log files', function () {
    it('and recognizes the format of the lines using the HTTP headers (@02)', function (done) {
      check(bibliopamTestSets, null, done);
    });
  });
  describe('receives different apache log files', function () {
    it('and recognizes the format of the lines using the HTTP headers (@03)', function (done) {
      check(apacheTestSets, 'Log-Format-apache', done);
    });
  });
  describe('receives different squid log files', function () {
    it('and recognizes the format of the lines using the HTTP headers (@04)', function (done) {
      check(squidTestSets, 'Log-Format-squid', done);
    });
  });
});