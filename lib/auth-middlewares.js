'use strict';

/**
 * Middlewares for authentication
 */

var crypto   = require('crypto');
var passport = require('passport');
var userlist = require('./userlist.js');

/**
 * middleware to authorize members of one or more groups
 * @param  {String|Array}  authorizedGroups  an authorized group or an array of groups
 */
exports.authorizeMembersOf = function (authorizedGroups) {
  if (typeof authorizedGroups == 'string') {
    authorizedGroups = [authorizedGroups];
  }
  return function (req, res, next) {
    if (req.user && (authorizedGroups.indexOf(req.user.group) != -1)) {
      next();
    } else {
      res.send(401);
    }
  };
};

/**
 * middleware to ensure a user is authenticated
 * can try a basic auth if it's not the case
 */
exports.ensureAuthenticated = function (tryBasic) {
  return function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }

    if (tryBasic) { passport.authenticate('basic')(req, res, next); }
    else { res.send(401); }
  };
};

/**
 * middleware used by passport for basic/local authentication
 */
exports.login = function (userid, password, done) {
  var user = userlist.get(userid);
  var cryptedPassword = crypto.createHmac('sha1', 'ezgreatpwd0968')
  .update(userid + password)
  .digest('hex');

  if (user && user.password == cryptedPassword) {
    return done(null, user);
  } else {
    return done(null, false);
  }
};