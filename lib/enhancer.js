'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var pkbManager   = require('./pkbmanager.js');

/**
 * Create an EC enhancer
 * @param {Object} logger  an instance of winston.Logger
 * @param {Object} sh      a handler for log writestreams
 * @param {Object} report  the report manager
 */
var Enhancer = function (logger, sh, report) {
  var self = this;
  
  self.push = function (ec) {
    if (ec.pid) {
      pkbManager.get(ec.platform, function (pkb) {
        if (pkb) {
          var info = pkb.get(ec.pid);
          if (info) {
            for (var prop in info) {
              ec[prop] = info[prop];
            }
          } else {
            logger.silly('The PID couldn\'t be found in the PKB');
            sh.write('pkbMissECs', ec._meta.originalLine + '\n');
            report.inc('rejets', 'nb-lines-pkb-miss-ecs');
          }
        } else {
          logger.silly('No knowledge base found');
        }
        self.emit('ec', ec);
      });
    } else {
      logger.silly('The parser couldn\'t find any PID in the given URL');
      self.emit('ec', ec);
    }
  };
};

util.inherits(Enhancer, EventEmitter);
module.exports = Enhancer;