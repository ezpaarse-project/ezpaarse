/*jslint node: true, maxlen: 110, maxerr: 50, indent: 2 */
'use strict';
var config = require('../config.json');

exports.host      = '127.0.0.1';
exports.port      =  config.EZPAARSE_NODEJS_PORT;
exports.url       = 'http://' + this.host + ':' + this.port;