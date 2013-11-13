/*global describe, it*/
'use strict';

var helpers      = require('./helpers.js');
var fs           = require('fs');
var path         = require('path');
var should       = require('should');
var spawn        = require('child_process').spawn;
var exec         = require('child_process').exec;
var Lazy         = require('lazy');
var csvextractor = require('../lib/csvextractor.js');
var pp           = require('../lib/platform-parser.js');
var assert       = require('assert');

var platformsFolder = path.join(__dirname, '/../platforms-parsers');
var cfgFilename     = 'manifest.json';

var platforms       = fs.readdirSync(platformsFolder);

function testFiles(files, platformName, parserFile, done) {

  var test = exec(parserFile);
  test.on('exit', function (code) {
    assert.ok(code !== 126, "Platform " + platformName + " : the parser is not executable");
    assert.ok(code === 0, "Platform " + platformName + " : the parser does not work properly");

    csvextractor.extract(files, [], function (err, records) {
      assert.ok(err === null);

      var child = spawn(parserFile);
      var lazy  = new Lazy(child.stdout);

      lazy.lines
        .map(String)
        .map(function (line) {
          var parsedLine = JSON.parse(line);
          delete record.url;
          should.ok(helpers.objectsAreSame(parsedLine, record),
            'result does not match\nresult: ' + line + '\nexpected: ' + JSON.stringify(record));
          record = records.pop();
          if (record) {
            child.stdin.write(record.url + '\n');
          } else {
            child.stdin.end();
          }
        });
      lazy.on('end', function () {
        done();
      });

      var record = records.pop();
      if (record) {
        should(record.url, 'some entries in the test file have no URL');
        child.stdin.write(record.url + '\n');
      } else {
        done();
      }
    }, {silent: true, type: 'files'});
  });

  test.stdin.end('[]');
}

function fetchPlatform(platform) {

  var platformPath = platformsFolder + '/' + platform;

  if (!platform) {

    return;
  } else if (/^\./.test(platform) || !fs.statSync(platformPath).isDirectory()) {

    fetchPlatform(platforms.pop());
    return;
  }
  var configFile = path.join(platformPath, cfgFilename);

  describe(platform, function () {

    it('is usable', function (done) {

      should.ok(fs.existsSync(configFile) && fs.statSync(configFile).isFile(),
                "manifest.json does not exist");
      var config = JSON.parse(fs.readFileSync(configFile, 'UTF-8'));

      should.exist(config.name, "field 'name' in manifest.json does not exist");
      should.ok(config.name.length > 0, "field 'name' in manifest.json is empty");
      var pfile = pp.getParser(platform);

      if (pfile && pfile.language !== '') {

        var parserFile = pfile.path;
        var testFolder = path.join(platformsFolder, platform, '/test');

        should.ok(fs.existsSync(testFolder) && fs.statSync(testFolder).isDirectory(),
                  "no test folder");
        var files = fs.readdirSync(testFolder);
        var csvFiles = [];

        for (var i in files) {

          var csvPath = path.join(testFolder, files[i]);

          if (/\.csv$/.test(files[i]) && fs.statSync(csvPath).isFile()) {

            csvFiles.push(csvPath);
          }
        }
        should.ok(csvFiles.length > 0, "no test file");
        testFiles(csvFiles, platform, parserFile, done);
      } else {

        done();
      }
    });
  });
  fetchPlatform(platforms.pop());
}

describe('The platform', function () {
  this.timeout(10000);
  fetchPlatform(platforms.pop());
});