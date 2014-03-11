'use strict';

/**
 * This module allows for searching into the PKB repository.
 */

var fs           = require('graceful-fs');
var path         = require('path');
var async        = require('async');
var csvextractor = require('./csvextractor.js');
var kbartHeaders = require('./outputformats/kbart.json');

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
    '.pkb.miss.txt');

  self.missQueue = async.queue(function (titleID, callback) {
    fs.exists(self.missingFile, function (exists) {
      if (!exists) {
        var kb = kbartHeaders.join('\t') + '\n';

        kbartHeaders.forEach(function (header) {
          if (header == 'title_id') { kb += titleID; }
          kb += '\t';
        });

        fs.writeFile(self.missingFile, kb, callback);
      } else {
        var kb = '\n';

        kbartHeaders.forEach(function (header) {
          if (header == 'title_id') { kb += titleID; }
          kb += '\t';
        });

        fs.appendFile(self.missingFile, kb, callback);
      }
    });
  }, 1);
}

PKBGetter.prototype.addMiss = function (titleID) {
  if (!this.pkb[titleID]) { this.pkb[titleID] = false; }
};

/**
 * Look for an ID in the PKB
 * @param  {String} titleID
 * @return {Object} the extracted IDs or false
 */
PKBGetter.prototype.get = function (titleID) {
  if (this.pkb[titleID] || this.pkb[titleID] === false) {
    return this.pkb[titleID];
  }
  this.pkb[titleID] = false;
  this.missQueue.push(titleID);
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
            var missFile = path.join(pkbFolder, platform + '.pkb.miss.txt');
            var pkbFiles = [];

            files.forEach(function (pkbFile) {
              var file = path.join(pkbFolder, pkbFile);
              if (fs.existsSync(file)
                && fs.statSync(file).isFile()
                && /_[0-9]{4}-[0-9]{2}-[0-9]{2}\.txt$/.test(file)) {
                pkbFiles.push(file);
              }
            });

            if (pkbFiles.length > 0) {
              var opts = {
                silent: true,
                key: 'title_id',
                delimiter: '\t',
                remove: /^pkb-/
              };
              csvextractor.extract(pkbFiles, opts, function (err, records) {
                if (err) {
                  console.error('Bad CSV syntax: ' + pkbFiles + ' - ' + err);
                }

                /**
                 * Remove the leading # of invalid ISSNs
                 */
                var record;
                for (var titleID in records) {
                  record = records[titleID];
                  if (record.pissn && /^#/.test(record.pissn)) {
                    record.pissn = record.pissn.replace(/^#/, '');
                  }
                  if (record.eissn && /^#/.test(record.eissn)) {
                    record.eissn = record.eissn.replace(/^#/, '');
                  }
                }

                fs.exists(missFile, function (exists) {
                  if (exists) {
                    var opts = {
                      silent: true,
                      delimiter: '\t',
                      fields: ['title_id']
                    };
                    csvextractor.extract(missFile, opts, function (err, missRecords) {
                      if (err) {
                        console.error('Bad CSV syntax: ' + missFile + ' - ' + err);
                      }
                      var pkb = new PKBGetter(platform, records);
                      for (var i in missRecords) {
                        pkb.addMiss(missRecords[i].title_id);
                      }
                      knowledge[platform] = pkb;
                      callback(pkb);
                      queueCallback();
                    });
                  } else {
                    knowledge[platform] = new PKBGetter(platform, records);
                    callback(knowledge[platform]);
                    queueCallback();
                  }
                });
              });

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
            if (/_[0-9]{4}-[0-9]{2}-[0-9]{2}\.txt$/.test(filename)) {
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
