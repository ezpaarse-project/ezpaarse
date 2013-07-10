/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs      = require('fs');
var URL     = require('url');
var moment  = require('moment');
var winston = require('winston');
var EC      = require('../lib/consultationevent.js');

/**
 * Creates a log parser
 * @param  {object} logger       an instance of winston.Logger
 * @param  {string} logFormat    the format string (ex: %h %u [%t])
 * @param  {string} proxy        the proxy which generated the logs
 * @param  {string} dateFormat   the date format (optional)
 */
module.exports = function (logger, logFormat, proxy, dateFormat) {
  var self          = this;
  self.separator    = ' ';
  self.customFormat = false;
  var c = 1;

  if (logFormat) {
    self.customFormat = true;
    switch (proxy) {
    case 'ezproxy':
      self.format = require('./proxyformats/ezproxy.js')(logFormat);
      break;
    case 'apache':
      self.format = require('./proxyformats/apache.js')(logFormat);
      break;
    case 'squid':
      self.format = require('./proxyformats/squid.js')(logFormat);
      break;
    }
    if (self.format && self.format.regexp && self.format.properties) {
      self.format.dateFormat  = dateFormat  || 'DD/MMM/YYYY:HH:mm:ss Z';

      logger.info('Given format: ' + logFormat);
      logger.info('Built regexp: ' + self.format.regexp);
    } else {
      logger.error('The log format couldn\'t be built');
    }
  }

  self.extract = function (line, format) {
    var ec    = false;
    var reg   = new RegExp(format.regexp);
    var match = reg.exec(line);
    if (match) {
      ec = new EC(line, c++, false);
      for (var i = 0, l = format.properties.length; i < l; i++) {
        if (match[i + 1] != '-') {
          ec[format.properties[i]] = match[i + 1];
        }
      }
    }
    if (ec.url)   {
      // bibliopam urls must be normalized
      ec.url = ec.url.replace(/^\/http\//, 'http://');
      ec.domain = URL.parse(ec.url).hostname;
    }
    if (ec.datetime)  {
      var date     = moment(ec.datetime, format.dateFormat);
      ec.datetime  = date.format();
      ec.timestamp = date.unix();
      ec.date      = ec.datetime.split('T')[0];
    }

    return ec;
  }

  self.lookInFiles = function (line) {
    var ec    = false;
    var files = fs.readdirSync(__dirname + '/logformats');
    var format;
    for (var i = 0, l = files.length; i < l; i++) {
      format = require('./logformats/' + files[i]);
      if (!format.properties || ! format.regexp) { continue; }

      ec = self.extract(line, format);
      if (ec) {
        logger.info('Format found: ' + format.regexp);
        format.dateFormat = format.dateFormat || 'DD/MMM/YYYY:HH:mm:ss Z';
        self.format = format;
        break;
      } else {
        logger.info('Format doesn\'t match: ' + format.regexp);
      }
    }
    return ec;
  }

  self.parse = function (line) {
    var ec  = false;
    if (line !== '') {
      if (self.format) {
        ec = self.extract(line, self.format);
      } else if (!self.customFormat) {
        logger.info('No format given, trying to guess');
        ec = self.lookInFiles(line);
      }
    }
    return ec;
  };

  self.getFields = function () {
    if (self.format && self.format.properties) {
      var outputFields = self.format.properties.slice();
      // logs mostly have DATETIME, but we want to output DATE by default
      var dateIndex = outputFields.indexOf('datetime');
      if (dateIndex != -1) { outputFields[dateIndex] = 'date' }

      return outputFields;
    } else {
      return false;
    }
  }
};