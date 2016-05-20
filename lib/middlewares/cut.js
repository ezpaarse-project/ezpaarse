'use strict';
var config        = require('../config.js');
var prefixLogin  = require('../../' + config.PREFIX_LOGIN);

module.exports = function (req, res, job) {
  var activated = (req.header('cut') || '').toLowerCase() === 'true';
  if (!activated) { return function (ec, next) { next(); }; }

  return function filter(ec, next) {

    var prefix = '';

    if (ec && ec.login) {

      for (var i = 0; i< ec['login'].length; i++) {
        prefix = prefix + ec['login'].substr(i, 1);
        if (prefixLogin[prefix.toUpperCase()] === prefix) {
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