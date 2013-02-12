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
var pkbGetter = function(pkb) {
  var that    = this;
  that.pkb    = pkb;

  that.get = function (pid) {
    if (pkb[pid]) {
      return pkb[pid];
    }
    // TODO : notify missing PID
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

      if (fs.existsSync(pkbFile)) {
        csvextractor.extract(pkbFile, ['pid', 'issn', 'eissn'], function (records) {
          that.knowledge[platform] = new pkbGetter(records);
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