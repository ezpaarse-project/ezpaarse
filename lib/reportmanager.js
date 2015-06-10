/*jshint maxlen: 180*/
'use strict';

/**
 * Manage a report file
 */

var fs = require('graceful-fs');

function ReportManager(file, options) {
  options = options || {};

  this.file            = file;
  this.report          = options.baseReport || {};
  this.updateThrottle  = options.updateThrottle || 5000;
  this.writeThrottle   = options.writeThrottle || 10000;
  this.socket          = options.socket;
  this.startTime       = process.hrtime();
  this.finalized       = false;
  this.lastLinesInput  = 0;
  this.generatedECs    = 0;
  this.updateCallbacks = [];
  this.writeCallbacks  = [];
}
module.exports = ReportManager;

/**
 * Return the actual report
 */
ReportManager.prototype.getJson = function () {
  return this.report;
};

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

  this.update();
  this.updateFile();
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

  this.update();
  this.updateFile();
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
 * Update the report and stop the update cycle
 */
ReportManager.prototype.finalize = function (callback) {
  var self = this;
  self.finalized = true;
  
  self.update(function () {
    self.updateFile(callback, true);
  }, true);
};

/**
 * Update computed values, emit on socket and write on file
 */
ReportManager.prototype.update = function (callback, noWait) {
  var self = this;
  
  var postUpdate = function() {
    self.compute();
    if (self.socket) { self.socket.emit('report', self.report); }

    self.updateCallbacks.forEach(function (cb) { cb(); });
    self.updateCallbacks = [];
    
    self.updating         = false;
    self.waitingForUpdate = false;
  };

  if (noWait) {
    if (typeof callback === 'function') { self.updateCallbacks.push(callback); }
    clearTimeout(self.updateTimeout);
    return postUpdate();
  }

  if (self.updating) {
    if (typeof callback === 'function') {
      self.updateCallbacks.push(callback);
    }

    return (self.waitingForUpdate = true);
  }

  self.updating = true;

  self.compute();
  if (self.socket) { self.socket.emit('report', self.report); }
  if (typeof callback === 'function') { callback(); }

  self.updateTimeout = setTimeout(function () {
    if (self.waitingForUpdate) {
      postUpdate();
    } else {
      self.updating = false;
    }
  }, self.updateThrottle);
};

/**
 * Updates the report file
 */
ReportManager.prototype.updateFile = function (callback, noWait) {
  var self = this;
  
  var postWrite = function () {
    var callbacks = self.writeCallbacks;
    self.writeCallbacks = [];

    fs.writeFile(self.file, JSON.stringify(self.report, null, 2), function () {
      callbacks.forEach(function (cb) { cb(); });

      self.writing         = false;
      self.waitingForWrite = false;
    });
  };

  if (noWait) {
    if (typeof callback === 'function') { self.writeCallbacks.push(callback); }
    clearTimeout(self.writeTimeout);
    return postWrite();
  }

  if (self.writing) {
    if (typeof callback === 'function') {
      self.writeCallbacks.push(callback);
    }

    return (self.waitingForWrite = true);
  }
  
  self.writing = true;

  fs.writeFile(self.file, JSON.stringify(self.report, null, 2), function () {
    if (typeof callback === 'function') { callback(); }
    
    self.writeTimeout = setTimeout(function() {

      if (self.waitingForWrite) {
        postWrite();
      } else {
        self.writing = false;
      }
      
    }, self.writeThrottle);
  });
};

/**
 * Update the fields that require computation
 */
ReportManager.prototype.compute = function () {
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
    var t     = (elapsedTime - this.lastElapsedTime) / 1000;
    var lines = this.get('general', 'nb-lines-input') - this.lastLinesInput;
    var ecs   = this.get('general', 'nb-ecs') - this.generatedECs;

    this.set('general', 'process-speed', Math.round(lines / t) + ' lignes/s');
    this.set('general', 'ecs-speed', Math.round(ecs / t) + ' ec/s');
    this.lastLinesInput  = this.get('general', 'nb-lines-input');
    this.generatedECs    = this.get('general', 'nb-ecs');
    this.lastElapsedTime = elapsedTime;
  } else {
    var avgLinesSpeed = Math.floor(this.get('general', 'nb-lines-input') / (elapsedTime / 1000));
    var avgEcsSpeed   = Math.floor(this.get('general', 'nb-ecs') / (elapsedTime / 1000));
    this.set('general', 'process-speed', avgLinesSpeed + ' lignes/s');
    this.set('general', 'ecs-speed', avgEcsSpeed + ' ec/s');
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
