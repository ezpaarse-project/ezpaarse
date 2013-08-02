/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs = require('fs');

/*
* Looks for a folder or try to create it
*/
exports.check = function (folder) {
  var dirIsAvailable = true;
  if (fs.existsSync(folder)) {
    if (!fs.statSync(folder).isDirectory()) {
      dirIsAvailable = false;
    }
  } else {
    try {
      fs.mkdirSync(folder);
    } catch (e) {
      dirIsAvailable = false;
    }
  }
  return dirIsAvailable;
};