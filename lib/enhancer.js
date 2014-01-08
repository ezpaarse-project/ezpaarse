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
function Enhancer(logger, sh, report) {
  this.logger = logger;
  this.sh     = sh;
  this.report = report;
}
util.inherits(Enhancer, EventEmitter);
module.exports = Enhancer;

Enhancer.prototype.push = function (ec) {
  var self = this;

  if (ec.pid) {
    pkbManager.get(ec.platform, function (pkb) {
      if (pkb) {
        var info = pkb.get(ec.pid);
        if (info) {
          for (var prop in info) {
            ec[prop] = info[prop];
          }
        } else {
          self.logger.silly('The PID couldn\'t be found in the PKB');
          self.sh.write('pkb-miss-ecs', ec._meta.originalLine + '\n');
          self.report.inc('rejets', 'nb-lines-pkb-miss-ecs');
        }
      } else {
        self.logger.silly('No knowledge base found');
      }
      self.emit('ec', ec);
    });
  } else {
    self.logger.silly('The parser couldn\'t find any PID in the given URL');
    self.emit('ec', ec);
  }
};
