/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
/*global describe, it*/
'use strict';

var helpers   = require('./helpers.js');
var config    = require('../config.json');
var fs        = require('fs');
var should    = require('should');
var shell     = require('shelljs');
var csv       = require('csv');
var byline    = require('byline');

var platformsFolder = __dirname + '/../platforms';
var cfgFilename     = 'manifest.json';

var platforms       = fs.readdirSync(platformsFolder);

function testFile(file, parserFile, platform) {
  if (/\.url$/.test(file)) {
    var urlFile = file;
    var resultFile = urlFile.replace(/url$/, 'result.csv');

    if (fs.existsSync(resultFile)) {
      describe(platform + ' in version ' + /[0-9]{4}-[0-9]{2}-[0-9]{2}/.exec(urlFile)[0], function () {
        it('works', function (done) {
          var results = [];
          csv().from.path(resultFile)
          .on('record', function (data) {
            var result = {};
            if (data[0]) { result.issn = data[0]; }
            if (data[1]) { result.eissn = data[1]; }
            if (data[2]) { result.type = data[2]; }
            results.push(result)
          })
          .on('end', function () {
            var child = shell.exec(parserFile, {async: true, silent: true})
            var stream = byline.createStream(child.stdout);
            
            stream.on('data', function (line) {
              var parsedLine = JSON.parse(line);
              var shift = results.shift();
              should.exist(shift, 'the parser has returned more results than expected');
              should.ok(helpers.objectsAreSame(parsedLine, shift),
                'some results do not match with those expected');
            })

            stream.on('end', function() {
              should.equal(results.length, 0, 'the parser has returned fewer results than expected');
              done();
            });
            
            fs.createReadStream(urlFile).pipe(child.stdin);

          });
        });
      });
    }
  }
}

function fetchPlatform(platform) {
  if (!platform) {
    return;
  } else if (/^\./.test(platform)) {
    fetchPlatform(platforms.pop());
    return;
  }
  var configFile = platformsFolder + '/' + platform + '/' + cfgFilename;

  if (fs.existsSync(configFile) && fs.statSync(configFile).isFile()) {
    var config = JSON.parse(fs.readFileSync(configFile, 'UTF-8'));

    if (config.name) {
      var parserFile = platformsFolder + '/' + platform + '/parser.py';

      if (fs.existsSync(parserFile) && fs.statSync(parserFile).isFile()) {
        var testFolder = platformsFolder + '/' + platform + '/test';

        if (fs.existsSync(testFolder) && fs.statSync(testFolder).isDirectory()) {
          var testFiles = fs.readdirSync(testFolder);

          for (var i in testFiles) {
            testFile(testFolder + '/' + testFiles[i], parserFile, config.name);
          }
        }
      }
    }
  }
  fetchPlatform(platforms.pop());
}

describe('The parser', function () {
    this.timeout(10000);
    fetchPlatform(platforms.pop());
});