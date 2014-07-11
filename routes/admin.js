'use strict';

var path       = require('path');
var crypto     = require('crypto');
var express    = require('express');
var pkbmanager = require('../lib/pkbmanager.js');
var execFile   = require('child_process').execFile;
var userlist   = require('../lib/userlist.js');
var auth       = require('../lib/auth-middlewares.js');

var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

module.exports = function (app) {

  /**
   * GET route on /users
   * To get the user list
   */
  app.get('/users', auth.ensureAuthenticated(true), function (req, res) {
    var users = userlist.getAll();
    res.set("Content-Type", "application/json; charset=utf-8");
    res.set("ezPAARSE-Logged-User", req.user.username);
    res.json(200, users);
  });

  /**
   * GET route on /usersnumber
   * To get the number of registered users
   */
  app.get('/usersnumber', function (req, res) {
    res.send(200, userlist.length().toString());
  });

  /**
   * POST route on /users
   * To add a user
   */
  app.post('/users/', express.bodyParser(), function (req, res) {
    var userid   = req.body.userid;
    var password = req.body.password;
    var confirm  = req.body.confirm;

    var sendErr = function (status, message) {
      res.writeHead(status, { 'ezPAARSE-Status-Message': message });
      res.end();
    };

    if (!userid || !password || !confirm) {
      sendErr(400, 'vous devez soumettre un login et un mot de passe');
      return;
    }

    // Regex used by angular
    if (!emailRegexp.test(userid)) {
      sendErr(400, 'cette adresse mail n\'est pas valide');
      return;
    }

    if (password != confirm) {
      sendErr(400, 'le mot de passe de confirmation ne correspond pas');
      return;
    }

    if (userlist.get(userid)) {
      sendErr(409, 'cet utilisateur existe');
      return;
    }

    var cryptedPassword = crypto.createHmac('sha1', 'ezgreatpwd0968')
    .update(userid + password)
    .digest('hex');

    var user = userlist.add({
      username: userid,
      password: cryptedPassword,
      group: userlist.length() === 0 ? 'admin' : 'user'
    });

    if (!user) {
      res.send(500);
      return;
    }

    var copyUser = {};
    for (var prop in user) {
      if (prop != 'password') { copyUser[prop] = user[prop]; }
    }

    if (req.user && req.user.group == 'admin') {
      //TODO: put that in a separate route
      res.set("Content-Type", "application/json; charset=utf-8");
      res.json(201, copyUser);
      return;
    }

    req.logIn(user, function (err) {
      if (err) {
        res.send(500);
        return;
      }
      res.set("Content-Type", "application/json; charset=utf-8");
      res.json(201, copyUser);
    });
  });

  /**
   * DELETE route on /users/{username}
   * To remove a user
   */
  app.delete(/^\/users\/(.+)$/, auth.ensureAuthenticated(true),
    auth.authorizeMembersOf('admin'), function (req, res) {
      var username = req.params[0];
      if (username == req.user.username) {
        res.set('ezPAARSE-Status-Message', 'vous ne pouvez pas vous supprimer vous-même');
        res.send(403);
      } else {
        var user = userlist.remove(username);
        if (user) {
          res.send(204);
        } else {
          res.set('ezPAARSE-Status-Message', 'cet utilisateur n\'existe pas');
          res.send(404);
        }
      }
    }
  );

  /**
   * GET route on /platforms/status
   * To know if there are incoming changes in the platforms directory
   */
  app.get('/platforms/status', auth.ensureAuthenticated(true), function (req, res) {
    var platformsFolder = path.join(__dirname, '../platforms');
    var gitscript = path.join(__dirname, '../bin/check-git-uptodate');

    execFile(gitscript, {cwd: platformsFolder}, function (error, stdout) {
      if (error || !stdout) {
        res.send(500);
        return;
      }
      res.send(200, stdout);
    });
  });

  /**
   * PUT route on /pkb/status
   * To update the PKB folder
   */
  app.put('/platforms/status', auth.ensureAuthenticated(true), auth.authorizeMembersOf('admin'),
    function (req, res) {
    var bodyString = '';

    req.on('readable', function () {
      bodyString += req.read() || '';
    });

    req.on('error', function () {
      res.send(500);
    });

    req.on('end', function () {
      if (bodyString.trim() == 'uptodate') {
        var platformsFolder = path.join(__dirname, '../platforms');
        var gitscript = path.join(__dirname, '../bin/git-update');

        execFile(gitscript, {cwd: platformsFolder}, function (error) {
          if (error) {
            res.send(500);
            return;
          }
          pkbmanager.clearCache();
          res.send(200);
        });
      } else {
        res.send(400);
      }
    });
  });
};
