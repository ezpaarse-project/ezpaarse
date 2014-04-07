'use strict';

var dns   = require('dns');
var geoip = require('geoip-lite');
var geoipFields = [
  'geoip-host',
  'geoip-addr',
  'geoip-family',
  'geoip-country',
  'geoip-region',
  'geoip-city',
  'geoip-latitude',
  'geoip-longitude'
];

// initialize fields content to nothing for CSV header
exports.init = function (r) {
  geoipFields.forEach(function (item) { r[item] = ''; });
};

// find geoloalization from IP
exports.resolve = function (host, cb) {
  var r = {}, match;
  this.init(r);
  if ((match = /([^ ,]+)/.exec(host)) !== null) {
    host = match[0];
  } else {
    console.error('Error : host ', host, ' unrecognized pattern');
    cb(r);
    return;
  }
  dns.lookup(
    host,
    function (err, add, fam) {
      if (err) {
        console.error("Error : host ", host, " = ", JSON.stringify(err));
        cb(r);
        return;
      }
      var geo = geoip.lookup(add);
      if (geo === null) {
        console.error("Error : address lookup failed ", add);
        cb(r);
        return;
      }
      r = {
        'geoip-host': host,
        'geoip-addr': add,
        'geoip-family': fam,
        'geoip-country': geo.country,
        'geoip-region': geo.region,
        'geoip-city': geo.city,
        'geoip-latitude': geo.ll[0].toString().replace('.', ','),
        'geoip-longitude': geo.ll[1].toString().replace('.', ',')
      };
      cb(r);
    });
};




