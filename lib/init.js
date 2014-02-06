'use strict';

var fs           = require('graceful-fs');
var path         = require('path');
var pp           = require('./platform-parser.js');
var csvextractor = require('./csvextractor.js');
var parserlist   = require('./parserlist.js');
var util         = require('util');

var platformsFolder = path.join(__dirname, '/../platforms-parsers');
var cfgFilename     = 'manifest.json';
var parsers         = {};

var red   = '\u001b[31m'; // Color red
var reset = '\u001b[0m';  // Color reset

function printError() {
  arguments[0] = util.format('%s[ERROR]%s %s', red, reset, arguments[0]);
  console.error(util.format.apply(this, arguments));
}

/**
 * Looks for config files of every platform and exports an array
 * matching 'domain => parser address'
 */
fs.readdirSync(platformsFolder).forEach(function (folderName) {

  var folderAddress = path.join(platformsFolder, folderName);

  if (/^\./.test(folderName) || !fs.statSync(folderAddress).isDirectory()) {

    return;
  }
  var configFile = path.join(folderAddress, cfgFilename);

  if (fs.existsSync(configFile) && fs.statSync(configFile).isFile()) {

    var config = require(configFile);

    if (config.name && ((config.domains) || config['pkb-domains'])) {

      var pfile           = pp.getParser(folderName);
      var isNode          = pfile.language === 'node';
      var domainsPkbField = config['pkb-domains'];
      if (pfile && pfile.language !== '') {

        if (config.domains) {
          for (var j in config.domains) {
            var unique = parserlist.add(config.domains[j], pfile.path, isNode, config.name);
            if (!unique) {
              var first = parserlist.get(config.domains[j]).platform;
              printError('Domain "%s" is use twice (in %s and %s). %s will be used.',
                config.domains[j], first, config.name, first);
            }
          }
        }

        if (domainsPkbField) {
          var pkbFolder = path.join(__dirname, '../platforms-kb/', config.name);

          fs.readdir(pkbFolder, function (err, files) {
            if (err) {
              printError('The PKB of %s could not be found, no domain was added', folderName);
              return;
            }

            var pkbFiles = [];
            files.forEach(function (pkbFile) {
              var file = path.join(pkbFolder, pkbFile);
              if (fs.existsSync(file) && fs.statSync(file).isFile() && /\.pkb\.csv$/.test(file)) {
                pkbFiles.push(file);
              }
            });

            if (pkbFiles.length) {
              csvextractor.extract(pkbFiles, [domainsPkbField], function (err, records) {
                if (err) {
                  printError('Syntax error into a pkb file of %s - %s', folderName, err);
                  // do not return here because it's not a blocking error
                  // ezpaarse can continue to work if the pkb is wrong...
                }
                if (records.length > 0) {
                  records.forEach(function (record) {
                    parserlist.add(record[domainsPkbField], pfile.path, isNode, config.name);
                    if (!unique) {
                      var first = parserlist.get(record[domainsPkbField]);
                      if (config.name != first.platform) {
                        printError('Domain "%s" is use twice (in %s and %s). %s will be used.',
                          record[domainsPkbField], first.platform, config.name, first.platform);
                      }
                    }
                  });
                } else {
                  printError('No domain found in the PKB of %s (using field: "%s")',
                    folderName, domainsPkbField);
                }
              }, {silent: true});
            } else {
              printError('No pkb file found in %s : no domain was added', folderName);
            }
          });
        }

      } else {

        printError('No valid parser in %s', folderName);
      }
    } else {

      printError('The manifest in %s does not contain any domain info', folderName);
    }
  } else {

    printError('No manifest found in %s ', folderName);
  }
});

module.exports = parsers;