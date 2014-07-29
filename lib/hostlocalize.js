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

  var logger = (job ? job.logger : null);
  var type = (job ? job.geolocalize : 'geoip-lookup');

  // handle specific proxy ip format ("IP1, IP2, ...")
  // only take the first (client IP)
  if ((match = /([^ ,]+)/.exec(host)) !== null) {
    host = match[0]; // take first address if many
  } else {
    if (logger) {
      logger.silly('Error : host ' + host + ' unrecognized pattern');
    } else {
      console.error('Error : host ', host, ' unrecognized pattern');
    }
    cb(r);
    return false;
  }

  if (type === 'dns-lookup') {
    // try to resolve IP using a DNS lookup (warning this is very slow !)
    dns.lookup(
      host,
      function (err, add, fam) {
        if (err) {
          if (logger) {
            logger.silly("Error : host " + host + " = " + JSON.stringify(err));
          } else {
            console.error("Error : host ", host, " = ", JSON.stringify(err));
          }
          cb(r);
          return;
        }
        var geo = geoip.lookup(add);
        if (geo === null) {
          if (logger) {
            logger.silly("Error : dns address lookup failed " + add);
          } else {
            console.error("Error : dns address lookup failed ", add);
          }
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
          'geoip-latitude': geo.ll[0].toString().replace('.', geoipSeparator),
          'geoip-longitude': geo.ll[1].toString().replace('.', geoipSeparator),
          'geoip-coordinates': '[' + geo.ll.toString() + ']'
        };
        cb(r);
      }
    );

    return true;
  } else if (type === 'geoip-lookup') {
    // try to resolve IP using a GeoIp lookup
    var geo = geoip.lookup(host);
    if (geo === null) {
      if (logger) {
        logger.silly("Error : geoip address lookup failed ", host);
      } else {
        console.error("Error : geoip address lookup failed ", host);
      }
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
    console.error("Error : lookup type ", type, " unknown (should be dns-lookup or geoip-lookup)");
    cb(r);
    return false;
  }
};




