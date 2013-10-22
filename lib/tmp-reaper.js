'use strict';

/**
 * TmpReaper supplies methods to reap old files from directories
 */

var fs           = require('fs');
var path         = require('path');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var ms           = require('./ms.js');

/**
 * Initialize a new Reaper with given options
 * @param {Object} options -> threshold : lifetime of files
 *                         -> recursive : if set to true, will reap files in subfolders
 *                         -> every     : period of time between each reap session
 *                                        if not set, reap only once
 */
var TmpReaper = function (options) {
  var self       = this;
  options        = options || {};
  self.recursive = options.recursive || false;
  self.threshold = ms(options.threshold) || 1000 * 60 * 60 * 24 * 7;
  self.cycle     = ms(options.every);
  self.dirs      = [];

  /**
   * Reap old files from a directory
   * @param  {String} dir path to dir
   */
  function reapDir(dir, callback) {
    callback = callback || function () {};

    fs.readdir(dir, function (err, files) {
      if (err) {
        self.emit('error', err);
        return;
      }

      var nbFiles = files.length;

      if (nbFiles === 0) {
        callback(true);
        return;
      }

      var processNextFile = function () {
        var f = files.pop();
        if (!f) {
          callback(nbFiles === 0);
          return;
        }
        var file = path.join(dir, f);

        fs.stat(file, function (err, stats) {
          if (err) {
            self.emit('error', err);
            processNextFile();
            return;
          }
          if (stats.isDirectory()) {
            if (self.recursive) {
              reapDir(file, function (empty) {
                if (empty) {
                  fs.rmdir(file, function (err) {
                    if (err) {
                      self.emit('error', err);
                      processNextFile();
                      return;
                    }
                    nbFiles--;
                    processNextFile();
                  });
                }
              });
            } else {
              processNextFile();
            }
          } else {
            var diff = new Date() - stats.mtime;

            if (diff > self.threshold) {
              fs.unlink(file, function (err) {
                if (err) {
                  self.emit('error', err);
                  processNextFile();
                  return;
                }
                self.emit('delete', file, stats);
                nbFiles--;
                processNextFile();
              });
            } else {
              processNextFile();
            }
          }
        });
      };

      processNextFile();
    });

    return self;
  }

  /**
   * Reap each watched dir
   */
  function reap() {
    self.dirs.forEach(function (dir) {
      fs.stat(dir, function (err, stats) {
        if (err) {
          self.emit('error', err);
          return;
        }

        if (stats.isDirectory()) {
          reapDir(dir);
        } else {
          self.emit('error', new Error(dir + ' is not a directory'));
        }
      });
    });
  }

  /**
   * Add a directory to the watching list
   * @param {String} dir
   */
  self.watch = function (dir) {
    self.dirs.push(dir);
    return self;
  };

  /**
   * Start reaping
   */
  self.start = function () {
    reap();
    if (self.cycle) { self.intervalID = setInterval(reap, self.cycle); }
    return self;
  };

  /**
   * Stop reaping periodically
   */
  self.stop = function () {
    if (self.intervalID) { clearInterval(self.intervalID); }
    return self;
  };
};

util.inherits(TmpReaper, EventEmitter);
module.exports = TmpReaper;