'use strict';

const bodyParser = require('body-parser');
const auth       = require('../lib/auth-middlewares.js');
const passport   = require('passport');

const { Router } = require('express');
const app = Router();

/**
 * Retrieve current logged
 */
app.get('/session', auth.ensureAuthenticated(false), function (req, res, next) {
  res.status(200).json({
    _id: req.user._id,
    username: req.user.username,
    group: req.user.group,
    createdAt: req.user.createdAt,
    notifiate: req.user.notifiate || false
  });
});

/**
 * Login
 */
app.post('/login', bodyParser.urlencoded({ extended: true }), bodyParser.json(),
  passport.authenticate('local'), function (req, res) {
    if (req.body.remember) {
      req.session.cookie.maxAge = 15778462980; // 6 months
    } else {
      req.session.cookie.expires = false;
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
app.post('/logout', function (req, res, next) {
  // passport >= 0.6 requires a callback, otherwise req.logout() throws
  req.logout(function (err) {
    if (err) { return next(err); }
    res.status(204).end();
  });
});

module.exports = app;