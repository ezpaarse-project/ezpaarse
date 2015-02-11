'use strict';

var URL    = require('url');
var moment = require('moment');
var EC     = require('./consultationevent.js');

var formats    = require('./auto-formats.js');
var extractors = {
  'ezproxy': require('./proxyformats/ezproxy.js'),
  'squid':   require('./proxyformats/squid.js'),
  'apache':  require('./proxyformats/apache.js')
};

/**
 * Create a log parser
 * @param  {Object} options -> [proxy] the proxy name (ex: ezproxy)
 *                             [format] the proxy format (ex: %h %u "%r")
 *                             [dateFormat] the date format (default: 'DD/MMM/YYYY:HH:mm:ss Z')
 *                             [relativeDomain] the domain to use for relative URLs
 *                             [logger] a winston-like object for logging
 * @return {Object} the parser
 */
module.exports = function logParser(options) {
  options            = options || {};
  options.dateFormat = options.dateFormat || 'DD/MMM/YYYY:HH:mm:ss Z';

  var parser = {};
  var extractor;

  if (options.format && options.proxy) {
    if (extractors.hasOwnProperty(options.proxy)) {
      extractor = extractors[options.proxy](options.format);
    } else {
      extractor = null;
    }
  }

  /**
   * Try standard formats on the given line
   * Parser options are overriden
   * @param  {String} line the log line to parse
   * @return {Object}      the resulting EC or null
   */
  parser.guess = function (line) {

    for (var proxy in formats) {
      var proxyFormats = formats[proxy];

      for (var i = 0, l = proxyFormats.length; i < l; i++) {
        var autoFormat = proxyFormats[i];

        if (!autoFormat.format) { continue; }
        if (typeof extractors[proxy] !== 'function') { continue; }

        options.proxy      = proxy;
        options.format     = autoFormat.format;
        options.dateFormat = autoFormat.dateFormat || 'DD/MMM/YYYY:HH:mm:ss Z';

        extractor = extractors[proxy](autoFormat.format);
        if (!extractor) { continue; }

        var ec = parser.extract(line);

        if (ec) {
          if (options.logger) {
            options.logger.info('Format found: ' + options.format + ' (' + proxy + ')');
          }
          return ec;
        } else {
          options.logger.info('Format doesn\'t match: ' + options.format + ' (' + proxy + ')');
        }
      }
    }

    return null;
  };

  /**
   * Use the extractor on the given line to create an EC
   * @param  {String} line the log line to parse
   * @return {Object}      the resulting EC or null
   */
  parser.extract = function (line) {
    if (!extractor || !line) { return null; }

    var match = extractor.regexp.exec(line);
    if (!match) { return null; }

    var ec = new EC();
    for (var i = 0, l = extractor.properties.length; i < l; i++) {
      if (match[i + 1] != '-') {
        ec[extractor.properties[i]] = match[i + 1];
      }
    }
    if (ec.url) {
      ec.url = ec.url.replace(/^\/http\//, 'http://');

      if (ec.url.charAt(0) == '/') {
        if (options.relativeDomain) {
          ec.url    = 'http://' + options.relativeDomain + ec.url;
          ec.domain = options.relativeDomain;
        }
      } else {
        // bibliopam urls must be normalized
        if (!/^https?:\/\//.test(ec.url)) { ec.url = 'http://' + ec.url; }
        try {
          ec.domain = URL.parse(ec.url).hostname;
        } catch (err) {
          options.logger.error('The URL cannot be parsed: ' + ec.url);
          ec.domain = '';
        }
      }
    }

    if (ec.timestamp || ec.epoch) {
      var date     = moment.unix(ec.timestamp || ec.epoch);
      ec.timestamp = ec.timestamp || ec.epoch;
      ec.datetime  = date.format();
      ec.date      = ec.datetime.split('T')[0];
    } else if (ec.datetime)  {
      var date     = moment(ec.datetime, options.dateFormat);
      ec.datetime  = date.format();
      ec.timestamp = date.unix();
      ec.date      = ec.datetime.split('T')[0];
    }
    return ec;
  };

  /**
   * Parse a given log line
   * Try to guess the format if it's not provided
   * @param  {String} line the log line to parse
   * @return {Object}      the resulting EC or null
   */
  parser.parse = function (line) {
    if (!line) { return null; }

    if (extractor === undefined) {
      if (options.logger) { options.logger.info('No format given, trying to guess'); }
      parser.guess(line);
    }

    if (extractor) { return parser.extract(line); }

    return null;
  };

  parser.getFields = function () {
    if (!extractor || !extractor.properties) {
      return false;
    }

    var outputFields = extractor.properties.slice();
    // logs mostly have DATETIME, but we want to output DATE by default
    var dateIndex = outputFields.indexOf('datetime');
    if (dateIndex != -1) { outputFields[dateIndex] = 'date'; }

    return outputFields;
  };

  parser.getRegexp = function (literal) {
    if (!extractor || !extractor.regexp) { return null; }
    return literal ? extractor.regexp.toString() : extractor.regexp;
  };

  parser.getFormat = function () {
    return options.format ? options.format + ' (' + options.proxy + ')' : null;
  };

  return parser;
};
