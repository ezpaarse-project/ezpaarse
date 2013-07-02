/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs           = require('fs');
var path         = require('path');
var async        = require('async');
var pp           = require('./platform-parser.js');
var csvextractor = require('./csvextractor.js');
var parserlist   = require('./parserlist.js');

var platformsFolder = path.join(__dirname, '/../platforms');
var cfgFilename     = 'manifest.json';
var parsers         = {};

var red     = '\u001b[31m';  // Color red
var reset   = '\u001b[0m';   // Color reset

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
            parserlist.add(config.domains[j], pfile.path, isNode, config.name);
          }
        }

        if (domainsPkbField) {

          var pkbFile = path.join(__dirname, '../platforms-kb/', config.name + '.pkb.csv');
          fs.exists(pkbFile, function (exists) {
            if (exists) {
              csvextractor.extract(pkbFile, [domainsPkbField], function (records) {
                if (records.length > 0) {
                  records.forEach(function (record) {
                    parserlist.add(record[domainsPkbField], pfile.path, isNode, config.name);
                  });
                } else {
                  console.error(red + 'No domain found in the PKB of ' + folderName
                                + ' (using field: "' + domainsPkbField + '")' + reset);
                }
              }, {silent: true});
            } else {
              console.error(red + 'The PKB of ' + folderName + ' could not be found,'
                                + ' no domain was added' + reset);
            }
          });
        }

      } else {
        
        console.error(red + 'No valid parser in ' + folderName + reset);
      }
    } else {
      
      console.error(red + 'The manifest in ' + folderName +
        ' does not contain any domain info' + reset);
    }
  } else {
    
    console.error(red + 'No manifest found in ' + folderName + reset);
  }
});

module.exports = parsers;