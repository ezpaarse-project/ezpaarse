/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs      = require('fs');
var URL     = require('url');
var moment  = require('moment');

/*
* this object parses a line using available formats
*/
module.exports = function (format) {
  var that     = this;
  that.files   = fs.readdirSync(__dirname + '/logformats');
  that.cache   = require('./logformats/default.js');
  that.format  = that.cache[0];

  that.extract = function (line, format) {
    var ec = false;
    var match;
    match = format.exp.exec(line);
    if (match) {
      ec = {};
      format.properties.forEach(function (property, index) {
        ec[property] = match[index + 1];
      });
      if (ec.url)   { ec.domain = URL.parse(ec.url).hostname; }
      if (ec.date)  { ec.date = moment(ec.date, format.dateFormat).format(); }
    }
    return ec;
  }

  that.lookInCache = function (line) {
    var ec = false;
    var format;
    for (var i = 0, l = that.cache.length; i < l; i++) {
      format = that.cache[i];
      ec = that.extract(line, format);
      if (ec) {
        that.format = format;
        break;
      }
    }
    return ec;
  }

  that.lookInFiles = function (line) {
    var ec = false;
    var cache = that.cache;
    var file;
    for (var i = 0, l = that.files.length; i < l; i++) {
      file = that.files[i];
      that.cache = require('./logformats/' + that.files[i]);
      ec = that.lookInCache(line);
      if (ec) { break; }
    }
    if (!ec) { that.cache = cache; }
    return ec;
  }

  that.parse = function (line) {
    var ec = false;
    if (that.format)  { that.extract(line, that.format); }
    if (!ec)          { ec = that.lookInCache(line); }
    if (!ec)          { ec = that.lookInFiles(line); }
    return ec;
  };
};