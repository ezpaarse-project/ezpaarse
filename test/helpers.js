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

exports.post = function (path, filePath, callback) {
  var opt = {
    method: 'POST',
    url: url + (path ? path : '/')
  };

  if (filePath) {
    var fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent) { opt.body = fileContent; }
  }
  
  request(opt, callback);
};

function objectsAreSame(object1, object2) {
  if (Object.keys(object1).length !== Object.keys(object2).length) {
    return false;
  }
  var objectsAreSame = true;
  for(var property in object1) {
    if(object1[property] !== object2[property]) {
      objectsAreSame = false;
      break;
    }
  }
  return objectsAreSame;
}

exports.compareArrays = function (array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  array1.forEach(function (object1) {
    var found = false;
    array2.forEach(function (object2) {
      if (objectsAreSame(object1, object2));
    });
    if (!found) {
      return false;
    }
  });
  return true;
}