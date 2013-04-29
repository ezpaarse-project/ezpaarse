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
var csvextractor = require('../lib/csvextractor.js');
var pp        = require('../lib/platform-parser.js');
var assert    = require('assert');

var platformsFolder = __dirname + '/../platforms';
var cfgFilename     = 'manifest.json';

var platforms       = fs.readdirSync(platformsFolder);

function testFiles(files, platformName, parserFile, done) {
  
  var test = shell.exec("echo '[]' | " + parserFile, {async: false, silent: true});
  assert.ok(test.code !== 126, "Platform " + platformName + " : the parser is not executable");

  csvextractor.extract(files, [], function (records) {
    var child = shell.exec(parserFile, {async: true, silent: true});

    var stream = byline.createStream(child.stdout);
    var record = records.pop();
    
    stream.on('data', function (line) {
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

    stream.on('end', function () {
      done();
    });

    stream.on('error', function (err) {
      throw err;
    });
    
    if (record) {
      should(record.url, 'some entries in the test file have no URL')
      child.stdin.write(record.url + '\n');
    } else {
      done();
    }
  }, {silent: true, type: 'files'});
}

function fetchPlatform(platform) {
  
  var platformPath = platformsFolder + '/' + platform;

  if (!platform) {
    
    return;
  } else if (/^\./.test(platform) || !fs.statSync(platformPath).isDirectory()) {
    
    fetchPlatform(platforms.pop());
    return;
  }
  var configFile = platformPath + '/' + cfgFilename;

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
        var testFolder = platformsFolder + '/' + platform + '/test';

        should.ok(fs.existsSync(testFolder) && fs.statSync(testFolder).isDirectory(),
                  "no test folder");
        var files = fs.readdirSync(testFolder);
        var csvFiles = [];
        
        for (var i in files) {
          
          var csvPath = testFolder + '/' + files[i];

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