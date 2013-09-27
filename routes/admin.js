'use strict';

var fs          = require('fs');
var path        = require('path');
var crypto      = require('crypto');
var execFile    = require('child_process').execFile;
var passport    = require('passport');
var querystring = require('querystring');

module.exports = function (app) {
  
  /**
   * GET route on /
   */
  app.get('/admin', passport.authenticate('basic', { session: true }), function (req, res) {
    res.render('admin', { title: 'ezPAARSE - Web service', user: req.user });
  });

  /**
   * POST route on /register
   * To create an admin if there is none
   */
  app.post('/register', function (req, res) {
    var bodyString = '';

    req.on('readable', function () {
      bodyString += req.read() || '';
    });

    req.on('end', function () {
      var body     = querystring.parse(bodyString);
      var username = body.username;
      var password = body.password;

      if (!username || !password) {
        res.writeHead(400, {
          'ezPAARSE-Status-Message': 'vous devez soumettre un login et un mot de passe'
        });
        res.end();
        return;
      }
      var credentialsFile = path.join(__dirname, '../credentials.json');
      var users;
      if (fs.existsSync(credentialsFile)) {
        users = JSON.parse(fs.readFileSync(credentialsFile));
      }
      if (users && Object.keys(users).length) {
        res.writeHead(400, {
          'ezPAARSE-Status-Message': 'un compte administrateur existe'
        });
        res.end();
        return;
      }
      users = {};

      var cryptedPassword = crypto.createHmac('sha1', 'ezgreatpwd0968')
      .update(username + password)
      .digest('hex');
      
      users[username] = cryptedPassword;

      fs.writeFile(credentialsFile, JSON.stringify(users), function (err) {
        if (err) {
          res.send(500);
          return;
        }
        res.send(204);
      });
    });
  });

  /**
   * GET route on /users
   * To get the user list
   */
  app.get('/users', passport.authenticate('basic', { session: true }), function (req, res) {
    var credentialsFile = path.join(__dirname, '../credentials.json');
    var credentials;
    if (fs.existsSync(credentialsFile)) {
      credentials = JSON.parse(fs.readFileSync(credentialsFile));
    }
    credentials = credentials || {};
    var users = [];
    for (var id in credentials) {
      users.push(id);
    }
    res.send(200, JSON.stringify(users));
  });

  /**
   * POST route on /users
   * To add a user
   */
  app.post('/users/', passport.authenticate('basic', { session: true }), function (req, res) {
    var bodyString = '';

    req.on('readable', function () {
      bodyString += req.read() || '';
    });

    req.on('end', function () {
      var body     = querystring.parse(bodyString);
      var username = body.username;
      var password = body.password;

      if (!username || !password) {
        res.writeHead(400, {
          'ezPAARSE-Status-Message': 'vous devez soumettre un login et un mot de passe'
        });
        res.end();
        return;
      }
      var credentialsFile = path.join(__dirname, '../credentials.json');
      var users;
      if (fs.existsSync(credentialsFile)) {
        users = JSON.parse(fs.readFileSync(credentialsFile));
      }
      users = users || {};
      if (users[username]) {
        res.writeHead(409, {
          'ezPAARSE-Status-Message': 'cet utilisateur existe'
        });
        res.end();
        return;
      }

      var cryptedPassword = crypto.createHmac('sha1', 'ezgreatpwd0968')
      .update(username + password)
      .digest('hex');

      users[username] = cryptedPassword;
      fs.writeFile(credentialsFile, JSON.stringify(users), function (err) {
        if (err) {
          res.send(500);
          return;
        }
        res.send(204);
      });
    });
  });

  /**
   * GET route on /pkb/status
   * To know if there are incoming changes in the PKB folder
   */
  app.get('/pkb/status', passport.authenticate('basic', { session: true }), function (req, res) {
    var pkbFolder = path.join(__dirname, '../platforms-kb');
    var gitscript = path.join(__dirname, '../bin/check-incoming-commits');

    execFile(gitscript, {cwd: pkbFolder}, function (error, stdout) {
      if (error || !stdout) {
        res.send(500);
        return;
      }
      res.send(200, stdout);
    });
  });
};
