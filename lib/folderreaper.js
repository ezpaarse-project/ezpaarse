'use strict';

/**
 * FolderReaper supplies methods to clean a folder, recursively or not,
 * by removing files older than a given limit date.
 */

var fs           = require('fs');
var path         = require('path');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');

var FolderReaper = function (options) {
  var self       = this;
  options        = options || {};
  self.recursive = options.recursive || false;
  self.lifetime  = options.lifetime  || { months: 1 };
  
  /**
   * Update the conservation limit of files using the lifetime
   */
  self.updateLimitDate = function () {
    var limitDate = new Date();

    // Remove the lifetime to the current time to get the limit date of files
    limitDate.setFullYear(limitDate.getFullYear() - (self.lifetime.years || 0));
    limitDate.setMonth(limitDate.getMonth() - (self.lifetime.months || 0));
    limitDate.setHours(limitDate.getHours() - ((self.lifetime.days || 0) * 24));
    limitDate.setHours(limitDate.getHours() - (self.lifetime.hours || 0));
    limitDate.setMinutes(limitDate.getMinutes() - (self.lifetime.minutes || 0));

    self.limitDate = limitDate;
  };

  /**
   * Read a folder and clean old files
   * @param folder the folder to clean
   * @param callback a function to run when the cleaning job is done
   */
  self.clean = function (folder, callback) {
    if (!callback)       { callback = function () {}; }
    if (!self.limitDate) { self.updateLimitDate(); }

    fs.readdir(folder, function (err, files) {
      if (err) {
        callback(err);
        return;
      }

      var nbFiles     = files.length;
      var nbProcessed = 0;
      var nbDeleted   = 0;
      
      if (nbFiles === 0) {
        callback(err, true);
        return;
      }

      var count = function () {
        nbProcessed++;
        if (nbProcessed === nbFiles) {
          var empty = (nbDeleted === nbFiles);
          callback(null, empty);
        }
      };

      files.forEach(function (f) {
        var file = path.join(folder, f);

        fs.stat(file, function (err, stats) {
          if (err) {
            self.emit('error', err);
            count();
            return;
          }
          if (stats.isDirectory()) {
            if (self.recursive) {
              self.clean(file, function (err, empty) {
                if (empty) {
                  fs.rmdir(file, function (err) {
                    if (err) {
                      self.emit('error', err);
                      count();
                      return;
                    }
                    nbDeleted++;
                    count();
                  });
                } else {
                  count();
                }
              });
            } else {
              count();
            }
          } else {
            if (stats.ctime < self.limitDate) {
              fs.unlink(file, function (err) {
                if (err) {
                  self.emit('error', err);
                  count();
                  return;
                }
                self.emit('delete', file);
                nbDeleted++;
                count();
              });
            } else {
              count();
            }
          }
        });
      });
    });
  };

  /**
   * Periodically cleans a folder
   * @param folder the folder to clean
   * @param cycle  the period between each cleaning job
   */
  self.watch = function (folder, cycle) {
    if (!cycle) { cycle = 15; }

    var startJob = function () {
      self.updateLimitDate();
      self.emit('jobstart', folder);
      self.clean(folder, function (err) {
        if (err) { self.emit('error', err); }
        self.emit('jobdone', folder);
      });
    };

    fs.exists(folder, function (exists) {
      if (exists) {
        fs.stat(folder, function (err, stats) {
          if (stats.isDirectory()) {
            startJob();
            self.intervalID = setInterval(startJob, cycle * 60000);
          } else {
            self.emit('error', 'failed: ' + folder + ' is not a directory');
          }
        });
      } else {
        self.emit('error', 'failed: ' + folder + ' does not exist');
      }
    });
  };

  /**
   * Stop cleaning periodically
   */
  self.stopWatching = function () {
    if (self.intervalID) { clearInterval(self.intervalID); }
  };
};

util.inherits(FolderReaper, EventEmitter);
module.exports = FolderReaper;