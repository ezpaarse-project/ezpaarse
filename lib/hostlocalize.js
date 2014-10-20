'use strict';

var geoip = require('geoip-lite');
var cfg   = require('../config.json');

var geoipFields = [
  'geoip-host',
  'geoip-addr',
  'geoip-family',
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
  var r = {}, match;

  if (typeof job == 'function') { cb = job; job = null; }
  if (!job) { job = {}; }

  console.error(host);

  // handle specific proxy ip format ("IP1, IP2, ...")
  // only take the first (client IP)
  if (host && (match = /([^ ,]+)/.exec(host)) !== null) {
    var IPs = host.split(',');
    host = IPs[IPs.length-1].trim(); // take last address if many
  } else {
    cb(r);
    return false;
  }

  if (!host || !job.geolocalize) { return cb(r); }

console.error(host);

  // try to resolve IP using a GeoIp lookup
  var geo = geoip.lookup(host);
  if (geo === null) { return cb(r); }
  r = {
    'geoip-host': host,
    'geoip-country': geo.country,
    'geoip-region': geo.region,
    'geoip-city': geo.city,
    'geoip-latitude': geo.ll[0].toString().replace('.', geoipSeparator),
    'geoip-longitude': geo.ll[1].toString().replace('.', geoipSeparator),
    'geoip-coordinates': '[' + geo.ll.toString() + ']'
  };

  return cb(r);
};




