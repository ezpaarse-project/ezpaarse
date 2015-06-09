'use strict';

/**
 * Create an EC deduplicator, used to remove duplicate ECs
 * Owns a WindowGroup for each platform
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function deduplicator(req, res, job) {
  job.logger.verbose('Initializing deduplication');
  var headers = req.headers;
  var match;
  
  var currentTime   = 0;
  var callbacks     = new WeakMap();
  var windowsGroups = new Map();

  var options = job.deduplication = {
    intervals: {
      'misc': 30,
      'html': 10,
      'pdf': 30
    },
    fieldnames: {
      'C': 'session',
      'L': 'login',
      'I': 'host'
    },
    strategy: 'CLI',
    use: true,
    mixTypes: false
  };

  for (var header in headers) {

    if (header.toLowerCase() === 'double-click-strategy') {
      if (/^[CLI]{1,3}$/i.test(options.strategy)) {
        options.strategy = headers[header].toUpperCase();
      }
    } else if (header.toLowerCase() === 'double-click-removal') {
      options.use = !/^false$/i.test(headers[header]);
      options.use = headers[header].toLowerCase() !== 'false';

    } else {
      match = /^double-click-([a-z]+)$/i.exec(header);

      if (match) {
        var val = parseInt(headers[header], 10);
        if (!isNaN(val) && isFinite(val)) {
          if (match[1].toLowerCase() == 'mixed') {
            options.mixTypes = val;
          } else {
            options.intervals[match[1].toLowerCase()] = val;
          }
        }
      } else {
        match = /^double-click-([CLI])-field$/i.exec(header);
        if (match) {
          options.fieldnames[match[1].toUpperCase()] = headers[header];
        }
      }
    }
  }

  // lower index means higher priority
  // ex: ['session', 'login', 'host']
  var strategy = options.strategy.split('').map(function (letter) {
    return options.fieldnames[letter];
  });

  job.report.set('dedoublonnage', 'activated', options.use);

  if (options.use) {
    job.report.set('dedoublonnage', 'strategy', options.strategy);

    for (var letter in options.fieldnames) {
      job.report.set('dedoublonnage', 'fieldname-' + letter, options.fieldnames[letter]);
    }
    for (var type in options.intervals) {
      job.report.set('dedoublonnage', 'window-' + type, options.intervals[type]);
    }
  }

  function resolve(err, ec) {
    callbacks.get(ec)(err);
    callbacks.delete(ec);
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
        resolve(null, this.ecs.splice(i, 1)[0]);
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
            var err  = new Error('duplicate');
            err.type = 'EDUPLICATE';
            resolve(err, this.ecs.splice(j, 1)[0]);
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
      resolve(null, this.ecs[i]);
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

  if (!options.use) {
    return function deduplicate(ec, next) { next(); };
  }

  return function deduplicate(ec, next) {
    if (!ec) {
      // Emit remaining ECs, considering them unique.
      windowsGroups.forEach(function (group) {
        group.drain();
      });
      return next();
    }

    if (ec.timestamp < currentTime) {
      var err  = new Error('chronological error');
      err.type = 'ECHRONO';
      return next(err);
    }

    callbacks.set(ec, next);

    currentTime = ec.timestamp;
    windowsGroups.forEach(function (group) {
      group.checkWindows();
    });

    ec._meta.strategyField = -1;
    for (var j = 0, lgt = strategy.length; j < lgt; j++) {
      if (ec[strategy[j]]) {
        ec._meta.strategyField = strategy[j];
        break;
      }
    }

    var platform = ec.platform.toLowerCase();

    if (!windowsGroups.has(platform)) {
      windowsGroups.set(platform, new WindowsGroup());
    }
    windowsGroups.get(platform).push(ec);
  };
};
