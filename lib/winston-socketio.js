'use strict';

const winston = require('winston');
const Transport = require('winston-transport');

class IOLogger extends Transport {
  constructor(options) {
    super(options);

    options = options || {};

    this.name   = 'ioLogger';
    this.level  = options.level || 'info';
    this.socket = options.socket;
  }

  log(options, callback) {
    if (this.socket) {
      const output = JSON.stringify({
        level :  options.level,
        message: options.message,
        timestamp: options.timestamp
      });
      this.socket.emit('logging', output);
    }

    callback(null, true);
  }
}

winston.transports.IOLogger = IOLogger;

module.exports = IOLogger;