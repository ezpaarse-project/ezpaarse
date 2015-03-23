'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Create an EC deduplicator, used to remove duplicate ECs
 * Owns a WindowGroup for each platform
 */
function Deduplicator(options) {
  var self = this;
  options            = options || { intervals: {}, fieldnames: {} };
  options.intervals  = options.intervals  || {};
  options.fieldnames = options.fieldnames || {};

  var currentTime   = 0;
  var currentNumber = 0;
  var windowsGroups = {};
  var translations  = {
    'C': options['c-fieldname'] || 'session',
    'L': options['l-fieldname'] || 'login',
    'I': options['i-fieldname'] || 'host'
  };

  for (var letter in options.fieldnames) {
    translations[letter] = options.fieldnames[letter];
  }

  // lower index means higher priority
  var strategy = ['session', 'login', 'host'];

  if (options.strategy && /^[CLI]{1,3}$/i.test(options.strategy)) {
    strategy = [];
    options.strategy.toUpperCase().split('').forEach(function (letter) {
      strategy.push(translations[letter]);
    });
  }

  /**
   * This object is used to construct a deduplication Window.
   * It's a child of Deduplicator so that it can emit ECs.
   * @param  {Integer} interval  duration of the window (seconds)
   */
  var Window = function (interval) {
    this.ecs      = [];
    this.interval = interval;
  };

  /**
   * Remove and emit ECs which are outside of the interval
   * @param  {Number} currentTime timestamp of the current EC
   */
  Window.prototype.check = function () {
    var limit = currentTime - this.interval;
    for (var i = 0, l = this.ecs.length; i < l; i++) {
      if (this.ecs[i].timestamp < limit) {
        self.emit('unique', this.ecs.splice(i, 1)[0]);
        l--;
      } else {
        break;
      }
    }
  };

  /**
   * Push a new EC to the window
   * @param  {Object} newEC
   */
  Window.prototype.push = function (newEC) {

    if (newEC._meta.strategyField != -1 && newEC.unitid) {
      var strategyField = newEC._meta.strategyField;
      var ec;
      for (var j = 0, lgt = this.ecs.length; j < lgt; j++) {
        ec = this.ecs[j];

        // Check if the ECs have the same strategy level
        // Comparing carrots with potatoes do not make sense
        var isComparable = (ec._meta.strategyField == strategyField && ec.unitid);

        if (isComparable) {
          var sameUser      = (ec[strategyField] == newEC[strategyField]);
          var sameRessource = (ec.unitid == newEC.unitid);
          if (sameUser && sameRessource) {
            self.emit('duplicate', this.ecs.splice(j, 1)[0]);
            lgt--;
          }
        }
      }
    }
    // else { EC will not be comparable, emit it now ? }
    this.ecs.push(newEC);
  };

  Window.prototype.drain = function () {
    for (var i = 0, l = this.ecs.length; i < l; i++) {
      self.emit('unique', this.ecs[i]);
    }
    this.ecs = [];
  };

  /**
   * A group of deduplication windows.
   * One window for each mime (html, pdf...)
   */
  var WindowsGroup = function () {
    this.windows = {};

    var mixedWindow = options.mixTypes ? new Window(options.mixTypes) : null;

    for (var type in options.intervals) {
      if (mixedWindow) {
        this.windows[type.toLowerCase()] = mixedWindow;
      } else {
        this.windows[type.toLowerCase()] = new Window(options.intervals[type]);
      }
    }
  };

  WindowsGroup.prototype.checkWindows = function () {
    for (var type in this.windows) {
      this.windows[type].check();
    }
  };

  WindowsGroup.prototype.push = function (ec) {
    var mime = (ec.mime || 'misc').toLowerCase();
    if (this.windows[mime]) { this.windows[mime].push(ec); }
    else                    { this.windows['misc'].push(ec); }
  };

  WindowsGroup.prototype.drain = function () {
    for (var type in this.windows) { this.windows[type].drain(); }
  };

  /**
   * Push a new EC to windows
   * @param  {Object} ec
   */
  self.push = function (ec) {
    if (ec.timestamp < currentTime) {
      self.emit('error', new Error('the log lines are not chronological'), ec);
      return;
    }
    ec._meta.lineNumber = ++currentNumber;
    currentTime = ec.timestamp;
    for (var p in windowsGroups) {
      windowsGroups[p].checkWindows();
    }

    ec._meta.strategyField = -1;
    for (var j = 0, lgt = strategy.length; j < lgt; j++) {
      if (ec[strategy[j]]) {
        ec._meta.strategyField = strategy[j];
        break;
      }
    }

    var platform = ec.platform.toLowerCase();

    if (!windowsGroups[platform]) {
      windowsGroups[platform] = new WindowsGroup();
    }
    windowsGroups[platform].push(ec);
  };

  /**
   * Emit remaining ECs, considering them unique.
   */
  self.drain = function () {
    for (var platform in windowsGroups) {
      windowsGroups[platform].drain();
    }
    self.emit('drain', currentNumber);
  };
}

util.inherits(Deduplicator, EventEmitter);
module.exports = Deduplicator;