// ##EZPAARSE

/*jshint maxlen: 180*/
'use strict';

var express  = require('express');
var auth     = require('../lib/auth-middlewares.js');
var passport = require('passport');

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
  app.post('/login', express.bodyParser(), passport.authenticate('local'), function (req, res) {
    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 3;
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