/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

/**
 * Manage a report file
 */

var fs = require('fs');

var ReportManager = function (file, updateFrequency) {
  var self        = this;
  var report      = {};
  var upFrequency = updateFrequency || 100;
  var counter     = 0;

  /**
   * Increments the value of a given entry, or sets it to 1 if absent
   * If the entry is not a number, it will be overriden
   * @param  {String} entry
   */
  self.inc = function (entry) {
    var c = report[entry];
    report[entry] = (c && typeof c == 'number') ? ++c : 1;
    if (++counter > updateFrequency) { self.updateFile(); counter = 0; }
  }

  /**
   * Set the value of a given entry
   * @param {String} entry
   * @param {String} value
   */
  self.set = function (entry, value) {
    report[entry] = value;
    if (++counter > updateFrequency) { self.updateFile(); counter = 0; }
  }

  /**
   * Returns the value of an entry
   * @param  {String}  entry
   * @return {Any}
   */
  self.get = function (entry) {
    return report[entry] || false;
  }

  /**
   * Updates the report file
   */
  self.updateFile = function (callback) {
    fs.writeFile(file, JSON.stringify(report, null, 2), callback)
  }
}

module.exports = ReportManager;