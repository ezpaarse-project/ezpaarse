/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs      = require('fs');
var URL     = require('url');
var moment  = require('moment');

/*
* this object parses a line using available formats
*/
module.exports = function (logFormat, dateFormat, replacer) {
  var that          = this;
  that.separator    = ' ';
  that.customFormat = false;

  if (logFormat) {
    that.customFormat = true;
    var param         = logFormat.split(' ');
    var properties    = {};
    var parameters    = {
      '%h': {regex: /^([a-zA-Z0-9\., ]+)$/,       property: 'host'},
      '%u': {regex: /^([a-zA-Z0-9@\.\-_]+)$/,     property: 'login'},
      '%l': {regex: /^-$/,                        property: 'remoteUsername'},
      '%b': {regex: /^([0-9]+)$/,                 property: 'size'},
      '%U': {regex: /^([^ ]+)$/,                  property: 'url'},
      '%m': {regex: /^([A-Z]+)$/,                 property: 'method'},
      '%r': {regex: /^\"[A-Z]+ ([^ ]+) [^ ]+\"$/, property: 'url'},
      '%t': {regex: /^\[([^\]]+)\]$/,             property: 'date'},
      '%s': {regex: /^([0-9]+)$/,                 property: 'status'}
    }

    for (var i=0, l=param.length; i<l; i++) {
      var parameter = parameters[param[i]];
      if (parameter) {
        properties[parameter.property] = parameter.regex;
      } else {
        properties = {};
        break;
      }
    }
    
    if (Object.keys(properties).length > 0) {
      that.format             = {};
      that.format.properties  = properties;
      that.format.dateFormat  = dateFormat  || 'DD/MMM/YYYY:HH:mm:ss Z';
      that.format.replacer    = replacer    || '-';
    }
  }

  that.extract = function (log, format) {
    var ec          = false;
    var keys        = Object.keys(format.properties);
    
    if (keys.length === log.length) {
      ec = {};
      var match;
      for (var i = 0, l = keys.length; i < l; i++) {
        var property  = keys[i];
        var regex     = format.properties[property];
        var logPart   = log[i];
        if (logPart == (format.replacer)) {
          continue;
        }
        match = regex.exec(logPart);
        if (match) {
          ec[property] = match[1];
        } else {
          return false;
        }
      }
      if (ec.url)   { ec.domain = URL.parse(ec.url).hostname; }
      if (ec.date)  { ec.date = moment(ec.date, format.dateFormat).format(); }
    }
    return ec;
  }

  that.lookInFiles = function (log) {
    var ec    = false;
    var files = fs.readdirSync(__dirname + '/logformats');
    var format;
    for (var i = 0, l = files.length; i < l; i++) {
      format = require('./logformats/' + files[i]);
      if (!format.properties) { continue; }

      ec = that.extract(log, format);
      if (ec) {
        format.dateFormat  = format.dateFormat  || 'DD/MMM/YYYY:HH:mm:ss Z';
        format.replacer    = format.replacer    || '-';
        that.format = format;
        break;
      }
    }
    return ec;
  }

  that.splitLine = function (line) {
    var log = line.trim().split(that.separator);

    for (var i = 0, l = log.length; i < l; i++) {
      if (/^[\["]/.test(log[i])) {
        var j = i;
        while(log[++j]) {
          log[i] += ' ' + log[j];
          if (/[\]"]$/.test(log[j])) { break; }
        }
        log.splice(i+1, j-i);
      }
    }
    return log;
  }

  that.parse = function (line) {
    var ec  = false;
    if (line != '') {
      var log = that.splitLine(line);

      if (that.format) {
        ec = that.extract(log, that.format);
      } else if (!that.customFormat) {
        ec = that.lookInFiles(log);
      }
    }
    return ec;
  };
};