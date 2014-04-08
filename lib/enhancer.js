'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var pkbManager   = require('./pkbmanager.js');
require('sugar'); // add more methods to Objects (like merge)
var hostlocalize = require('./hostlocalize.js');

/**
 * Create an EC enhancer
 * @param {Object} job  an instance of job
 */
function Enhancer(job) {
  this.logger = job.logger;
  this.sh     = job.logStreams;
  this.report = job.report;
  this.geolocalize = job.geolocalize;
}
util.inherits(Enhancer, EventEmitter);
module.exports = Enhancer;

Enhancer.prototype.push = function (ec) {
  var self = this;

  // geolocalization from orignal ip address
  function geoloc() {
    hostlocalize.resolve(ec._meta.originalHost,
      function (geo) {
        Object.merge(ec, geo);
        self.emit('ec', ec);
      },
      self.logger
    );
  }

  if (ec.title_id) {
    pkbManager.get(ec.platform, function (pkb) {
      if (pkb) {
        var info = pkb.get(ec.title_id);
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
      if (self.geolocalize) { geoloc(); }
      else { self.emit('ec', ec); }
    });
  } else {
    self.logger.silly('The parser couldn\'t find any PID in the given URL');
    if (self.geolocalize) { geoloc(); }
    else { self.emit('ec', ec); }
  }
};

