'use strict';

var request = require('request');
var fs      = require('fs');
var moment  = require('moment');
var config  = require('../lib/config.js');

var host    = '127.0.0.1';
var port    =  config.EZPAARSE_NODEJS_PORT;
var url     = 'http://' + host + ':' + port;

exports.get = function (path, callback) {
  request({
      method: 'GET',
      url: url + (path ? path : '/')
    }, callback);
};

exports.post = function (path, filePath, headers, callback) {
  var opt = {
    method: 'POST',
    url: url + (path ? path : '/'),
  };

  if (headers) {
    opt.headers = headers;
  }

  if (fs.existsSync(filePath)) {
    var fileContent = fs.readFileSync(filePath);
    if (fileContent) { opt.body = fileContent; }
  } else {
    opt.body = filePath;
  }

  request(opt, callback);
};

exports.postPiped = function (path, headers, stream, callback) {
  var opt = {
    method: 'POST',
    url: url + (path ? path : '/'),
  };

  if (headers) {
    opt.headers = headers;
  }

  stream.pipe(request(opt, callback));
};

/**
 * Remove date and parse datetime into a timestamp, in order
 * to make ECs comparable in any locale
 * @param  {Object} ec  The EC to datify
 * @return {Object}     a datified EC
 */
exports.datify = function (ec) {
  if (ec.datetime) { ec.datetime = moment(ec.datetime).unix(); }
  delete ec.date;
  return ec;
};

/**
 * Deep comparison between two objects
 * @param  {Object} x
 * @param  {Object} y
 * @param  {Boolean} datify  if true, both objects will be datified (see function above)
 * @return {Boolean}
 */
exports.equals = function (x, y, datify) {
  if (datify) {
    x = exports.datify(x);
    y = exports.datify(y);
  }
  if (x === y) { return true; }
    // if both x and y are null or undefined and exactly the same
  if (!(x instanceof Object) || !(y instanceof Object)) { return false; }
    // if they are not strictly equal, they both need to be Objects
  if (x.constructor !== y.constructor) { return false; }
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

  for (var p in x) {
    if (!x.hasOwnProperty(p)) { continue; }
      // other properties were tested using x.constructor === y.constructor
    if (!y.hasOwnProperty(p)) { return false; }
      // allows to compare x[p] and y[p] when set to undefined
    if (x[p] === y[p]) { continue; }
      // if they have the same strict value or identity then they are equal
    if (typeof(x[p]) !== "object") { return false; }
      // Numbers, Strings, Functions, Booleans must be strictly equal
    if (!exports.equals(x[p], y[p], datify)) { return false; }
      // Objects and Arrays must be tested recursively
  }

  for (p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) { return false; }
      // allows x[p] to be set to undefined
  }
  return true;
};