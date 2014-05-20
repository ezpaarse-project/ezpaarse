'use strict';

var fs   = require('graceful-fs');
var path = require('path');

var platformsFolder = path.join(__dirname, '/../platforms');

/**
 * Takes a platform's name in parameter and return an object containing
 * the parser's path and language. Returns false if there is no parser or
 * pfile with language = '' if language is not defined.
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

  var folderAddress = path.join(platformsFolder, platformName);
  var pfile = false;

  if (fs.existsSync(folderAddress) && fs.statSync(folderAddress).isDirectory()) {

    var parserAddress = path.join(folderAddress, '/parser');
    var parserJsAddress = path.join(folderAddress, '/parser.js');
    var parserMiscAddress;
    var firstLine;
    var match;
    var lang = '';

    if (fs.existsSync(parserAddress) && fs.statSync(parserAddress).isFile()) {

      firstLine = fs.readFileSync(parserAddress, 'utf8').split('\n')[0];
      match = /^\#\!\/usr\/bin\/env ([a-zA-Z]+)$/.exec(firstLine);

      if (match && match[1]) {

        lang = match[1];
      }
      pfile = {
          path: parserAddress,
          language: lang
        };
    } else if (fs.existsSync(parserJsAddress) && fs.statSync(parserJsAddress).isFile()) {

      firstLine = fs.readFileSync(parserJsAddress, 'utf8').split('\n')[0];
      match = /^\#\!\/usr\/bin\/env ([a-zA-Z]+)$/.exec(firstLine);

      if (match && match[1]) {

        lang = match[1];
      }
      pfile = {
          path: parserJsAddress,
          language: lang
        };
    } else {

      var fileNames = fs.readdirSync(folderAddress);

      for (var i = 0; i < fileNames.length; i++) {

        parserMiscAddress = path.join(folderAddress, fileNames[i]);

        if (/^parser\.[a-zA-Z0-9]+$/.test(fileNames[i])
          && fs.statSync(parserMiscAddress).isFile()) {

          firstLine = fs.readFileSync(parserMiscAddress, 'utf8').split('\n')[0];
          match = /^\#\!\/usr\/bin\/env ([a-zA-Z]+)$/.exec(firstLine);

          if (match && match[1]) {

            lang = match[1];
          }
          pfile = {
              path: parserMiscAddress,
              language: lang
            };
        }
      }
    }
  }

  return pfile;
};