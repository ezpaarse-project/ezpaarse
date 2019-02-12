// ##EZPAARSE

'use strict';

var bodyParser = require('body-parser');
var auth       = require('../lib/auth-middlewares.js');
var userlist   = require('../lib/userlist.js');
var passport   = require('passport');

var { Router } = require('express');
var app = Router();

/**
 * Retrieve current logged
 */
app.get('/session', auth.ensureAuthenticated(false), function (req, res, next) {
  userlist.get(req.user.username, function (err, user) {
    if (err) { return res.status(500).end(); }
    res.status(200).json({
      _id: user._id,
      username: user.username,
      group: user.group,
      createdAt: user.createdAt,
      notifiate: user.notifiate || false
    });
  });
});

/**
 * Login
 */
app.post('/login', bodyParser.urlencoded({ extended: true }), bodyParser.json(),
  passport.authenticate('local'), function (req, res, net) {
    if (req.body.remember) {
      req.sessionCookies.maxAge = 15778462980; //6 months
    } else {
      req.sessionCookies.expires = false;
    }
    res.status(200).json({
      _id: req.user._id,
      username: req.user.username,
      group: req.user.group,
      createdAt: req.user.createdAt,
      notifiate: false
    });
  }
);

/**
 * Logout
 */
app.get('/logout', function (req, res, next) {
  req.logout();
  res.status(204).end();
});

module.exports = app;