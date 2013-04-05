/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

/**
 * FolderCleaner supplies methods to clean a folder, recursively or not,
 * by removing files older than a given limit date.
 */

var fs           = require('fs');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');

function after(minutes, callback) {
  return setTimeout(callback, minutes * 60000);
}

var FolderReaper = function (options) {
  var that       = this;
  options        = options || {};
  that.recursive = options.recursive || false;
  that.cycle     = options.cycle     || 60; // Minutes
  that.lifetime  = options.lifetime  || { months: 1 };
  
  /**
   * Update the conservation limit of files using the lifetime
   */
  that.updateLimitDate = function () {
    var limitDate = new Date();

    // Remove the lifetime to the current time to get the limit date of files
    limitDate.setFullYear(limitDate.getFullYear() - (that.lifetime.years || 0));
    limitDate.setMonth(limitDate.getMonth() - (that.lifetime.months || 0));
    limitDate.setHours(limitDate.getHours() - ((that.lifetime.days || 0) * 24));
    limitDate.setHours(limitDate.getHours() - (that.lifetime.hours || 0));
    limitDate.setMinutes(limitDate.getMinutes() - (that.lifetime.minutes || 0));

    that.limitDate = limitDate;
  }

  /**
   * Reads a folder and cleans old files
   * @param folder the folder to clean
   * @param callback a function to run when the cleaning job is done
   */
  that.clean = function (folder, callback) {
    if (!callback) {
      callback = function () {};
    }
    if (!that.limitDate) {
      that.updateLimitDate();
    }

    fs.readdir(folder, function (err, files) {
      if (err) {
        that.emit('error', err);
        callback();
        return;
      }

      var nbFiles     = files.length;
      var nbProcessed = 0;
      var nbDeleted   = 0;
      
      if (nbFiles === 0) {
        callback(true);
        return;
      }

      var count = function () {
        nbProcessed++;
        if (nbProcessed === nbFiles) {
          var empty = (nbDeleted === nbFiles);
          callback(empty);
        }
      }

      files.forEach(function (f) {
        var file = folder + '/' + f;
        fs.stat(file, function (err, stats) {
          if (err) {
            that.emit('error', err);
            count();
            return;
          }
          if (stats.isDirectory()) {
            if (that.recursive) {
              that.clean(file, function (empty) {
                if (empty) {
                  fs.rmdir(file, function (err) {
                    if (err) {
                      that.emit('error', err);
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
            if (stats.ctime < that.limitDate) {
              fs.unlink(file, function (err) {
                if (err) {
                  that.emit('error', err);
                  count();
                  return;
                }
                that.emit('delete', file);
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
  }

  /**
   * Periodically cleans a folder
   * @param folder the folder to clean
   */
  that.watch = function (folder) {
    var startJob = function (fldr) {
      that.updateLimitDate();
      that.emit('jobstart');
      that.clean(fldr, function () {
        that.emit('jobdone');
        after(that.cycle, function () {
          startJob(fldr);
        })
      });
    }
    fs.exists(folder, function (exists) {
      if (exists) {
        fs.stat(folder, function (err, stats) {
          if (stats.isDirectory()) {
            startJob(folder);
          } else {
            that.emit('error', 'failed: ' + folder + ' is not a directory');
          }
        });
      } else {
        that.emit('error', 'failed: ' + folder + ' does not exist');
      }
    });
  }
}

util.inherits(FolderReaper, EventEmitter);
module.exports = FolderReaper;