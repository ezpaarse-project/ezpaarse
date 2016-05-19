'use strict';
var data  = require('./unitelogin.json');

module.exports = function (req, res, job) {
  return function filter(ec, next) {

    var prefix = '';

    if (ec && ec.login) {

      for (var i = 0; i< ec['login'].length; i++) {
        prefix = prefix + ec['login'].substr(i, 1);
        if (data[prefix]) {
          ec['OU'] = ec['login'].substr(i+1, ec['login'].length);
          break;
        }
      }
      if (/([\w\W]+)@([\w\W]+)/.test(ec['login'])) {
        ec['OU'] = ec['login'];
      }
    }

    next();
  };
};