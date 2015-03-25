// ##EZPAARSE

/*jshint maxlen: 180*/
'use strict';

var bodyParser = require('body-parser');
var auth       = require('../lib/auth-middlewares.js');
var userlist   = require('../lib/userlist.js');
var passport   = require('passport');

module.exports = function (app) {

  /**
   * Retrieve current logged
   */
  app.get('/session', auth.ensureAuthenticated(false), function (req, res) {
    userlist.get(req.user.username, function (err, user) {
      if (err) { return res.status(500).end(); }
      res.status(200).json(user);
    });
  });

  /**
   * Login
   */
  app.post('/login', bodyParser.urlencoded({ extended: true }), bodyParser.json(),
    passport.authenticate('local'), function (req, res) {
    if (req.body.remember) {
      req.sessionCookies.maxAge = 15778462980; //6 months
    } else {
      req.sessionCookies.expires = false;
    }
    res.status(200).json(req.user);
  });

  /**
   * Logout
   */
  app.get('/logout', function (req, res) {
    req.logout();
    res.status(204).end();
  });
};