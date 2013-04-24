/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs    = require('fs');

var platformsFolder = __dirname + '/../platforms';

/**
 * Takes a platform's name in parameter and return an object containing
 * the parser's path and language.
 * If there are more than one parser, the priorities are:
 *    1) parser
 *    2) parser.js
 *    3) first found parser
 * @param  {String} platformName
 * @return {Object} pfile object containing parser's path and language
 */
exports.getParser = function (platformName) {
  
  if (!platformName) {
    return false;
  }

  var folderAddress = platformsFolder + '/' + platformName.toLowerCase();
  var pfile = false;

  if (fs.existsSync(folderAddress) && fs.statSync(folderAddress).isDirectory()) {
   
    var parserAddress = folderAddress + '/parser';
    var parserJsAddress = folderAddress + '/parser.js';
    var parserMiscAddress;
    var firstLine;
    var match;

    if (fs.existsSync(parserAddress) && fs.statSync(parserAddress).isFile()) {
    
      firstLine = fs.readFileSync(parserAddress, 'utf8').split('\n')[0];
      match = /^\#\!\/usr\/bin\/env ([a-zA-Z]+)$/.exec(firstLine);
      
      if (match && match[1]) {

        pfile = {
          path: parserAddress,
          language: match[1]
        };
      }
    } else if (fs.existsSync(parserJsAddress) && fs.statSync(parserJsAddress).isFile()) {

      firstLine = fs.readFileSync(parserJsAddress, 'utf8').split('\n')[0];
      match = /^\#\!\/usr\/bin\/env ([a-zA-Z]+)$/.exec(firstLine);
      
      if (match && match[1]) {

        pfile = {
          path: parserJsAddress,
          language: match[1]
        };
      }
    } else {

      var fileNames = fs.readdirSync(folderAddress);

      for (var i = 0; i < fileNames.length; i++) {
        
        parserMiscAddress = folderAddress + '/' + fileNames[i];

        if (/^parser\.[a-zA-Z0-9]+$/.test(fileNames[i])
          && fs.statSync(parserMiscAddress).isFile()) {

          firstLine = fs.readFileSync(parserMiscAddress, 'utf8').split('\n')[0];
          match = /^\#\!\/usr\/bin\/env ([a-zA-Z]+)$/.exec(firstLine);
      
          if (match && match[1]) {

            pfile = {
              path: parserJsAddress,
              language: match[1]
            };
            break;
          }
        }
      }
    }
  }

  return pfile;
}