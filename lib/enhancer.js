'use strict';

require('sugar'); // add more methods to Objects (like merge)
var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var hostlocalize = require('./hostlocalize.js');
var mongo        = require('./mongo.js');

/**
 * Create an EC enhancer
 * @param {Object} job  an instance of job
 */
function Enhancer(job) {
  this.job       = job;
  this.notifier  = job.notifiers['missing-title-ids'];
  this.disabled  = job.noEnrich;
  this.missing   = {};
  this.pkbs      = mongo.db ? mongo.db.collection('pkbs') : null;
}
util.inherits(Enhancer, EventEmitter);
module.exports = Enhancer;

Enhancer.prototype.push = function (ec) {
  var self = this;

  if (this.disabled) { return this.emit('ec', ec); }

  // geolocalization from orignal ip address
  var geoloc = function () {
    hostlocalize.resolve(ec._meta.originalHost, self.job, function (geo) {
      Object.merge(ec, geo);
      self.emit('ec', ec);
    });
  };

  var finalize = function () {
    if (self.job.geolocalize !== 'none') {
      geoloc();
    } else {
      self.emit('ec', ec);
    }
  };

  if (!ec.title_id || this.missing[ec.platform]) { return finalize(); }

  if (!this.pkbs) {
    self.job.report.inc('general', 'enhancement-errors');
    return finalize();
  }

  self.pkbs.findOne({
    'content.json.title_id': ec.title_id,
    '_platform': ec.platform,
    'state': { $ne: 'deleted' }
  }, {
    'content': 1
  }, function (err, entry) {
    if (err) {
      self.job.report.inc('general', 'enhancement-errors');
      return finalize();
    }

    self.notifier.incrementQueries(ec.platform);
    if (entry) {
      var info = entry.content.json;
      for (var prop in info) {
        if (info[prop]) { ec[prop] = info[prop]; }
      }
      return finalize();
    }

    self.notifier.incrementMisses(ec.platform, ec.title_id);
    self.job.logStreams.write('pkb-miss-ecs', ec._meta.originalLine + '\n');
    self.job.report.inc('rejets', 'nb-lines-pkb-miss-ecs');

    if (self.missing.hasOwnProperty(ec.platform)) { return finalize(); }

    self.missing[ec.platform] = 0;

    self.pkbs.findOne({ '_platform': ec.platform }, { _id: 1 }, function (err, entry) {
      if (err) { return finalize(); }
      self.missing[ec.platform] = entry ? 0 : 1;

      if (!entry) { self.notifier.noPkbFor(ec.platform); }

      finalize();
    });
  });
};

