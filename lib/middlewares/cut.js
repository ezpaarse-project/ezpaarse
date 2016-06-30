/*eslint global-require: 0*/
'use strict';
var config        = require('../config.js');
var prefixexist =  false;
var prefixLogin  = '';
// test id file prefix login exist
try {
  prefixLogin = require('../../' + config.PREFIX_LOGIN);
  prefixexist =  true;
} catch (e) {
  prefixexist =  false;
}
/**
 * cut fields login
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function (req, res, job) {
  var activated = (req.header('cut') || '').toLowerCase() === 'true';
  var cutfields = req.header('cut-fields') || '';
  var regex = req.header('cut-regex') || '';
  var fieldsCreate = req.header('cut-fields-create') || '';
  if (!activated) { return function (ec, next) { next(); }; }

  // return function has a work to cut fields login and create new fields with result cutting
  return function cut(ec, next) {
    if (ec) {
      // check if file prefix exist
      if (ec.login) {
        if (prefixexist) {
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

      // cutting fields defined in header with a regex and put a value in new fields
      if (cutfields && regex && fieldsCreate) {
        var opfeilds = [];
        var regfields = new RegExp(regex);
        var match = '';
        if (ec[cutfields]) {
          if ((match = regfields.exec(ec[cutfields])) !== null) {
            var fields = fieldsCreate.split(',');

            for (var j = 0; j < fields.length; j++) {
              opfeilds[j] = fields[j];
              ec[fields[j]] = match[j + 1];
            }
          }
        }
        job.outputFields.added = opfeilds;
      }
    }

    next();
  };
};