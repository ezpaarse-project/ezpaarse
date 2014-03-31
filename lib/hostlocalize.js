'use strict';

var dns   = require('dns');
var geoip = require('geoip-lite');

exports.resolve = function (host, cb) {
  if (host.match(/[ ,]/) !== null) {
    console.error("Error : malformed host string ", host);
    return;
  }
  dns.lookup(
    host,
    function (err, add, fam) {
      if (err) {
        console.error("Error : host ", host, " = ", JSON.stringify(err));
        return;
      }
      var geo = geoip.lookup(add);
      var r = {
        'geoip-host': host,
        'geoip-addr': add,
        'geoip-family': fam,
        'geoip-country': geo.country,
        'geoip-region': geo.region,
        'geoip-city': geo.city,
        'geoip-latitude': geo.ll[0],
        'geoip-longitude': geo.ll[1]
      };
      cb(r);
    });
};

