'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var pkbManager   = require('./pkbmanager.js');
require('sugar'); // add more methods to Objects (like merge)
var hostlocalize = require('./hostlocalize.js');
var mongo        = require('./mongo.js');

/**
 * Create an EC enhancer
 * @param {Object} job  an instance of job
 */
function Enhancer(job) {
  this.job      = job;
  this.notifier = job.notifiers['missing-title-ids'];
  this.disabled = job.noEnrich;
}
util.inherits(Enhancer, EventEmitter);
module.exports = Enhancer;

Enhancer.prototype.push = function (ec) {
  var self = this;

  if (this.disabled) { return this.emit('ec', ec); }

  // geolocalization from orignal ip address
  function geoloc() {
    hostlocalize.resolve(ec._meta.originalHost, self.job, function (geo) {
      Object.merge(ec, geo);
      self.emit('ec', ec);
    });
  }

  if (ec.title_id) {
    mongo.db.collection('pkbs').findOne({
      'content.json.title_id': ec.title_id,
      '_platform': ec.platform
    }, function (err, entry) {
      self.notifier.incrementQueries(ec.platform);

      if (entry) {
        var info = entry.content.json;
        for (var prop in info) {
          ec[prop] = info[prop];
        }
      } else {
        self.notifier.incrementMisses(ec.platform, ec.title_id);
        self.job.logStreams.write('pkb-miss-ecs', ec._meta.originalLine + '\n');
        self.job.report.inc('rejets', 'nb-lines-pkb-miss-ecs');
      }
      if (self.job.geolocalize !== 'none') { geoloc(); }
      else { self.emit('ec', ec); }
    });
  } else {
    if (self.job.geolocalize !== 'none') { geoloc(); }
    else { self.emit('ec', ec); }
  }
};

