/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

/**
 * Manage a report file
 */

var fs = require('fs');

var ReportManager      = function (file, baseReport) {
  var self             = this;
  var report           = baseReport || {};
  var startTime        = process.hrtime();
  self.finalized       = false;
  var lastLinesInput   = 0;
  var lastElapsedTime;

  /**
   * Increments the value of a given entry, or sets it to 1 if absent
   * If the entry is not a number, it will be overriden
   * @param {String} group
   * @param {String} entry
   */
  self.inc = function (group, entry) {
    if (!report[group]) { report[group] = {}; }
    var c = report[group][entry];
    report[group][entry] = (c && typeof c == 'number') ? ++c : 1;
  };

  /**
   * Set the value of a given entry
   * @param {String} group
   * @param {String} entry
   * @param {String} value
   */
  self.set = function (group, entry, value) {
    if (!report[group]) { report[group] = {}; }
    report[group][entry] = value;
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
      var gp = report[group] || {};
      return gp[entry];
    } else {
      for (var g in report) {
        if (report[g][entry] !== undefined) {
          return report[g][entry];
        }
      }
      return undefined;
    }
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
    self.updateComputed();
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
      self.updateComputed();
      self.updateFile(function () {
        if (socket) {socket.emit('report', report); }
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
    //initialize lastElapsedTime the first time for avoiding division by 0.
    //in updateComputed, next lastElapsedTime will be equal to elapsedTime.
    lastElapsedTime = process.hrtime(startTime);
    lastElapsedTime = lastElapsedTime[0] * 1e3 + lastElapsedTime[1] / 1e6; // milliseconds
    update(intervalId, socket);
  };

  self.updateComputed = function () {
    var nbRejects     = self.get('rejets', 'nb-lines-unknown-format');
    nbRejects        += self.get('rejets', 'nb-lines-unknown-domains');
    nbRejects        += self.get('rejets', 'nb-lines-unqualified-ecs');
    var nbRealInput   = self.get('general', 'nb-lines-input')
                        - self.get('rejets', 'nb-lines-ignored');
    var rejectionRate = (nbRejects * 100 / nbRealInput).toFixed(2);
    self.set('general', 'Rejection-Rate', rejectionRate + ' %');

    var elapsedTime = process.hrtime(startTime);
    elapsedTime     = elapsedTime[0] * 1e3 + elapsedTime[1] / 1e6; // milliseconds
    

    // instant speed if not finalized, else global speed
    if (!self.finalized) {
      var t = (elapsedTime - lastElapsedTime) / 1000;
      self.set('general', 'process-speed',
      ((self.get('general', 'nb-lines-input') - lastLinesInput) / t).toFixed(0)
      + ' lignes/s');
      lastElapsedTime = elapsedTime;
      lastLinesInput = self.get('general', 'nb-lines-input');
    } else {
      self.set('general', 'process-speed',
      (self.get('general', 'nb-lines-input') / (elapsedTime / 1000)).toFixed(0)
      + ' lignes/s');
    }

    var time = '';
    elapsedTime /= 1000;
    time = (elapsedTime % 60).toFixed(0) + ' s ';
    if ((elapsedTime /= 60) >= 1) {
      time = (elapsedTime % 60).toFixed(0) + ' m ' + time;
      if ((elapsedTime /= 60) >= 1) {
        time = (elapsedTime % 60).toFixed(0) + ' h ' + time;
      }
    }

    self.set('general', 'Job-Duration', time);
  };
};

module.exports = ReportManager;