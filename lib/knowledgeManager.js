/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs = require('fs');
var csvextractor  = require('../lib/csvextractor');

/*
* that object is used to search into one pkb
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
* that object manages a list of knowledge bases
*/
module.exports = function() {
  var that        = this;
  that.knowledge  = {};
  that.pkbFolder  = __dirname + '/../platforms-kb';

  /*
  * Look for a base matching the given platform and
  * return a pkbGetter object to search into it
  */
  that.get = function (platform, callback) {
    var pkb = that.knowledge[platform];
    if (pkb) {
      callback(pkb);
    } else if (pkb === 0) {
      callback(false);
    } else {
      var pkbFile = that.pkbFolder + '/' + platform + '.pkb.csv';

      if (fs.existsSync(pkbFile)) {
        csvextractor([pkbFile], ['pid', 'issn', 'eissn'], function (records) {
          that.knowledge[platform] = new pkbGetter(records);
          callback(that.knowledge[platform]);
        }, {type: 'files', silent: true, key: 'pid'});
      } else {
        that.knowledge[platform] = 0;
        callback(false);
      }
    }
  };
};