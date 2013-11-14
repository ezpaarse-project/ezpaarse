'use strict';

/**
 * This module allows for searching into the PKB repository.
 */

var fs           = require('fs');
var path         = require('path');
var async        = require('async');
var csvextractor = require('./csvextractor.js');

/**
 * Used to search into a PKB
 * @param  {String} platform
 * @param  {Object} pkb
 */
function PKBGetter(platform, pkb) {
  var self         = this;
  self.platform    = platform;
  self.pkb         = pkb;
  self.missingFile = path.join(__dirname, '/../platforms-kb/', platform, platform +
    '.pkb.miss.csv');

  self.missQueue = async.queue(function (pid, callback) {
    fs.exists(self.missingFile, function (exists) {
      if (!exists) {
        fs.writeFile(self.missingFile, 'pid;pissn;eissn;url\n' + pid + ';;;', callback);
      } else {
        fs.appendFile(self.missingFile, '\n' + pid + ';;;', callback);
      }
    });
  }, 1);
}

PKBGetter.prototype.addMiss = function (pid) {
  if (!this.pkb[pid]) { this.pkb[pid] = false; }
};

/**
 * Look for an ID in the PKB
 * @param  {String} pid
 * @return {Object} the extracted IDs or false
 */
PKBGetter.prototype.get = function (pid) {
  if (this.pkb[pid] || this.pkb[pid] === false) {
    return this.pkb[pid];
  }
  this.pkb[pid] = false;
  this.missQueue.push(pid);
  return false;
};

/**
 * Used to manage a list of encountered PKBs.
 */
function PKBManager() {
  var pkbRoot   = path.join(__dirname, '/../platforms-kb');
  var knowledge = {};

  /**
   * Looks for a PKB matching the given platform and
   * returns a pkbGetter (see above) to search into it.
   * @param  {Object}   task           contains the requested platform name and a callback
   * @param  {Function} queueCallback  async callback to call when a worker is done
   */
  this.pkbRequestQueue = async.queue(function (task, queueCallback) {
    var platform = task.platform;
    var callback = task.callback;
    var pkb      = knowledge[platform];

    if (pkb) {
      task.callback(pkb);
      queueCallback();
    } else if (pkb === false) {
      task.callback(false);
      queueCallback();
    } else {
      var pkbFolder = path.join(pkbRoot, platform);
      fs.exists(pkbFolder, function (exists) {
        if (exists) {
          fs.readdir(pkbFolder, function (err, files) {
            if (err) {
              task.callback(false);
              queueCallback();
            }
            var missFile = path.join(pkbFolder, platform + '.pkb.miss.csv');
            var pkbFiles = [];

            files.forEach(function (pkbFile) {
              var file = path.join(pkbFolder, pkbFile);
              if (fs.existsSync(file) && fs.statSync(file).isFile() && /\.pkb\.csv$/.test(file)) {
                pkbFiles.push(file);
              }
            });

            if (pkbFiles.length > 0) {
              csvextractor.extract(pkbFiles, [], function (err, records) {
                if (err) {
                  console.error('Bad CSV syntax: ' + pkbFiles + ' - ' + err);
                }

                fs.exists(missFile, function (exists) {
                  if (exists) {
                    csvextractor.extract(missFile, ['pid'], function (err, missRecords) {
                      if (err) {
                        console.error('Bad CSV syntax: ' + missFile + ' - ' + err);
                      }
                      var pkb = new PKBGetter(platform, records);
                      for (var i in missRecords) {
                        pkb.addMiss(missRecords[i].pid);
                      }
                      knowledge[platform] = pkb;
                      callback(pkb);
                      queueCallback();
                    }, {silent: true});
                  } else {
                    knowledge[platform] = new PKBGetter(platform, records);
                    callback(knowledge[platform]);
                    queueCallback();
                  }
                });
              }, {silent: true, key: 'pid'});

            } else {
              knowledge[platform] = false;
              task.callback(false);
              queueCallback();
            }
          });

          /**
           * Clear cache if changes occur in the folder
           */
          fs.watch(pkbFolder, function (event, filename) {
            if (/\.pkb\.csv$/.test(filename)) {
              delete knowledge[platform];
              console.log(filename + ' changed, clearing cache of ' + platform);
            }
          });
        } else {
          task.callback(false);
          queueCallback();
        }

      });
    }
  }, 1);
}
module.exports = new PKBManager();

/**
 * Takes a PKB request and adds it to the queue.
 * This way we can avoid concurrency conflicts by
 * processing one request only at a time.
 * @param  {String}   platform the requested platform name
 * @param  {Function} callback called with a pkbGetter or false
 */
PKBManager.prototype.get = function (platform, callback) {
  this.pkbRequestQueue.push({ platform: platform, callback: callback });
};
