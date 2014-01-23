'use strict';

/**
 * This module handles a parser list and is used to find a parser using a domain.
 */

var fs           = require('fs');
var path         = require('path');
var async        = require('async');
var csvextractor = require('./csvextractor.js');

var missFile = path.join(__dirname, '../domains.miss.csv');

function ParserList() {
  var self     = this;
  self.parsers = {};

  /**
   * Extract missing domains from domains.miss.csv
   * or generate the file if it does not exist
   */
  fs.exists(missFile, function (exists) {
    if (exists) {
      var firstLine = fs.readFileSync(missFile, 'utf-8').split('\n')[0].trim();
      if (firstLine == 'domain') {
        csvextractor.extract(missFile, [], function (err, records) {
          records.forEach(function (record) {
            self.addMiss(record.domain);
          });
        });
      } else {
        fs.writeFileSync(missFile, 'domain');
      }
    } else {
      fs.writeFileSync(missFile, 'domain');
    }
  });

  self.missQueue = async.queue(function (domain, callback) {
    fs.appendFile(missFile, '\n' + domain, callback);
  }, 1);
}
module.exports = new ParserList();

/**
 * Add a domain as unknown
 * @param  {String} domain
 */
ParserList.prototype.addMiss = function (domain) {
  if (!this.parsers[domain]) {
    this.parsers[domain] = false;
  }
};

/**
 * Link a parser to a domain
 * @param  {String}  domain
 * @param  {String}  file      path to the parser file
 * @param  {Boolean} isNode    is the parser written with node.js ?
 * @param  {String}  platform  platform name
 */
ParserList.prototype.add = function (domain, file, isNode, platform) {
  if (!this.parsers[domain]) {
    this.parsers[domain] = {
      file: file,
      isNode: isNode,
      platform: platform
    };
    return true;
  } else {
    return false;
  }
};

/**
 * Look for a parser for a given domain
 * @param  {String} domain
 * @return {Object} the corresponding parser or false
 */
ParserList.prototype.get = function (domain) {
  if (this.parsers[domain] || this.parsers[domain] === false) {
    return this.parsers[domain];
  }
  this.parsers[domain] = false;
  this.missQueue.push(domain);
  return false;
};
