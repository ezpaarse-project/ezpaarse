/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

/**
 * This module handles a parser list and is used to find a parser using a domain.
 */

var fs           = require('fs');
var path         = require('path');

var usageFile = path.join(__dirname, '../usage.json');
var usage = {
  "general": {},
  "stats": {}
};

var Usage = function () {
  var self  = this;
 
  if (fs.existsSync(usageFile) && fs.statSync(usageFile).isFile()) {
    console.log(usageFile);
    usage = require(usageFile);
  }

  /**
   * Increments the value of a given entry, or sets it to 1 if absent
   * If the entry is not a number, it will be overriden
   * @param {String} group
   * @param {String} entry
   */
  self.inc = function (group, entry) {
    if (!usage[group]) { usage[group] = {}; }
    var c = usage[group][entry];
    usage[group][entry] = (c && typeof c == 'number') ? ++c : 1;
  };

  /**
   * Set the value of a given entry
   * @param {String} group
   * @param {String} entry
   * @param {String} value
   */
  self.set = function (group, entry, value) {
    if (!usage[group]) { usage[group] = {}; }
    usage[group][entry] = value;
  };

  /**
   * Returns the value of an entry
   * @param  {String}  group (optional)
   * @param  {String}  entry
   * @return {Any}
   */
  self.get = function (group, entry) {
    if (arguments.length == 1) {
      entry = group;
      group = false;
    }
    if (group) {
      var gp = usage[group] || {};
      return gp[entry];
    } else {
      for (var g in usage) {
        if (usage[g][entry] !== undefined) {
          return usage[g][entry];
        }
      }
      return undefined;
    }
  };

  /**
   * Updates the usage file
   */
  self.updateFile = function (callback) {
    fs.writeFile(usageFile, JSON.stringify(usage, null, 2), callback);
  };
}


module.exports = new Usage();