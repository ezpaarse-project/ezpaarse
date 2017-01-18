'use strict';

var geoip = require('geoip-lite');
var cfg   = require('../config.json');

var geoipFields = [
  'geoip-host',
  'geoip-country',
  'geoip-region',
  'geoip-city',
  'geoip-latitude',
  'geoip-longitude',
  'geoip-coordinates'
];

var geoipDefaultFields = [
  'geoip-country',
  'geoip-latitude',
  'geoip-longitude'
];

var geoipSeparator = cfg.EZPAARSE_GEOLOCALIZE_SEPARATOR;

exports.geoipFields = geoipFields;
exports.geoipDefaultFields = geoipDefaultFields;

// find geoloalization from IP
exports.resolve = function (host, job, cb) {
  var r = {};

  if (typeof job == 'function') { cb = job; job = null; }
  if (!job) { job = {}; }

  if (host) {
    host = host.trim();
  } else {
    return cb(r);
  }

  // if IP chain, take the last one (client IP)
  var lastComma = host.lastIndexOf(',');
  if (lastComma >= 0) {
    host = host.substr(lastComma);
  }

  // try to resolve IP using a GeoIp lookup
  var geo = geoip.lookup(host);

  if (geo !== null) {
    r = {
      'geoip-host': host,
      'geoip-country': geo.country,
      'geoip-region': geo.region,
      'geoip-city': geo.city,
      'geoip-latitude': geo.ll[0].toString().replace('.', geoipSeparator),
      'geoip-longitude': geo.ll[1].toString().replace('.', geoipSeparator),
      'geoip-coordinates': '[' + geo.ll.toString() + ']'
    };
  }

  return cb(r);
};




