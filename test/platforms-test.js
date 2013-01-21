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

var platformsFolder = __dirname + '/../platforms';
var cfgFilename     = 'manifest.json';

var platforms       = fs.readdirSync(platformsFolder);

function testFiles(files, parserFile, platform) {
  if (files.length === 0) {
    return;
  }
  describe(platform, function () {
    it('works', function (done) {
      csvextractor(files, ['url', 'issn', 'pid', 'type'], function (records) {
        var child = shell.exec(parserFile, {async: true, silent: true})
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
        })

        stream.on('end', function () {
          done();
        });
        
        // fs.createReadStream(urlFile).pipe(child.stdin);
        if (record) {
          should(record.url, 'some entries have no URL')
          child.stdin.write(record.url + '\n');
        } else {
          done();
        }
      }, {silent: true, type: 'files'});
    });
  });
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
      var parserFile = platformsFolder + '/' + platform + '/parser';

      if (fs.existsSync(parserFile) && fs.statSync(parserFile).isFile()) {
        var testFolder = platformsFolder + '/' + platform + '/test';

        if (fs.existsSync(testFolder) && fs.statSync(testFolder).isDirectory()) {
          var files = fs.readdirSync(testFolder);
          var csvFiles = [];
          for (var i in files) {
            if (/\.csv$/.test(files[i])) {
              csvFiles.push(testFolder + '/' + files[i]);
            }
          }
          testFiles(csvFiles, parserFile, config.name);
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