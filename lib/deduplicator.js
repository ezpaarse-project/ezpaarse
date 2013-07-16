/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

/**
 * Create an EC deduplicator, used to remove duplicate ECs
 */
var Deduplicator = function (options) {
  options          = options || {};
  var self         = this;
  var windows      = {};
  var translations = {
    'C': options['c-fieldname'] || 'session',
    'L': options['l-fieldname'] || 'login',
    'I': options['i-fieldname'] || 'host'
  };

  // lower index means higher priority
  var strategy = ['session', 'login', 'host'];

  if (options.strategy && /^[CLI]{1,3}$/i.test(options.strategy)) {
    strategy = [];
    options.strategy.toUpperCase().split('').forEach(function (letter) {
      strategy.push(translations[letter]);
    });
  }

  /**
   * Create a new deduplication window
   * @param  {String}  type     window type (html, pdf...)
   * @param  {Integer} interval maximum duration between first and last EC (seconds)
   * @return {Boolean}          true if the window was successfully created
   */
  self.createWindow = function (type, interval) {
    if (type && interval) {
      windows[type.toUpperCase()] = { interval: interval, ecs: [] };
      return true;
    }
    return false;
  };

  /**
   * Push a new EC to the deduplication windows
   * @param  {Object} newEC
   */
  self.push = function (newEC) {
    if (newEC.timestamp) { self.checkWindows(newEC.timestamp); }

    var type = (newEC.mime || 'MISC').toUpperCase();
    if (!windows[type]) { type = 'MISC'; } // MISC hardcoded, should find an other way

    var ecs = windows[type].ecs;
    var strategyIndex;
    var strategyField;

    for (var i = 0, l = strategy.length; i < l; i++) {
      if (newEC[strategy[i]]) {
        strategyIndex = i;
        strategyField = strategy[i];
        break;
      }
    }

    if (strategyField) {
      var ec;
      for (var j = 0, lgt = ecs.length; j < lgt; j++) {
        ec = ecs[j];

        // Check if the EC has a field with a higher priority
        // Comparing carrots with potatoes do not make sense
        var higherPriority = false;
        for (var k = strategyIndex - 1; k >= 0; k--) {
          if (ec[strategy[k]]) {
            higherPriority = true;
            break;
          }
        }
        
        if (!higherPriority && ec[strategyField] == newEC[strategyField]
            && newEC.unitid && ec.unitid == newEC.unitid) {
          self.emit('duplicate', ec);
          ecs.splice(j, 1);
          lgt--;
          break;
        }
      }
    }
    ecs.push(newEC);
  };

  /**
   * Check ECs in all windows and validate those which are outside of the interval
   * @param  {Number} currentTime timestamp of the current EC
   */
  self.checkWindows = function (currentTime) {
    for (var type in windows) {
      var limit = currentTime - windows[type].interval;
      var ecs   = windows[type].ecs;
      for (var i = 0, l = ecs.length; i < l; i++) {
        var ec = ecs[i];
        if (ec.timestamp < limit) {
          ec._meta.isValid = true;
          self.emit('unique', ec);
          ecs.splice(i, 1);
          l--;
        } else {
          break;
        }
      }
    }
  }

  /**
   * Emit remaining ECs, considering them unique.
   */
  self.empty = function () {
    for (var type in windows) {
      for (var i = 0, l = windows[type].ecs.length; i < l; i++) {
        var ec = windows[type].ecs[i];
        ec._meta.isValid = true;
        self.emit('unique', ec);
      }
    }
    self.emit('drain');
  }
};

util.inherits(Deduplicator, EventEmitter);
module.exports = Deduplicator;