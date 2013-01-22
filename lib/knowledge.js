/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs = require('fs');
var csvextractor  = require('../lib/csvextractor');

/*
* that object manages a list of knowledge bases
*/
module.exports = function() {
  var that = this;
  that.knowledge        = {};
  that.pkbFolder  = __dirname + '/../ezpaarse-pkb';

  that.get = function(platform, callback) {
    var pkb = that.knowledge[platform];
    if (pkb) {
      console.log('Base déjà stockée');
      callback(pkb);
    } else if (pkb === 0) {
      console.log('Base déjà rencontrée, elle n\'existe pas');
      callback(false);
    } else {
      var pkbFile = that.pkbFolder + '/' + platform + '.pkb.csv';

      if (fs.existsSync(pkbFile)) {
        csvextractor([pkbFile], ['pid', 'issn', 'eissn'], function (records) {
          that.knowledge[platform] = records;
          callback(records);
        }, {type: 'files', silent: true, key: 'pid'});
      } else {
        that.knowledge[platform] = 0;
        callback(false);
      }
    }
  };
};