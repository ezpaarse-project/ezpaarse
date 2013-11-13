/*jshint maxlen: 180*/
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
  var timeout          = 10; //seconds
  var lastLinesInput   = 0;
  var lastElapsedTime;
  var lastUpdateTime;
  var intervalId;

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
    fs.writeFile(file, JSON.stringify(report, null, 2), callback);
  };

  /**
   * Update the report and stop the update cycle
   */
  self.finalize = function (callback, socket) {
    clearInterval(intervalId);
    self.finalized = true;
    self.updateComputed();
    self.updateFile(function () {
      updateGeneralUsage(callback);
      if (socket) { socket.emit('report', report); }
    });
  };

  /**
   * Update ezpaarse general usage
   */
  function updateGeneralUsage(callback) {
    var usage = require('./usagemanager.js');
    var match1, match2, match3, match4, match5, match6;
    var launched = 0;
    if (usage.get('general', 'Job-IDs') === undefined) {
      usage.set('general', 'Job-IDs', 1);
    } else {
      launched = Number(usage.get('general', 'Job-IDs'));
      usage.inc('general', 'Job-IDs');
    }
    if (usage.get('general', 'nb-lines-input-total') !== undefined) {
      usage.set('general', 'nb-lines-input-total',
        usage.get('general', 'nb-lines-input-total')
        + self.get('general', 'nb-lines-input'));
    } else {
      usage.set('general', 'nb-lines-input-total', self.get('general', 'nb-lines-input'));
    }

    if (usage.get('general', 'nb-ecs-total') !== undefined) {
      usage.set('general', 'nb-ecs-total',
        usage.get('general', 'nb-ecs-total')
       + self.get('general', 'nb-ecs'));
    } else {
      usage.set('general', 'nb-ecs-total', self.get('general', 'nb-ecs'));
    }

    var rejectionrate = 0;
    var rejectionrateaverage = 0;
    if ((match1 = /([^.]*)(.[^.]*)? %/.exec(self.get('general', 'Rejection-Rate'))) !== null) {
      rejectionrate = Math.round(Number(match1[1])) / 100;
    }
    if ((match2 = /([^.]*)(.[^.]*)? %/.exec(usage.get('general', 'Rejection-Rate-average'))) !== null) {
      rejectionrateaverage = Math.round(Number(match2[1])) / 100;
    }
    rejectionrateaverage = Math.round((rejectionrateaverage * launched
    + rejectionrate) / (launched + 1) * 10000) / 100;
    usage.set('general', 'Rejection-Rate-average', rejectionrateaverage + ' %');

    var jobduration = 0;
    var jobdurationaverage = 0;
    if ((match3 = /([0-9]+) s /.exec(self.get('general', 'Job-Duration'))) !== null) {
      jobduration = Number(match3[1]);
    }
    if ((match4 = /([0-9]+) s /.exec(usage.get('general', 'Job-Duration-average'))) !== null) {
      jobdurationaverage = Number(match4[1]);
    }
    jobdurationaverage = Math.floor((jobdurationaverage * launched
     + jobduration) / (launched + 1));
    usage.set('general', 'Job-Duration-average', jobdurationaverage + ' s ');

    var processspeed = 0;
    var processspeedaverage = 0;
    if ((match5 = /([0-9]+) lignes\/s/.exec(self.get('general', 'process-speed'))) !== null) {
      processspeed = Number(match5[1]);
    }
    if ((match6 = /([0-9]+) lignes\/s/.exec(usage.get('general', 'process-speed-average'))) !== null) {
      processspeedaverage = Number(match6[1]);
    }
    processspeedaverage = Math.floor((processspeedaverage * launched
     + processspeed) / (launched + 1));
    usage.set('general', 'process-speed-average', processspeedaverage + ' lignes/s');

    if (!usage.get('general', 'Job-Date-start')) {
      usage.set('general', 'Job-Date-start', self.get('Job-Date'));
    }
    usage.set('general', 'Job-Date-end', self.get('Job-Date'));

    /** update ezpaarse stats usage */
    var maxPlatforms = usage.get('stats', 'max-platforms')
      ? usage.get('stats', 'max-platforms') : 0;
    if (maxPlatforms < self.get('stats', 'platforms')) {
      maxPlatforms = self.get('stats', 'platforms');
    }
    usage.set('stats', 'max-platforms', maxPlatforms);
    var statsKeys = Object.keys(report.stats);
    statsKeys.forEach(function (value) {
      usage.set('stats', value, usage.get('stats', value) ?
        usage.get('stats', value) + self.get('stats', value) : self.get('stats', value));
    });

    usage.updateFile(callback);
  }

  /**
   * Update the report by calling updateFile
   * @param  {Object} socket  socket.io client
   */
  function update(socket) {
    checkTimeout();
    self.updateComputed();
    self.updateFile(function () {
      if (socket) { socket.emit('report', report); }
    });
  }

  /**
   * Check if the number of input lines has changed since last update
   * if it doesn't change after 10s, stop updating
   */
  function checkTimeout() {
    var lines = self.get('general', 'nb-lines-input');
    if (lines == lastLinesInput) {
      if (process.hrtime(lastUpdateTime)[0] > timeout) {
        clearInterval(intervalId);
      }
    } else {
      lastUpdateTime = process.hrtime();
    }
  }

  /**
   * Call update periodically
   * @param {Integer} frequency  the cycle in seconds between each update
   *                             ( default 10sec )
   */
  self.cycle = function (frequency, socket) {
    //initialize lastElapsedTime the first time for avoiding division by 0.
    //in updateComputed, next lastElapsedTime will be equal to elapsedTime.
    lastUpdateTime  = process.hrtime();
    lastElapsedTime = process.hrtime(startTime);
    lastElapsedTime = lastElapsedTime[0] * 1e3 + lastElapsedTime[1] / 1e6; // milliseconds
    update(socket);

    intervalId = setInterval(function () {
      update(socket);
    }, frequency ? frequency * 1000 : 5000);
  };

  self.updateComputed = function () {
    var nbRejects     = self.get('rejets', 'nb-lines-unknown-format');
    nbRejects        += self.get('rejets', 'nb-lines-unknown-domains');
    nbRejects        += self.get('rejets', 'nb-lines-unqualified-ecs');
    nbRejects        += self.get('rejets', 'nb-lines-duplicate-ecs');
    nbRejects        += self.get('rejets', 'nb-lines-unordered-ecs');
    var nbRealInput   = self.get('general', 'nb-lines-input')
                      - self.get('rejets', 'nb-lines-ignored');

    var rejectionRate = nbRealInput ? Math.round(nbRejects * 10000 / nbRealInput) / 100 : 0;
    self.set('general', 'Rejection-Rate', rejectionRate + ' %');

    var elapsedTime = process.hrtime(startTime);
    elapsedTime     = elapsedTime[0] * 1e3 + elapsedTime[1] / 1e6; // milliseconds


    // instant speed if not finalized, else global speed
    if (!self.finalized) {
      var lines        = self.get('general', 'nb-lines-input') - lastLinesInput;
      var t            = (elapsedTime - lastElapsedTime) / 1000;
      var instantSpeed = Math.round(lines / t);
      self.set('general', 'process-speed', instantSpeed + ' lignes/s');
      lastElapsedTime = elapsedTime;
      lastLinesInput  = self.get('general', 'nb-lines-input');
    } else {
      var avgSpeed = Math.floor(self.get('general', 'nb-lines-input') / (elapsedTime / 1000));
      self.set('general', 'process-speed', avgSpeed + ' lignes/s');
    }

    var time = '';
    elapsedTime /= 1000;
    time = Math.floor(elapsedTime % 60) + ' s ';
    if ((elapsedTime /= 60) >= 1) {
      time = Math.floor(elapsedTime % 60) + ' m ' + time;
      if ((elapsedTime /= 60) >= 1) {
        time = Math.floor(elapsedTime % 60) + ' h ' + time;
      }
    }

    self.set('general', 'Job-Duration', time);
  };
};

module.exports = ReportManager;