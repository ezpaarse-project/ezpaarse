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
function LogParser(logger, logFormat, proxy, dateFormat) {
  this.customFormat = false;
  this.logger       = logger;

  if (logFormat) {
    this.customFormat = true;
    switch (proxy) {
    case 'ezproxy':
      this.format = require('./proxyformats/ezproxy.js')(logFormat);
      break;
    case 'apache':
      this.format = require('./proxyformats/apache.js')(logFormat);
      break;
    case 'squid':
      this.format = require('./proxyformats/squid.js')(logFormat);
      break;
    }
    if (this.format && this.format.regexp && this.format.properties) {
      this.format.dateFormat  = dateFormat  || 'DD/MMM/YYYY:HH:mm:ss Z';

      if (this.logger) {
        this.logger.info('Given format: ' + logFormat);
        this.logger.info('Built regexp: ' + this.format.regexp);
      }
    } else {
      if (this.logger) { this.logger.error('The log format couldn\'t be built'); }
    }
  }
}
module.exports = LogParser;

LogParser.prototype.extract = function (line, format) {
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
      this.logger.error('The URL cannot be parsed: ' + ec.url);
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

LogParser.prototype.lookInFiles = function (line) {
  var ec    = false;
  var files = fs.readdirSync(__dirname + '/logformats');
  var autoFormat;
  for (var i = 0, l = files.length; i < l; i++) {
    autoFormat = require('./logformats/' + files[i]);
    if (!autoFormat.properties || ! autoFormat.regexp) { continue; }

    ec = this.extract(line, autoFormat);
    if (ec) {
      if (this.logger) { this.logger.info('Format found: ' + autoFormat.regexp); }
      autoFormat.dateFormat = autoFormat.dateFormat || 'DD/MMM/YYYY:HH:mm:ss Z';
      this.format = autoFormat;
      break;
    } else {
      if (this.logger) { this.logger.info('Format doesn\'t match: ' + autoFormat.regexp); }
    }
  }
  return ec;
};

LogParser.prototype.parse = function (line) {
  var ec  = false;
  if (line !== '') {
    if (this.format) {
      ec = this.extract(line, this.format);
    } else if (!this.customFormat) {
      if (this.logger) { this.logger.info('No format given, trying to guess'); }
      ec = this.lookInFiles(line);
    }
  }
  return ec;
};

LogParser.prototype.getFields = function () {
  if (this.format && this.format.properties) {
    var outputFields = this.format.properties.slice();
    // logs mostly have DATETIME, but we want to output DATE by default
    var dateIndex = outputFields.indexOf('datetime');
    if (dateIndex != -1) { outputFields[dateIndex] = 'date'; }

    return outputFields;
  } else {
    return false;
  }
};

LogParser.prototype.getRegexp = function () {
  if (this.format) {
    return this.format.regexp;
  } else {
    return false;
  }
};
