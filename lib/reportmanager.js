/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

/**
 * Manage a report file
 */

var fs = require('fs');

var ReportManager = function (file, baseReport) {
  var self       = this;
  var report     = baseReport || {};
  self.finalized = false;

  /**
   * Initialize one or more counters
   * @param {String|Array} counters  a counter name, or an array of counter names
   */
  self.initCounter = function (counters) {
    if (Array.isArray(counters)) {
      counters.forEach(function (counter) {
        report[counter] = 0;
      });
    } else {
      report[counters] = 0;
    }
  };

  /**
   * Increments the value of a given entry, or sets it to 1 if absent
   * If the entry is not a number, it will be overriden
   * @param {String} entry
   */
  self.inc = function (entry) {
    var c = report[entry];
    report[entry] = (c && typeof c == 'number') ? ++c : 1;
  };

  /**
   * Set the value of a given entry
   * @param {String} entry
   * @param {String} value
   */
  self.set = function (entry, value) {
    report[entry] = value;
  };

  /**
   * Returns the value of an entry
   * @param  {String}  entry
   * @return {Any}
   */
  self.get = function (entry) {
    return report[entry];
  };

  /**
   * Updates the report file
   */
  self.updateFile = function (callback) {
    fs.writeFile(file, JSON.stringify(report, null, 2), callback)
  };

  /**
   * Update the report and stop the update cycle
   */
  self.finalize = function (callback, socket) {
    self.finalized = true;
    self.updateFile(callback);
    if (socket) { socket.emit('report', report); }
  };

  /**
   * Update the report periodically by calling updateFile
   * @param  {Object} interId interval identifier
   * @param  {Object} socket  socket.io client
   */
  function update(interId, socket) {
    if (self.finalized) {
      clearInterval(interId);
    } else {
      self.updateFile(function () {
        if (socket) { socket.emit('report', report); }
      });
    }
  }

  /**
   * Call update periodically
   * @param {Integer} frequency  the cycle in seconds between each update
   *                             ( default 10sec )
   */
  self.cycle = function (frequency, socket) {
    var intervalId = setInterval(function () {
      update(intervalId, socket);
    }, frequency ? frequency * 1000 : 5000);
    update(intervalId, socket);
  }

};

module.exports = ReportManager;