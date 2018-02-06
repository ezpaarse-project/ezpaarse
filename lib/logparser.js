/* eslint global-require: 0 */
'use strict';

var URL     = require('url');
var moment  = require('moment');
var formats = require('../resources/auto-formats.js');
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
 *                             [forceParser] the platform/parser to use for URLs without domain
 *                             [logger] a winston-like object for logging
 * @return {Object} the parser
 */
module.exports = function logParser(options) {
  options            = options || {};
  options.dateFormat = options.dateFormat || 'DD/MMM/YYYY:HH:mm:ss Z';

  var parser = {};
  var extractor;
  var autoDetect = false;

  if (options.proxy) {
    if (typeof extractors[options.proxy] === 'function') {
      extractor = extractors[options.proxy](options.format, options.laxist);
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
    autoDetect = true;

    for (var proxy in formats) {
      var proxyFormats = formats[proxy];

      for (var i = 0, l = proxyFormats.length; i < l; i++) {
        var autoFormat = proxyFormats[i];

        if (!autoFormat.format) { continue; }
        if (typeof extractors[proxy] !== 'function') { continue; }

        options.proxy      = proxy;
        options.format     = autoFormat.format;
        options.dateFormat = autoFormat.dateFormat || 'DD/MMM/YYYY:HH:mm:ss Z';

        extractor = extractors[proxy](autoFormat.format);
        if (!extractor) { continue; }

        var ec = parser.extract(line);

        if (ec) {
          if (options.logger) {
            options.logger.info('Format found: ' + options.format + ' (' + proxy + ')');
          }
          return ec;
        }
      }
    }

    extractor = undefined;
    return null;
  };

  /**
   * Use the extractor on the given line to create an EC
   * @param  {String}  line the log line to parse
   * @param  {Boolean} opt  ignoreUrl: set to true to prevent parsing of the url
   *                        ignoreDate: set to true to prevent parsing of the date
   * @return {Object} the resulting EC or null
   */
  parser.extract = function (line, opt) {
    if (!extractor || !line) { return null; }

    var match = extractor.regexp.exec(line);
    if (!match) { return null; }

    var ec = {};

    for (var i = 0, l = extractor.properties.length; i < l; i++) {
      let value = match[i + 1];
      if (/^".*"$/.test(value)) {
        value = value.substr(1, value.length - 2);
      }
      if (value && value !== '-') {
        ec[extractor.properties[i]] = value;
      }
    }

    if (!opt || !opt.ignoreUrl) {
      this.parseUrl(ec);
    }
    if (!opt || !opt.ignoreDate) {
      this.parseDate(ec);
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
      if (options.logger) { options.logger.info('Trying to guess line format'); }
      parser.guess(line);
    }

    if (extractor) { return parser.extract(line); }

    return null;
  };

  parser.parseUrl = function (ec) {
    if (ec.url) {
      ec.url = ec.url.replace(/^\/http\//, 'http://');

      if (ec.url.charAt(0) !== '/') {
        // bibliopam urls must be normalized
        if (!/^https?:\/\//.test(ec.url)) { ec.url = 'http://' + ec.url; }
        try {
          ec.domain = URL.parse(ec.url).hostname;
        } catch (err) {
          ec.domain = '';
        }
      }
    }
  };

  parser.parseDate = function (ec, opt) {
    const ignoreFormat = opt && opt.ignoreFormat;

    if (ec.timestamp || ec.epoch) {
      const date   = moment.unix(ec.timestamp || ec.epoch);
      ec.timestamp = ec.timestamp || ec.epoch;
      ec.datetime  = date.format();
      ec.date      = date.format('YYYY-MM-DD');
    } else if (ec.datetime) {
      const date   = moment(ec.datetime, ignoreFormat ? null : options.dateFormat);
      ec.datetime  = date.format();
      ec.timestamp = date.unix();
      ec.date      = date.format('YYYY-MM-DD');
    }
  };

  parser.getFields = function () {
    if (!extractor || !extractor.properties) {
      return false;
    }

    return extractor.properties.slice();
  };

  parser.getRegexp = function (literal) {
    if (!extractor || !extractor.regexp) { return null; }
    return literal ? extractor.regexp.toString() : extractor.regexp;
  };

  parser.getFormat = function () {
    return options.format || null;
  };

  parser.getDateFormat = function () {
    return options.dateFormat || null;
  };

  parser.getProxy = function () {
    return options.proxy || null;
  };

  parser.autoDetect = function () {
    return autoDetect;
  };

  return parser;
};
