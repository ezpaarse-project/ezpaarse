/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var options = require('./options.js');
var request = require('request');
var fs = require('fs');

exports.get = function (path, callback) {
  var url = options.url + (path ? path : '/');
  request({
      method: 'GET',
      url: url
    }, callback);
};

exports.post = function (path, filePath, callback) {
  var opt = {
    method: 'POST',
    url: options.url + (path ? path : '/')
  };

  if (filePath) {
    var fileContent = fs.readFileSync(filePath);
    if (fileContent) { opt.body = fileContent; }
  }
  
  request(opt, callback);
};