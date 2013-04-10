/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs      = require('fs');
var URL     = require('url');
var moment  = require('moment');
var winston = require('winston');

/**
 * Creates a log parser
 * @param  {object} logger       an instance of winston.Logger
 * @param  {string} logFormat    the format string (ex: %h %u [%t])
 * @param  {string} proxy        the proxy which generated the logs
 * @param  {string} dateFormat   the date format (optional)
 */
module.exports = function (logger, logFormat, proxy, dateFormat) {
  var that          = this;
  that.separator    = ' ';
  that.customFormat = false;

  if (logFormat) {
    that.customFormat = true;
    switch(proxy) {
      case 'ezproxy':
        that.format = require('./proxyformats/ezproxy.js')(logFormat);
        break;
      case 'bibliopam':
        that.format = require('./proxyformats/apache.js')(logFormat);
        break;
      case 'squid':
        that.format = require('./proxyformats/squid.js')(logFormat);
        break;
    }
    if (that.format) {
      that.format.dateFormat  = dateFormat  || 'DD/MMM/YYYY:HH:mm:ss Z';
      logger.info('Given format: ' + logFormat);
      logger.info('Built regexp: ' + that.format.regexp);
    } else {
      logger.error('The log format couldn\'t be built');
    }
  }

  that.extract = function (line, format) {
    var ec    = false;
    var reg   = new RegExp(format.regexp);
    var match = reg.exec(line);
    if (match) {
      ec = {};
      for (var i = 0, l = format.properties.length; i < l; i++) {
        if (match[i+1] != '-') {
          ec[format.properties[i]] = match[i+1];
        }
      }
    }
    if (ec.url)   {
      // bibliopam urls must be normalized
      if (proxy === 'bibliopam') {
        ec.url = ec.url.replace(/^\/http\//, 'http://');
      }
      ec.domain = URL.parse(ec.url).hostname;
    }
    if (ec.date)  { ec.date = moment(ec.date, format.dateFormat).format(); }

    return ec;
  }

  that.lookInFiles = function (line) {
    var ec    = false;
    var files = fs.readdirSync(__dirname + '/logformats');
    var format;
    for (var i = 0, l = files.length; i < l; i++) {
      format = require('./logformats/' + files[i]);
      if (!format.properties) { continue; }

      ec = that.extract(line, format);
      if (ec) {
        logger.info('Format found: ' + format.regexp);
        format.dateFormat  = format.dateFormat  || 'DD/MMM/YYYY:HH:mm:ss Z';
        that.format = format;
        break;
      } else {
        logger.info('Format doesn\'t match: ' + format.regexp);
      }
    }
    return ec;
  }

  that.parse = function (line) {
    var ec  = false;
    if (line != '') {
      if (that.format) {
        ec = that.extract(line, that.format);
      } else if (!that.customFormat) {
        logger.info('No format given, trying to guess');
        ec = that.lookInFiles(line);
      }
    }
    return ec;
  };

  that.getFields = function () {
    if (that.format) {
      return that.format.properties;
    } else {
      return false;
    }
  }
};