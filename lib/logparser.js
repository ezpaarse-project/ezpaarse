'use strict';

var URL    = require('url');
var moment = require('moment');
var EC     = require('./consultationevent.js');

/**
 * Creates a log parser
 * @param  {object} logger       an instance of winston.Logger
 * @param  {string} logFormat    the format string (ex: %h %u [%t])
 * @param  {string} proxy        the proxy which generated the logs
 * @param  {string} dateFormat   the date format (optional)
 */
function LogParser(logger, logFormat, proxy, dateFormat, relativeDomain) {
  this.customFormat   = false;
  this.logger         = logger;
  this.format         = logFormat;
  this.proxy          = proxy;
  this.dateFormat     = dateFormat;
  this.relativeDomain = relativeDomain;

  if (logFormat) {
    this.customFormat = true;
    this.extractor = this.getExtractor();

    if (this.logger) {
      if (this.extractor) {
        this.logger.info('Given format: ' + logFormat);
        this.logger.info('Built regexp: ' + this.extractor.regexp);
      } else {
        this.logger.error('The log format couldn\'t be built');
      }
    }
  }
}
module.exports = LogParser;

LogParser.prototype.getExtractor = function () {
  var extractor;

  switch (this.proxy) {
  case 'ezproxy':
    extractor = require('./proxyformats/ezproxy.js')(this.format);
    break;
  case 'apache':
    extractor = require('./proxyformats/apache.js')(this.format);
    break;
  case 'squid':
    extractor = require('./proxyformats/squid.js')(this.format);
    break;
  }
  if (extractor && extractor.regexp && extractor.properties) {
    extractor.dateFormat = this.dateFormat  || 'DD/MMM/YYYY:HH:mm:ss Z';
  } else {
    extractor = undefined;
  }

  return extractor;
};

LogParser.prototype.extract = function (line, format) {
  var ec;
  var reg;

  try {
    reg = new RegExp(format.regexp);
  } catch (e) {
    return;
  }

  var match = reg.exec(line);
  if (!match) { return; }

  ec = new EC();
  for (var i = 0, l = format.properties.length; i < l; i++) {
    if (match[i + 1] != '-') {
      ec[format.properties[i]] = match[i + 1];
    }
  }
  if (ec.url) {
    ec.url = ec.url.replace(/^\/http\//, 'http://');

    if (ec.url.charAt(0) == '/') {
      ec.url    = 'http://' + this.relativeDomain + ec.url;
      ec.domain = this.relativeDomain;
    } else {
      // bibliopam urls must be normalized
      if (!/^https?:\/\//.test(ec.url)) { ec.url = 'http://' + ec.url; }
      try {
        ec.domain = URL.parse(ec.url).hostname;
      } catch (err) {
        this.logger.error('The URL cannot be parsed: ' + ec.url);
        ec.domain = '';
      }
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

LogParser.prototype.autoDetect = function (line) {
  var formats = require('./auto-formats.js');
  var proxyFormats;
  var autoFormat;
  var extractor;
  var ec;

  for (var proxy in formats) {
    proxyFormats = formats[proxy];

    for (var i = 0, l = proxyFormats.length; i < l; i++) {
      autoFormat      = proxyFormats[i];
      this.format     = autoFormat.format;
      this.proxy      = proxy;
      this.dateFormat = autoFormat.dateFormat;

      extractor = this.getExtractor();
      if (!extractor) { continue; }

      ec = this.extract(line, extractor);
      if (ec) {
        if (this.logger) {
          this.logger.info('Format found: ' + this.format + ' (' + proxy + ')');
        }
        extractor.dateFormat = extractor.dateFormat || 'DD/MMM/YYYY:HH:mm:ss Z';
        this.extractor = extractor;
        return ec;
      } else {
        if (this.logger) {
          this.logger.info('Format doesn\'t match: ' + this.format + ' (' + proxy + ')');
        }
      }
    }
  }

  return undefined;
};

LogParser.prototype.parse = function (line) {
  var ec = false;
  if (line !== '') {
    if (this.extractor) {
      ec = this.extract(line, this.extractor);
    } else if (!this.customFormat) {
      if (this.logger) { this.logger.info('No format given, trying to guess'); }
      ec = this.autoDetect(line);
    }
  }
  return ec;
};

LogParser.prototype.getFields = function () {
  if (this.extractor && this.extractor.properties) {
    var outputFields = this.extractor.properties.slice();
    // logs mostly have DATETIME, but we want to output DATE by default
    var dateIndex = outputFields.indexOf('datetime');
    if (dateIndex != -1) { outputFields[dateIndex] = 'date'; }

    return outputFields;
  } else {
    return false;
  }
};

LogParser.prototype.getRegexp = function () {
  return this.extractor ? this.extractor.regexp : undefined;
};

LogParser.prototype.getFormat = function () {
  return this.format ? this.format + ' (' + this.proxy + ')' : undefined;
};
