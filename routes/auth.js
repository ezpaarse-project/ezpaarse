// ##EZPAARSE

/*jshint maxlen: 180*/
'use strict';

var bodyParser = require('body-parser');
var auth       = require('../lib/auth-middlewares.js');
var passport   = require('passport');

module.exports = function (app) {

  /**
   * Retrieve current session
   */
  app.get('/session', auth.ensureAuthenticated(false), function (req, res) {
    res.json(200, req.user);
  });

  /**
   * Login
   */
  app.post('/login', bodyParser.urlencoded({ extended: true }), bodyParser.json(),
    passport.authenticate('local'), function (req, res) {
    if (req.body.remember) {
      req.session.cookie.maxAge = 15778462980; //6 months
    } else {
      req.session.cookie.expires = false;
    }
    res.json(200, req.user);
  });

  /**
   * Logout
   */
  app.get('/logout', function (req, res) {
    req.logout();
    res.send(204);
  });
};