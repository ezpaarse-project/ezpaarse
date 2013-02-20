/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs      = require('fs');
var URL     = require('url');
var moment  = require('moment');

/*
* this object parses a line using available formats
*/
module.exports = function (logFormat, formatHeader, dateFormat) {
  var that          = this;
  that.separator    = ' ';
  that.customFormat = false;

  if (logFormat) {
    that.customFormat = true;
    switch(formatHeader) {
      case 'LogFormat-ezproxy':
        that.format = require('./proxyformats/ezproxy.js')(logFormat);
        break;
      case 'LogFormat-bibliopam':
        that.format = require('./proxyformats/apache.js')(logFormat);
        break;
      case 'LogFormat-squid':
        that.format = require('./proxyformats/squid.js')(logFormat);
        break;
    }
    that.format.dateFormat  = dateFormat  || 'DD/MMM/YYYY:HH:mm:ss Z';
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
    if (ec.url)   { ec.domain = URL.parse(ec.url).hostname; }
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
        format.dateFormat  = format.dateFormat  || 'DD/MMM/YYYY:HH:mm:ss Z';
        that.format = format;
        break;
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
        ec = that.lookInFiles(line);
      }
    }
    return ec;
  };
};