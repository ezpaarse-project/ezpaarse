'use strict';

var fs      = require('fs');
var URL     = require('url');
var moment  = require('moment');
var EC      = require('./consultationevent.js');

/**
 * Creates a log parser
 * @param  {object} logger       an instance of winston.Logger
 * @param  {string} logFormat    the format string (ex: %h %u [%t])
 * @param  {string} proxy        the proxy which generated the logs
 * @param  {string} dateFormat   the date format (optional)
 */
module.exports = function (logger, logFormat, proxy, dateFormat) {
  var self         = this;
  var customFormat = false;
  var format;

  if (logFormat) {
    customFormat = true;
    switch (proxy) {
    case 'ezproxy':
      format = require('./proxyformats/ezproxy.js')(logFormat);
      break;
    case 'apache':
      format = require('./proxyformats/apache.js')(logFormat);
      break;
    case 'squid':
      format = require('./proxyformats/squid.js')(logFormat);
      break;
    }
    if (format && format.regexp && format.properties) {
      format.dateFormat  = dateFormat  || 'DD/MMM/YYYY:HH:mm:ss Z';

      if (logger) {
        logger.info('Given format: ' + logFormat);
        logger.info('Built regexp: ' + format.regexp);
      }
    } else {
      if (logger) { logger.error('The log format couldn\'t be built'); }
    }
  }

  self.extract = function (line, format) {
    var ec    = false;
    var reg   = new RegExp(format.regexp);
    var match = reg.exec(line);
    if (match) {
      ec = new EC();
      for (var i = 0, l = format.properties.length; i < l; i++) {
        if (match[i + 1] != '-') {
          ec[format.properties[i]] = match[i + 1];
        }
      }
    }
    if (ec.url)   {
      // bibliopam urls must be normalized
      ec.url = ec.url.replace(/^\/http\//, 'http://');
      try {
        ec.domain = URL.parse(ec.url).hostname;
      } catch (err) {
        logger.error('The URL cannot be parsed: ' + ec.url);
        ec.domain = '';
      }
    }
    var date;
    if (ec.timestamp || ec.epoch) {
      ec.timestamp = ec.timestamp || ec.epoch;
      date         = moment.unix(ec.timestamp || ec.epoch);
      ec.datetime  = date.format();
      ec.date      = ec.datetime.split('T')[0];
    } else if (ec.datetime)  {
      date         = moment(ec.datetime, format.dateFormat);
      ec.datetime  = date.format();
      ec.timestamp = date.unix();
      ec.date      = ec.datetime.split('T')[0];
    }
    return ec;
  };

  self.lookInFiles = function (line) {
    var ec    = false;
    var files = fs.readdirSync(__dirname + '/logformats');
    var autoFormat;
    for (var i = 0, l = files.length; i < l; i++) {
      autoFormat = require('./logformats/' + files[i]);
      if (!autoFormat.properties || ! autoFormat.regexp) { continue; }

      ec = self.extract(line, autoFormat);
      if (ec) {
        if (logger) { logger.info('Format found: ' + autoFormat.regexp); }
        autoFormat.dateFormat = autoFormat.dateFormat || 'DD/MMM/YYYY:HH:mm:ss Z';
        format = autoFormat;
        break;
      } else {
        if (logger) { logger.info('Format doesn\'t match: ' + autoFormat.regexp); }
      }
    }
    return ec;
  };

  self.parse = function (line) {
    var ec  = false;
    if (line !== '') {
      if (format) {
        ec = self.extract(line, format);
      } else if (!customFormat) {
        if (logger) { logger.info('No format given, trying to guess'); }
        ec = self.lookInFiles(line);
      }
    }
    return ec;
  };

  self.getFields = function () {
    if (format && format.properties) {
      var outputFields = format.properties.slice();
      // logs mostly have DATETIME, but we want to output DATE by default
      var dateIndex = outputFields.indexOf('datetime');
      if (dateIndex != -1) { outputFields[dateIndex] = 'date'; }

      return outputFields;
    } else {
      return false;
    }
  };

  self.getRegexp = function () {
    if (format) {
      return format.regexp;
    } else {
      return false;
    }
  };
};