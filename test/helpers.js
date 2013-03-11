/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var request = require('request');
var fs      = require('fs');
var config  = require('../config.json');

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

  if (filePath) {
    var fileContent = fs.readFileSync(filePath);
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
    if (property == 'date') {
      if (!object2[property] || Date.parse(object1[property]) != Date.parse(object2[property])) {
        same = false;
      }
    } else if (object1[property] !== object2[property]) {
      same = false;
      break;
    }
  }
  return same;
}

exports.compareArrays = function (array1, array2, showIfTrue) {
  if (array1.length !== array2.length) {
    if (showIfTrue) {
      console.error('array1:');
      console.error(array1);
      console.error('array2:');
      console.error(array2);
    }
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
  if (!same && showIfTrue) {
    console.error('array1:');
    console.error(array1);
    console.error('array2:');
    console.error(array2);
  }
  return same;
};