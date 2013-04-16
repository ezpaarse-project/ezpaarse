/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs    = require('fs');
var csv   = require('csv');
var async = require('async');

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
      
      // try to find a parser for this platform
      // TODO: could be improved with a directory search on the "parser*" pattern
      var noParserForThisPlatform = true;
      [ 'parser.php', 'parser.py', 'parser.pl', 'parser.js', 'parser' ].forEach(function (parser) {
        
        var parserFile = folderAddress + '/' + parser;

        if (fs.existsSync(parserFile) && fs.statSync(parserFile).isFile()) {
          // extract the programming language of the parser
          var firstLine = fs.readFileSync(parserFile, 'utf8').split('\n')[0];
          var match = /^\#\!\/usr\/bin\/env ([a-zA-Z]+)$/.exec(firstLine);
          if (match && match[1]) {
            var parserLanguage = match[1];
            for (var j in config.domains) {
              parsers[config.domains[j]] = {
                file: parserFile,
                isNode: parserLanguage === 'node',
                platform: config.name
              };
              noParserForThisPlatform = false;
            }
          } else {
            console.error(red + 'Couldn\'t determine the language of the parser in '
              + folderName + reset);
          }
        }
      });

      if (noParserForThisPlatform) {
        console.error(red + 'No parser found in ' + folderName + reset);
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