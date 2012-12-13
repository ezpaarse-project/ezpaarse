/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs = require('fs');
var csv = require('csv');
var async = require('async');

var platformsFolder = __dirname + '/platforms';
var cfgFilename = 'manifest.json';
var parsers = {};
var knowledge = {};

var folders = fs.readdirSync(platformsFolder);
var red = '\u001b[31m';     // Color red
var reset = '\u001b[0m';   // Color reset

/*
* Looks for config files of every plateforms and exports an array
* matching 'domain name => parser file address'
*/

function fetch(folder, callback) {
  if (!folder) {
    callback(parsers, knowledge);
    return;
  } else if (/^\./.test(folder)) {
    fetch(folders.pop(), callback);
    return;
  }
  var configFile = platformsFolder + '/' + folder + '/' + cfgFilename;

  if (fs.existsSync(configFile) && fs.statSync(configFile).isFile()) {
    var config = JSON.parse(fs.readFileSync(configFile, 'UTF-8'));

    if (config.domains && config.domains.length > 0 && config.name) {
      var parserFile = platformsFolder + '/' + folder + '/parser';

      if (fs.existsSync(parserFile) && fs.statSync(parserFile).isFile()) {
        for (var j in config.domains) {
          parsers[config.domains[j]] =
          {
            parser: parserFile,
            platform: config.name
          };
        }
        var csvFile = platformsFolder + '/' + folder + '/' + config.name + '.csv';

        if (fs.existsSync(csvFile) && fs.statSync(csvFile).isFile()) {
          knowledge[config.name] = {};
          csv().from.path(csvFile)
          .on('record', function (data) {
            knowledge[config.name][data[4]] =
              {
                pissn: data[5],
                eissn: data[6]
              };
          })
          .on('end', function () {
            fetch(folders.pop(), callback);
          });
        } else {
          console.log(red + 'No CSV file found in ' + folder + reset);
          fetch(folders.pop(), callback);
        }
      } else {
        console.log(red + 'No parser found in ' + folder + reset);
        fetch(folders.pop(), callback);
      }
    } else {
      console.log(red + 'The config file in ' + folder +
        ' does not contain any domain or parser name' + reset);
      fetch(folders.pop(), callback);
    }
  } else {
    console.log(red + 'No config file found in ' + folder + reset);
    fetch(folders.pop(), callback);
  }
}

module.exports = function (callback) {
  fetch(folders.pop(), callback);
};