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
  var feildscut = req.header('feildscut') || '';
  var exp_reg_feilds = req.header('exp_reg_feilds') || '';
  var feilds_creat = req.header('feilds_creat') || '';
  if (!activated) { return function (ec, next) { next(); }; }

  // return function has a work to cut fields login and create new fields with result cutting
  return function cut(ec, next) {
    if (ec) {
      // check if file prefix exist
      if (ec.login) {
        if (prefixexsit) {
          var prefix = '';
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

      // cutting feilds defined in header with a regex and put a value in new feilds
      if (feildscut && exp_reg_feilds && feilds_creat) {
        var regfeilds = new RegExp(exp_reg_feilds);
        var match = '';
        if (ec[feildscut]) {
          if ((match = regfeilds.exec(ec[feildscut])) !== null) {
            var feilds = feilds_creat.split(',');
            for (var j = 0; j < feilds.length; j++) {
              ec[feilds[j]] = match[j + 1];
            }
          }
        }
      }
    }

    next();
  };
};