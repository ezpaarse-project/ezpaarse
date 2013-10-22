'use strict';

/**
 * Convert a string into milliseconds
 * Look for integers/floats followed by a unit, it's pretty permissive
 * Ex: 4h20m10s
 *     2 days and 12 hours
 *     0.5 hour, 25 minutes
 * @param  {String} str
 * @return {Number} ms
 */
module.exports = function toMs(str) {
  if (typeof str != 'string') { return str; }
  if (/^[0-9]+$/.test(str))   { return parseInt(str, 10); }

  var ms  = 0;
  var reg = /([0-9]+(?:\.[0-9]+)?)[ ]*?([a-z]+)/gi;
  var match;
  var multi;

  var s = 1000;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;

  match = reg.exec(str);
  while (match) {
    switch (match[2].toLowerCase()) {
    case "s":
    case "sec":
    case "second":
    case "seconds":
      multi = s;
      break;
    case "m":
    case "min":
    case "minute":
    case "minutes":
      multi = m;
      break;
    case "h":
    case "hour":
    case "hours":
      multi = h;
      break;
    case "d":
    case "day":
    case "days":
      multi = d;
      break;
    default:
      multi = 0;
    }
    ms += parseFloat(match[1]) * multi;
    match = reg.exec(str);
  }
  return Math.floor(ms);
};