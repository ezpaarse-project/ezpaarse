/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

/*
* This module allows for searching into the PKB repository.
*/

var fs            = require('fs');
var csvextractor  = require('../lib/csvextractor.js');
var async         = require('async');

/*
* that object is used to search into one pkb.
*/
var pkbGetter = function(platform, pkb) {
  var that          = this;
  that.platform     = platform;
  that.pkb          = pkb;
  that.missingFile  = __dirname + '/../platforms-kb/' + platform + '.pkb.miss.csv';

  that.missQueue = async.queue(function (pid, callback) {
    if (!fs.existsSync(that.missingFile)) {
      fs.writeFileSync(that.missingFile, 'pid;issn;eissn;url');
    }
    fs.appendFileSync(that.missingFile, '\n' + pid + ';;;');
    callback();
  }, 1);

  that.get = function (pid) {
    if (pkb[pid]) {
      return pkb[pid];
    }
    that.missQueue.push(pid);
    return false;
  };
};

/*
* that object manages the list of encountered PKBs.
*/
module.exports = function() {
  var that        = this;
  that.knowledge  = {};
  that.pkbFolder  = __dirname + '/../platforms-kb';

  /*
  * Looks for a PKB matching the given platform and
  * returns a pkbGetter (see above) to search into it.
  */
  that.pkbRequestQueue = async.queue(function (task, queueCallback) {
    var platform = task.platform;
    var callback = task.callback;
    var pkb = that.knowledge[platform];

    if (pkb) {
      task.callback(pkb);
      queueCallback();
    } else if (pkb === 0) {
      task.callback(false);
      queueCallback();
    } else {
      var pkbFile = that.pkbFolder + '/' + platform + '.pkb.csv';
        // *** Useless code ***
        var regexp    = new RegExp('^' + platform + '(\\.[^ ]+)?\\.pkb\\.csv$');
        // var pkbFolder = fs.readdirSync(that.pkbFolder);
        var pkbFiles  = [];
        // for (var i = 0, l = pkbFolder.length; i < l; i++) {
        //   var file = that.pkbFolder + '/' + pkbFolder[i];
        //   // if (fs.existsSync(file) && fs.statSync(file).isFile() && regexp.test(file)) {
        //   //   pkbFiles.push(file);
        //   // }
        // };
        // *** End of useless code ***
      if (fs.existsSync(pkbFile)) {
        csvextractor.extract(pkbFile, ['pid', 'issn', 'eissn'], function (records) {
      // if (pkbFiles.length > 0) {
      //   csvextractor.extract(pkbFiles, ['pid', 'issn', 'eissn'], function (records) {
          that.knowledge[platform] = new pkbGetter(platform, records);
          callback(that.knowledge[platform]);
          queueCallback();
        }, {silent: true, key: 'pid'});
      } else {
        that.knowledge[platform] = 0;
        task.callback(false);
        queueCallback();
      }
    }
  }, 1);

  /*
  * Takes a PKB request and adds it to the queue.
  * This way we can avoid concurrency conflicts by
  * processing one request only at a time.
  */
  that.get = function (platform, callback) {
    that.pkbRequestQueue.push({ platform: platform, callback: callback });
  };
};