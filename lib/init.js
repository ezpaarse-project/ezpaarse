/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs    = require('fs');
var csv   = require('csv');
var async = require('async');
var pp    = require('./platform-parser.js');

var platformsFolder = __dirname + '/../platforms';
var cfgFilename     = 'manifest.json';
var parsers         = {};

var red     = '\u001b[31m';     // Color red
var reset   = '\u001b[0m';   // Color reset

/**
 * Looks for config files of every plateforms and exports an array
 * matching 'domain => parser address'
 */
fs.readdirSync(platformsFolder).forEach(function (folderName) {
  
  var folderAddress = platformsFolder + '/' + folderName;

  if (/^\./.test(folderName) || !fs.statSync(folderAddress).isDirectory()) {
    
    return;
  }
  var configFile = folderAddress + '/' + cfgFilename;

  if (fs.existsSync(configFile) && fs.statSync(configFile).isFile()) {
    
    var config = require(configFile);

    if (config.domains && config.domains.length > 0 && config.name) {

      var pfile = pp.getParser(folderName);

      if (pfile && pfile.language !== '') {
        for (var j in config.domains) {
          
          parsers[config.domains[j]] = {
            file: pfile.path,
            isNode: pfile.language === 'node',
            platform: config.name
          };
        }
      } else {
        
        console.error(red + 'No valid parser in ' + folderName + reset);
      }
    } else {
      
      console.error(red + 'The config file in ' + folderName +
        ' does not contain any domain' + reset);
    }
  } else {
    
    console.error(red + 'No config file found in ' + folderName + reset);
  }
});

module.exports = parsers;