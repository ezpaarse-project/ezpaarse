/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var request = require('request');
var fs      = require('fs');
var config  = require('../config.json');

var host    = '127.0.0.1';
var port    =  config.EZPAARSE_NODEJS_PORT;
var url     = 'http://' + host + ':' + port;
var headers  = { accept: 'application/json' }

exports.get = function (path, callback) {
  request({
      method: 'GET',
      url: url + (path ? path : '/')
    }, callback);
};

exports.post = function (path, filePath, callback) {
  var opt = {
    method: 'POST',
    url: url + (path ? path : '/'),
    headers: headers
  };

  if (filePath) {
    var fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent) { opt.body = fileContent; }
  }
  
  request(opt, callback);
};

exports.objectsAreSame = function (object1, object2) {
  if (Object.keys(object1).length !== Object.keys(object2).length) {
    return false;
  }
  var same = true;
  for (var property in object1) {
    if (object1[property] !== object2[property]) {
      same = false;
      break;
    }
  }
  return same;
}

exports.compareArrays = function (array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  var same = array1.every(function (object1) {
    var found = array2.some(function (object2) {
      if (exports.objectsAreSame(object1, object2)) {
        return true;
      } else {
        return false;
      }
    });
    return found;
  });
  return same;
};