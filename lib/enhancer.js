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
  this.job    = job;
}
util.inherits(Enhancer, EventEmitter);
module.exports = Enhancer;

Enhancer.prototype.push = function (ec) {
  var self = this;

  // geolocalization from orignal ip address
  function geoloc() {
    var requestingDNS = hostlocalize.resolve(ec._meta.originalHost, self.job, function (geo) {
      Object.merge(ec, geo);
      self.emit('ec', ec);
      if (requestingDNS) { self.emit('drain'); }
    });

    if (requestingDNS) { self.emit('saturated'); }
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
          self.job.logger.silly('The PID couldn\'t be found in the PKB');
          self.job.logStreams.write('pkb-miss-ecs', ec._meta.originalLine + '\n');
          self.job.report.inc('rejets', 'nb-lines-pkb-miss-ecs');
        }
      } else {
        self.job.logger.silly('No knowledge base found');
      }
      if (self.job.geolocalize !== 'none') { geoloc(); }
      else { self.emit('ec', ec); }
    });
  } else {
    self.job.logger.silly('The parser couldn\'t find any PID in the given URL');
    if (self.job.geolocalize !== 'none') { geoloc(); }
    else { self.emit('ec', ec); }
  }
};

