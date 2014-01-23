/*global describe, it*/
'use strict';

var fs           = require('fs');
var path         = require('path');
var should       = require('should');
var csvextractor = require('../lib/csvextractor.js');
var pp           = require('../lib/platform-parser.js');
var parserlist   = require('../lib/parserlist.js');

var platformsFolder = path.join(__dirname, '/../platforms-parsers');
var platforms       = fs.readdirSync(platformsFolder);
var cfgFilename     = 'manifest.json';


function testPlatform(platform, done) {

  var platformPath = platformsFolder + '/' + platform;

  if (!platform) {
    done();
    return;
  } else if (/^\./.test(platform) || !fs.statSync(platformPath).isDirectory()) {
    testPlatform(platforms.pop(), done);
    return;
  }

  var folderAddress = path.join(platformsFolder, platform);

  if (/^\./.test(platform) || !fs.statSync(folderAddress).isDirectory()) {
    return;
  }
  var configFile = path.join(folderAddress, cfgFilename);

  should.ok(fs.existsSync(configFile) && fs.statSync(configFile).isFile(),
    platform + ' has no manifest');

  var config          = require(configFile);
  var pfile           = pp.getParser(platform);
  var isNode          = pfile.language === 'node';
  var domainsPkbField = config['pkb-domains'];

  should.ok(pfile && pfile.language !== '', 'No valid parser in ' + platform);
  should.ok(config.name && ((config.domains) || config['pkb-domains']),
    'The manifest in ' + platform + ' does not contain anything about domains');

  if (config.domains) {
    for (var j in config.domains) {
      var unique = parserlist.add(config.domains[j], pfile.path, isNode, config.name);
      if (!unique) {
        var first = parserlist.get(config.domains[j]).platform;
        throw new Error('Domain "' + config.domains[j] + '" is use twice '
          + '(in ' + first + ' and ' + config.name + ')');
      }
    }
  }

  if (domainsPkbField) {
    var pkbFolder = path.join(__dirname, '../platforms-kb/', config.name);

    fs.readdir(pkbFolder, function (err, files) {
      should.not.exist(err, 'The PKB directory of ' + platform + ' could not be found');

      var pkbFiles = [];
      files.forEach(function (pkbFile) {
        var file = path.join(pkbFolder, pkbFile);
        if (fs.existsSync(file) && fs.statSync(file).isFile() && /\.pkb\.csv$/.test(file)) {
          pkbFiles.push(file);
        }
      });

      should.ok(pkbFiles.length > 0, 'No PKB file found in the directory of ' + platform);
      csvextractor.extract(pkbFiles, [domainsPkbField], function (err, records) {

        should.not.exist(err, 'Syntax error into a pkb file of ' + platform + ' - ' + err);
        should.ok(records.length > 0, 'The PKB of ' + platform + ' has no domain in field "'
            + domainsPkbField + '"');

        records.forEach(function (record) {
          parserlist.add(record[domainsPkbField], pfile.path, isNode, config.name);
          if (!unique) {
            var first = parserlist.get(record[domainsPkbField]);

            if (config.name != first.platform) {
              throw new Error('Domain "' + record[domainsPkbField] + '" is use twice '
                + '(in ' + first.platform + ' and ' + config.name + ')');
            }
          }
        });

        testPlatform(platforms.pop(), done);
      }, {silent: true});
    });
  } else {
    testPlatform(platforms.pop(), done);
  }
}

describe('All domains', function () {
  this.timeout(2000);

  it('should be pointing to one parser only', function (done) {
    testPlatform(platforms.pop(), done);
  });
});