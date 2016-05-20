'use strict';
var config        = require('../config.js');
var prefixexsit =  false;
var prefixLogin  = '';
// test id file prefix login exist
try {
  prefixLogin = require('../../' + config.PREFIX_LOGIN);
  prefixexsit =  true;
} catch (e) {
  prefixexsit =  false;
}
/**
 * cut feilds login
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function (req, res, job) {
  var activated = (req.header('cut') || '').toLowerCase() === 'true';
  if (!activated) { return function (ec, next) { next(); }; }
  // return function has a work to cut fields login and create new fields with result cutting
  return function cut(ec, next) {


    var prefix = '';

    if (ec && ec.login) {
      // check if file prefix exist
      if (prefixexsit) {
        for (var i = 0; i< ec['login'].length; i++) {
          prefix = prefix + ec['login'].substr(i, 1);
          if (prefixLogin[prefix.toUpperCase()] === prefix) {
            ec['OU'] = ec['login'].substr(i+1, ec['login'].length);
            break;
          }
        }
      }
      // check if login is a mail regulèrie  expression
      if (/([\w\W]+)@([\w\W]+)/.test(ec['login'])) {
        ec['OU'] = ec['login'];
      }
    }

    next();
  };
};