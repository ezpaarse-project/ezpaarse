/* eslint max-len: 0 */
/* global describe, it */
'use strict';

var spawn = require('child_process').spawn;
var Lazy  = require('lazy');
var path  = require('path');

describe('The loganonymizer command', function () {
  it('must be able to anonymize a simple ligne of log (@01)', function (done) {

    var child = spawn(path.join(__dirname, '/../bin/loganonymizer'));

    // send one line of log to loganonymizer command
    child.stdin.write('AMontsouris-73-1-5-54.w90-2.abo.wanadoo.fr - SCTUMR8028 [01/Oct/2013:00:11:51 +0100] "GET http://apps.webofknowledge.com:80/WOS_GeneralSearch_input.do?product=WOS&SID=U1K5tMFf5RefK7Xk5jh&search_mode=GeneralSearch HTTP/1.1" 200 108690');
    child.stdin.end();

    // parse loganonymizer stdout line by line
    var lines = [];
    new Lazy(child.stdout)
      .lines
      .map(String)
      .forEach(function (line) {
        lines.push(line);
      });

    // test is finished when the loganonymizer process exits
    child.on('close', function (code) {
      code.should.be.equal(0);
      lines.length.should.be.equal(1);
      lines[0].should.containEql('webofknowledge');
      lines[0].length.should.be.above(0);
      done();
    });

  });
});