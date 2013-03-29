/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs    = require('fs');
var csv   = require('csv');
var async = require('async');

var platformsFolder = __dirname + '/../platforms';
var cfgFilename     = 'manifest.json';
var parsers         = {};

var folders = fs.readdirSync(platformsFolder);
var red     = '\u001b[31m';     // Color red
var reset   = '\u001b[0m';   // Color reset

/*
* Looks for config files of every plateforms and exports an array
* matching 'domain => parser address'
*/

for (var i = 0, l = folders.length; i < l; i++) {
  var folderName    = folders[i];
  var folderAddress = platformsFolder + '/' + folderName;

  if (/^\./.test(folderName) || !fs.statSync(folderAddress).isDirectory()) {
    continue;
  }
  var configFile = folderAddress + '/' + cfgFilename;

  if (fs.existsSync(configFile) && fs.statSync(configFile).isFile()) {
    var config = require(configFile);

    if (config.domains && config.domains.length > 0 && config.name) {
      var parserFile = folderAddress + '/parser';

      if (fs.existsSync(parserFile) && fs.statSync(parserFile).isFile()) {
        var firstLine = fs.readFileSync(parserFile, 'utf8').split('\n')[0];
        var match = /^\#\!\/usr\/bin\/env ([a-zA-Z]+)$/.exec(firstLine);

        if (match && match[1]) {
          var parserLanguage = match[1];
          for (var j in config.domains) {
            parsers[config.domains[j]] =
            {
              file: parserFile,
              isNode: parserLanguage === 'node',
              platform: config.name
            };
          }
        } else {
          console.error(red + 'Couldn\'t determine the language of the parser in '
            + folderName + reset);
        }
      } else {
        console.error(red + 'No parser found in ' + folderName + reset);
      }
    } else {
      console.error(red + 'The config file in ' + folderName +
        ' does not contain any domain' + reset);
    }
  } else {
    console.error(red + 'No config file found in ' + folderName + reset);
  }
}

module.exports = parsers;