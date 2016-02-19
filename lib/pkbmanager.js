/* eslint no-sync: 0, no-console: 0 */
'use strict';

/**
 * This module allows for searching into the PKB repository.
 */

var fs            = require('graceful-fs');
var path          = require('path');
var async         = require('async');
var csvextractor  = require('./csvextractor.js');
var kbartHeaders  = require('./outputformats/kbart.json');

var platformsRoot = path.join(__dirname, '/../platforms');

/**
 * Used to search into a PKB
 * @param  {String} platform
 * @param  {Object} pkb
 */
function pkbGetter(platform, pkb) {
  var missingFile = path.join(__dirname, '/../platforms/', platform, 'pkb', platform +
    '.pkb.miss.txt');

  var missQueue = async.queue(function (titleID, callback) {
    fs.exists(missingFile, function (exists) {
      var kb;
      if (!exists) {
        kb = kbartHeaders.join('\t') + '\n';

        kbartHeaders.forEach(function (header) {
          if (header == 'title_id') { kb += titleID; }
          kb += '\t';
        });

        fs.writeFile(missingFile, kb, callback);
      } else {
        kb = '\n';

        kbartHeaders.forEach(function (header) {
          if (header == 'title_id') { kb += titleID; }
          kb += '\t';
        });

        fs.appendFile(missingFile, kb, callback);
      }
    });
  }, 1);

  return {
    addMiss: function (titleID) {
      if (!pkb[titleID]) { pkb[titleID] = false; }
    },

    /**
     * Look for an ID in the PKB
     * @param  {String} titleID
     * @return {Object} the extracted IDs or false
     */
    get: function(titleID) {
      if (pkb[titleID] || pkb[titleID] === false) {
        return pkb[titleID];
      }
      pkb[titleID] = false;
      missQueue.push(titleID);
      return false;
    }
  };
}


/**
 * Used to manage a list of encountered PKBs.
 */
function pkbManager() {
  var knowledge = {};

  return {
    /**
     * Takes a PKB request and adds it to the queue.
     * This way we can avoid concurrency conflicts by
     * processing one request only at a time.
     * @param  {String}   platform the requested platform name
     * @param  {Function} callback called with a pkbGetter or false
     */
    get: function (platform, callback) {
      this.pkbRequestQueue.push({ platform: platform, callback: callback });
    },

    /**
     * Clear cache
     */
    clearCache: function () {
      knowledge = {};
    },

    /**
     * Looks for a PKB matching the given platform and
     * returns a pkbGetter (see above) to search into it.
     * @param  {Object}   task           contains the requested platform name and a callback
     * @param  {Function} queueCallback  async callback to call when a worker is done
     */
    pkbRequestQueue: async.queue(function (task, queueCallback) {
      var platform = task.platform;
      var callback = task.callback;
      var pkb      = knowledge[platform];

      if (pkb) {
        task.callback(pkb);
        return queueCallback();
      } else if (pkb === false) {
        task.callback(false);
        return queueCallback();
      }

      var pkbFolder = path.join(platformsRoot, platform, 'pkb');

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

        if (pkbFiles.length === 0) {
          knowledge[platform] = false;
          task.callback(false);
          return queueCallback();
        }
        var opts = {
          silent: true,
          key: 'title_id',
          delimiter: '\t',
          remove: /^pkb-/
        };

        pkbFiles.sort(function (a, b) {
          // XXXX-XX-XX.txt
          return (a.substr(a.length - 14) < b.substr(b.length - 14) ? -1 : 1);
        });

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
            if (!exists) {
              knowledge[platform] = pkbGetter(platform, records);
              callback(knowledge[platform]);
              return queueCallback();
            }

            var opts = {
              silent: true,
              delimiter: '\t',
              fields: ['title_id']
            };

            csvextractor.extract(missFile, opts, function (err, missRecords) {
              if (err) {
                console.error('Bad CSV syntax: ' + missFile + ' - ' + err);
              }

              var pkb = pkbGetter(platform, records);

              for (var i in missRecords) {
                pkb.addMiss(missRecords[i].title_id);
              }

              knowledge[platform] = pkb;
              callback(pkb);
              return queueCallback();
            });
          });
        });
      });
    }, 1)
  };
}

module.exports = pkbManager();
