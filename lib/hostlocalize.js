'use strict';

var dns   = require('dns');
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

// initialize fields content to empty values for CSV header
exports.init = function (r) {
  geoipFields.forEach(function (item) { r[item] = ''; });
};

// find geoloalization from IP
exports.resolve = function (host, job, cb) {
  var r = {}, match;
  this.init(r); // init the results fields

  if (!job) { job = function () {}; }
  if (typeof job == 'function') { cb = job; job = null; }

  var type = (job ? job.geolocalize : 'geoip-lookup');

  // handle specific proxy ip format ("IP1, IP2, ...")
  // only take the first (client IP)
  if (host && (match = /([^ ,]+)/.exec(host)) !== null) {
    host = match[0]; // take first address if many
  } else {
    cb(r);
    return false;
  }

  if (!host) { return cb(r); } // skip undefined host

  if (type === 'dns-lookup') {
    // try to resolve IP using a DNS lookup (warning this is very slow !)
    // 

    try {
      dns.reverse(
        host,
        function (err, domains) {
          if (err) {
            job.logger.verbose('DNS reverse error 1 : ' + err);
            cb(r);
            return;
          }
          var add = (domains && domains.length > 0) ? domains[0] : '' ; 
          var geo = geoip.lookup(host);
          if (geo === null) {
            cb(r);
            return;
          }
          r = {
            'geoip-host': host,
            'geoip-addr': add,
            'geoip-country': geo.country,
            'geoip-region': geo.region,
            'geoip-city': geo.city,
            'geoip-latitude': geo.ll[0].toString().replace('.', geoipSeparator),
            'geoip-longitude': geo.ll[1].toString().replace('.', geoipSeparator),
            'geoip-coordinates': '[' + geo.ll.toString() + ']'
          };
          cb(r);
        }
      );
    } catch (err) {
      job.logger.info('DNS reverse error 2 : ' + err);
      cb(r);
      return true;
    }
    return true;
  } else if (type === 'geoip-lookup') {
    // try to resolve IP using a GeoIp lookup
    var geo = geoip.lookup(host);
    if (geo === null) {
      cb(r);
      return false;
    }
    r = {
      'geoip-host': host,
      'geoip-country': geo.country,
      'geoip-region': geo.region,
      'geoip-city': geo.city,
      'geoip-latitude': geo.ll[0].toString().replace('.', geoipSeparator),
      'geoip-longitude': geo.ll[1].toString().replace('.', geoipSeparator),
      'geoip-coordinates': '[' + geo.ll.toString() + ']'
    };
    cb(r);
    return false;
  } else {
    job.logger.error("Error : lookup type ", type, 
     " unknown (should be dns-lookup or geoip-lookup)");
    cb(r);
    return false;
  }
};




