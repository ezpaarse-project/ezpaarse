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
  var lastLinesInput = 0;
  var lastElapsedTime;

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
    var nbRejects     = self.get('nb-lines-unknown-format');
    nbRejects        += self.get('nb-lines-unknown-domains');
    nbRejects        += self.get('nb-lines-unqualified-ecs');
    var nbRealInput   = self.get('nb-lines-input') - self.get('nb-lines-ignored');
    var rejectionRate = (nbRejects * 100 / nbRealInput).toFixed(2);
    self.set('Rejection-Rate', rejectionRate + ' %');

    var elapsedTime = process.hrtime(startTime);
    elapsedTime     = elapsedTime[0] * 1e3 + elapsedTime[1] / 1e6; // milliseconds
    
    // instant speed if not finalized, else global speed
    if (!self.finalized) {
      var time = (elapsedTime - lastElapsedTime) / 1000;
      self.set('process-speed',
      ((self.get('nb-lines-input') - lastLinesInput) / time).toFixed(0)
      + ' lignes/s');
      lastElapsedTime = elapsedTime;
      lastLinesInput = self.get('nb-lines-input');
    } else {
      self.set('process-speed',
      (self.get('nb-lines-input') / (elapsedTime / 1000)).toFixed(0)
      + ' lignes/s');
    }

    var time = '';
    time = (elapsedTime % 1000).toFixed(0) + ' ms';
    if ((elapsedTime /= 1000) >= 1) {
      time = (elapsedTime % 60).toFixed(0) + ' s ' + time;
      if ((elapsedTime /= 60) >= 1) {
        time = (elapsedTime % 60).toFixed(0) + ' m ' + time;
        if ((elapsedTime /= 60) >= 1) {
          time = (elapsedTime % 60).toFixed(0) + ' h ' + time;
        }
      }
    }

    self.set('Job-Duration', time);
  };
};

module.exports = ReportManager;