'use strict';

const config = require('./config');
const winston = require('winston');
const IOLogger = require('./winston-socketio');

winston.transports.IOLogger = IOLogger;
winston.addColors({ verbose: 'green', info: 'green', warn: 'yellow', error: 'red' });
const { format } = winston;

module.exports = winston.createLogger({
  level: config.EZPAARSE_LOG_LEVEL || 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [new (winston.transports.Console)()]
});
