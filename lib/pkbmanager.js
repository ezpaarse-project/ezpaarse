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
var pkbGetter = function (platform, pkb) {
  var self          = this;
  self.platform     = platform;
  self.pkb          = pkb;
  self.missingFile  = path.join(__dirname, '/../platforms-kb/', platform + '.pkb.miss.csv');

  var missQueue = async.queue(function (pid, callback) {
    fs.exists(self.missingFile, function (exists) {
      if (!exists) {
        fs.writeFile(self.missingFile, 'pid;issn;eissn;url\n' + pid + ';;;', callback);
      } else {
        fs.appendFile(self.missingFile, '\n' + pid + ';;;', callback);
      }
    });
  }, 1);

  self.addMiss = function (pid) {
    if (!self.pkb[pid]) { self.pkb[pid] = false; }
  };

  /**
   * Look for an ID in the PKB
   * @param  {String} pid
   * @return {Object} the extracted IDs or false
   */
  self.get = function (pid) {
    if (pkb[pid] || pkb[pid] === false) {
      return pkb[pid];
    }
    pkb[pid] = false;
    missQueue.push(pid);
    return false;
  };
};

/**
 * Used to manage a list of encountered PKBs.
 */
var PKBManager = function () {
  var self       = this;
  var pkbFolder  = path.join(__dirname, '/../platforms-kb');
  var knowledge = {};

  fs.watch(pkbFolder, function (evt, filename) {
    if (!/\.miss\.csv$/.test(filename)) {
      var platform = filename.split('.')[0];
      delete knowledge[platform];
      console.log(filename + ' changed, ' + platform + ' cleared');
    }
  });
 
  /**
   * Looks for a PKB matching the given platform and
   * returns a pkbGetter (see above) to search into it.
   * @param  {Object}   task           contains the requested platform name and a callback
   * @param  {Function} queueCallback  async callback to call when a worker is done
   */
  self.pkbRequestQueue = async.queue(function (task, queueCallback) {
    var platform = task.platform;
    var callback = task.callback;
    var pkb = knowledge[platform];

    if (pkb) {
      task.callback(pkb);
      queueCallback();
    } else if (pkb === false) {
      task.callback(false);
      queueCallback();
    } else {
      fs.exists(pkbFolder, function (exists) {
        if (exists) {
          fs.readdir(pkbFolder, function (err, allPkbFiles) {
            if (err) {
              task.callback(false);
              queueCallback();
            }
            var regexp   = new RegExp(platform + '(\\.[^ ]+)?\\.pkb\\.csv$');
            var missFile = path.join(pkbFolder, platform + '.pkb.miss.csv');
            var pkbFiles = [];

            allPkbFiles.forEach(function (pkbFile) {
              var file = path.join(pkbFolder, pkbFile);
              if (fs.existsSync(file) && fs.statSync(file).isFile() && regexp.test(file)) {
                pkbFiles.push(file);
              }
            });

            if (pkbFiles.length > 0) {
              csvextractor.extract(pkbFiles, [], function (records) {

                fs.exists(missFile, function (exists) {
                  if (exists) {
                    csvextractor.extract(missFile, ['pid'], function (missRecords) {
                      var pkb = new pkbGetter(platform, records);
                      for (var i in missRecords) {
                        pkb.addMiss(missRecords[i].pid);
                      }
                      knowledge[platform] = pkb;
                      callback(pkb);
                      queueCallback();
                    }, {silent: true});
                  } else {
                    knowledge[platform] = new pkbGetter(platform, records);
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
        } else {
          task.callback(false);
          queueCallback();
        }
      });
    }
  }, 1);

  /**
   * Takes a PKB request and adds it to the queue.
   * This way we can avoid concurrency conflicts by
   * processing one request only at a time.
   * @param  {String}   platform the requested platform name
   * @param  {Function} callback called with a pkbGetter or false
   */
  self.get = function (platform, callback) {
    self.pkbRequestQueue.push({ platform: platform, callback: callback });
  };
};

module.exports = new PKBManager();