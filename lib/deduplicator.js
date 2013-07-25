'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Create an EC deduplicator, used to remove duplicate ECs
 * Owns a WindowGroup for each platform
 */
var Deduplicator = function (options) {
  var self = this;
  options            = options || { intervals: {}, fieldnames: {} };
  options.intervals  = options.intervals  || {};
  options.fieldnames = options.fieldnames || {};

  var currentTime;
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
    var that = this;
    var ecs  = [];

    /**
     * Remove and emit ECs which are outside of the interval
     * @param  {Number} currentTime timestamp of the current EC
     */
    that.check = function (currentTime) {
      var limit = currentTime - interval;
      for (var i = 0, l = ecs.length; i < l; i++) {
        if (ecs[i].timestamp < limit) {
          self.emit('unique', ecs.splice(i, 1)[0]);
          l--;
        } else {
          break;
        }
      }
    }

    /**
     * Push a new EC to the window
     * @param  {Object} newEC
     */
    that.push = function (newEC) {

      if (newEC._meta.strategyField != -1 && newEC.unitid) {
        var strategyField = newEC._meta.strategyField;
        var ec;
        for (var j = 0, lgt = ecs.length; j < lgt; j++) {
          ec = ecs[j];

          // Check if the ECs have the same strategy level
          // Comparing carrots with potatoes do not make sense
          var isComparable = (ec._meta.strategyField == strategyField && ec.unitid);
          
          if (isComparable) {
            var sameUser      = (ec[strategyField] == newEC[strategyField]);
            var sameRessource = (ec.unitid == newEC.unitid);
            if (sameUser && sameRessource) {
              self.emit('duplicate', ecs.splice(j, 1)[0]);
              lgt--;
            }
          }
        }
      }
      // else { EC will not be comparable, emit it now ? }
      ecs.push(newEC);
    };

    that.drain = function () {
      for (var i = 0, l = ecs.length; i < l; i++) {
        self.emit('unique', ecs[i]);
      }
      ecs = [];
    };
  };

  /**
   * A group of deduplication windows.
   * One window for each mime (html, pdf...)
   */
  var WindowsGroup = function () {
    var that    = this;
    var windows = {};

    for (var type in options.intervals) {
      windows[type.toLowerCase()] = new Window(options.intervals[type]);
    }

    that.checkWindows = function (currentTime) {
      for (var type in windows) {
        windows[type].check(currentTime);
      }
    };

    that.push = function (ec) {
      var mime = (ec.mime || 'misc').toLowerCase();
      if (windows[mime]) { windows[mime].push(ec); }
      else               { windows['misc'].push(ec); }
    };

    that.drain = function () {
      for (var type in windows) { windows[type].drain(); }
    };
  };

  /**
   * Push a new EC to windows
   * @param  {Object} newEC
   */
  self.push = function (newEC) {
    for (var p in windowsGroups) {
      windowsGroups[p].checkWindows(newEC.timestamp);
    }

    newEC._meta.strategyField = -1;
    for (var j = 0, lgt = strategy.length; j < lgt; j++) {
      if (newEC[strategy[j]]) {
        newEC._meta.strategyField = strategy[j];
        break;
      }
    }

    var platform = newEC.platform.toLowerCase();

    if (!windowsGroups[platform]) {
      windowsGroups[platform] = new WindowsGroup();
    }
    windowsGroups[platform].push(newEC);
  };

  /**
   * Emit remaining ECs, considering them unique.
   */
  self.drain = function () {
    for (var platform in windowsGroups) {
      windowsGroups[platform].drain();
    }
    self.emit('drain');
  }
};

util.inherits(Deduplicator, EventEmitter);
module.exports = Deduplicator;