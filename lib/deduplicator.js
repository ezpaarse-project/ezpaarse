'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

var Window = function (interval) {
  var self = this;
  var ecs  = [];

  /**
   * Remove and returns ECs which are outside of the interval
   * @param  {Number} currentTime timestamp of the current EC
   */
  self.getValidEcs = function (currentTime) {
    var validated = [];
    var limit     = currentTime - interval;
    for (var i = 0, l = ecs.length; i < l; i++) {
      if (ecs[i].timestamp < limit) {
        validated.push(ecs.splice(i, 1)[0]);
        l--;
      } else {
        break;
      }
    }
    return validated;
  }

  /**
   * Push a new EC to the window
   * @param  {Object} newEC
   * @return {Object} an EC if a duplicate has been removed, otherwise false
   */
  self.push = function (newEC) {

    var duplicate = false;
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
            duplicate = ecs.splice(j, 1)[0];
            lgt--;
          }
        }
      }
    }
    // else { EC will not be comparable, emit it now ? }
    ecs.push(newEC);
    return duplicate;
  };

  self.drain = function () {
    var rest = [];
    var ec = ecs.pop();
    while (ec) {
      rest.push(ec);
      ec = ecs.pop();
    }
    return rest;
  };
};

/**
 * A group of deduplication windows.
 * One window for each mime (html, pdf...)
 */
var WindowsGroup = function (intervals) {
  var self    = this;
  var windows = {};

  for (var type in intervals) {
    windows[type.toLowerCase()] = new Window(intervals[type]);
  }

  self.checkWindows = function (currentTime) {
    var validated = [];
    for (var type in windows) {
      validated = validated.concat(windows[type].getValidEcs(currentTime));
    }
    return validated;
  };

  self.push = function (ec) {
    var mime = (ec.mime || 'misc').toLowerCase();
    if (windows[mime]) { return windows[mime].push(ec); }
    else               { return windows['misc'].push(ec); }
  };

  self.drain = function () {
    var ecs = [];
    for (var type in windows) {
      ecs = ecs.concat(windows[type].drain());
    }
    return ecs;
  };
};

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
   * Push a new EC to windows
   * @param  {Object} newEC
   */
  self.push = function (newEC) {
    for (var p in windowsGroups) {
      var ecs = windowsGroups[p].checkWindows(newEC.timestamp);
      for (var i = ecs.length - 1; i >= 0; i--) {
        self.emit('unique', ecs[i]);
      }
    }

    newEC._meta.strategyField = -1;
    for (var j = 0, l = strategy.length; j < l; j++) {
      if (newEC[strategy[j]]) {
        newEC._meta.strategyField = strategy[j];
        break;
      }
    }

    var platform = newEC.platform.toLowerCase();

    if (!windowsGroups[platform]) {
      windowsGroups[platform] = new WindowsGroup(options.intervals);
    }
    var duplicate = windowsGroups[platform].push(newEC);
    if (duplicate) { self.emit('duplicate', duplicate); }
  };

  /**
   * Emit remaining ECs, considering them unique.
   */
  self.drain = function () {
    for (var platform in windowsGroups) {
      var ecs = windowsGroups[platform].drain();
      for (var i = ecs.length - 1; i >= 0; i--) {
        self.emit('unique', ecs[i]);
      }
    }
    self.emit('drain');
  }
};

util.inherits(Deduplicator, EventEmitter);
module.exports = Deduplicator;