/*jshint maxlen: 180*/
'use strict';

/**
 * Manage a report file
 */

var fs = require('graceful-fs');

function ReportManager(file, baseReport) {
  this.file           = file;
  this.report         = baseReport || {};
  this.startTime      = process.hrtime();
  this.finalized      = false;
  this.timeout        = 10; //seconds
  this.lastLinesInput = 0;
}
module.exports = ReportManager;

/**
 * Increments the value of a given entry, or sets it to 1 if absent
 * If the entry is not a number, it will be overriden
 * @param {String} group
 * @param {String} entry
 */
ReportManager.prototype.inc = function (group, entry) {
  if (!this.report[group]) { this.report[group] = {}; }
  var c = this.report[group][entry];
  this.report[group][entry] = (c && typeof c == 'number') ? ++c : 1;
};

/**
 * Set the value of a given entry
 * @param {String} group
 * @param {String} entry
 * @param {String} value
 */
ReportManager.prototype.set = function (group, entry, value) {
  if (!this.report[group]) { this.report[group] = {}; }
  this.report[group][entry] = value;
};

/**
 * Returns the value of an entry
 * @param  {String}  group (optional)
 * @param  {String}  entry
 * @return {Any}
 */
ReportManager.prototype.get = function (group, entry) {
  if (arguments.length == 1) {
    entry = group;
    group = false;
  }
  if (group) {
    var gp = this.report[group] || {};
    return gp[entry];
  } else {
    for (var g in this.report) {
      if (this.report[g][entry] !== undefined) {
        return this.report[g][entry];
      }
    }
    return undefined;
  }
};

/**
 * Updates the report file
 */
ReportManager.prototype.updateFile = function (callback) {
  callback = callback || function () {};

  if (this.isWriting) {
    callback();
  } else {
    this.isWriting = true;
    var self = this;

    fs.writeFile(this.file, JSON.stringify(this.report, null, 2), function () {
      self.isWriting = false;
      callback();
    });
  }
};

/**
 * Update the report and stop the update cycle
 */
ReportManager.prototype.finalize = function (callback, socket) {
  clearInterval(this.intervalId);
  this.finalized = true;
  this.updateComputed();

  if (socket) { socket.emit('report', this.report); }

  var self = this;
  this.updateGeneralUsage(function () {
    // Loop until the current file writing is over
    var checkWriting = function (callback) {
      if (self.isWriting) {
        setImmediate(function () { checkWriting(callback); });
      } else {
        callback();
      }
    };
    checkWriting(function () {
      self.updateFile(callback);
    });
  });
};

/**
 * Update ezpaarse general usage
 */
ReportManager.prototype.updateGeneralUsage = function (callback) {
  var self  = this;
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
  var statsKeys = Object.keys(self.report.stats);
  statsKeys.forEach(function (value) {
    usage.set('stats', value, usage.get('stats', value) ?
      usage.get('stats', value) + self.get('stats', value) : self.get('stats', value));
  });

  usage.updateFile(callback);
};

/**
 * Update the report by calling updateFile
 * @param  {Object} socket  socket.io client
 */
ReportManager.prototype.update = function (socket) {
  var self = this;
  self.checkTimeout();
  self.updateComputed();
  if (socket) { socket.emit('report', self.report); }

  self.updateFile();
};

/**
 * Check if the number of input lines has changed since last update
 * if it doesn't change after 10s, stop updating
 */
ReportManager.prototype.checkTimeout = function () {
  var lines = this.get('general', 'nb-lines-input');
  if (lines == this.lastLinesInput) {
    if (process.hrtime(this.lastUpdateTime)[0] > this.timeout) {
      clearInterval(this.intervalId);
    }
  } else {
    this.lastUpdateTime = process.hrtime();
  }
};

/**
 * Call update periodically
 * @param {Integer} frequency  the cycle in seconds between each update
 *                             ( default 10sec )
 */
ReportManager.prototype.cycle = function (frequency, socket) {
  var self = this;
  //initialize lastElapsedTime the first time for avoiding division by 0.
  //in updateComputed, next lastElapsedTime will be equal to elapsedTime.
  self.lastUpdateTime  = process.hrtime();
  self.lastElapsedTime = process.hrtime(self.startTime);
  self.lastElapsedTime = self.lastElapsedTime[0] * 1e3 + self.lastElapsedTime[1] / 1e6; // ms
  self.update(socket);

  self.intervalId = setInterval(function () {
    self.update(socket);
  }, frequency ? frequency * 1000 : 5000);
};

ReportManager.prototype.updateComputed = function () {
  var nbRejects     = this.get('rejets', 'nb-lines-unknown-formats');
  nbRejects        += this.get('rejets', 'nb-lines-unknown-domains');
  nbRejects        += this.get('rejets', 'nb-lines-unqualified-ecs');
  nbRejects        += this.get('rejets', 'nb-lines-duplicate-ecs');
  nbRejects        += this.get('rejets', 'nb-lines-unordered-ecs');
  var nbRealInput   = this.get('general', 'nb-lines-input')
                    - this.get('rejets', 'nb-lines-ignored');

  var rejectionRate = nbRealInput ? Math.round(nbRejects * 10000 / nbRealInput) / 100 : 0;
  this.set('general', 'Rejection-Rate', rejectionRate + ' %');

  var elapsedTime = process.hrtime(this.startTime);
  elapsedTime     = elapsedTime[0] * 1e3 + elapsedTime[1] / 1e6; // milliseconds


  // instant speed if not finalized, else global speed
  if (!this.finalized) {
    var lines        = this.get('general', 'nb-lines-input') - this.lastLinesInput;
    var t            = (elapsedTime - this.lastElapsedTime) / 1000;
    var instantSpeed = Math.round(lines / t);
    this.set('general', 'process-speed', instantSpeed + ' lignes/s');
    this.lastElapsedTime = elapsedTime;
    this.lastLinesInput  = this.get('general', 'nb-lines-input');
  } else {
    var avgSpeed = Math.floor(this.get('general', 'nb-lines-input') / (elapsedTime / 1000));
    this.set('general', 'process-speed', avgSpeed + ' lignes/s');
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

  this.set('general', 'Job-Duration', time);
};
