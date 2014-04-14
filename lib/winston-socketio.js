'use strict';

var util    = require('util');
var winston = require('winston');
var common  = require('winston/lib/winston/common');

var IOLogger = winston.transports.IOLogger = function (options) {
  this.name   = 'ioLogger';
  this.level  = options.level || 'info';
  this.socket = options.socket;
};

util.inherits(IOLogger, winston.Transport);

IOLogger.prototype.log = function (level, msg, meta, callback) {
  if (this.socket && level != 'silly') {
    var output = common.log({
      colorize:    this.colorize,
      json:        this.json,
      level:       level,
      message:     msg,
      meta:        meta,
      stringify:   this.stringify,
      timestamp:   this.timestamp,
      prettyPrint: this.prettyPrint,
      raw:         this.raw,
      label:       this.label
    });
    this.socket.emit('logging', output);
  }

  callback(null, true);
};