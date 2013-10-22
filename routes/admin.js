'use strict';

var path        = require('path');
var crypto      = require('crypto');
var execFile    = require('child_process').execFile;
var passport    = require('passport');
var querystring = require('querystring');
var userlist    = require('../lib/userlist.js');

module.exports = function (app) {

  /**
   * GET route on /
   */
  app.get('/admin', passport.authenticate('basic', { session: true }),
    userlist.authorizeMembersOf('admin'), function (req, res) {
      res.render('admin', {
        title: 'ezPAARSE - Web service',
        user: req.user
      });
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

      if (userlist.length() !== 0) {
        res.writeHead(400, {
          'ezPAARSE-Status-Message': 'un compte administrateur existe'
        });
        res.end();
        return;
      }

      var cryptedPassword = crypto.createHmac('sha1', 'ezgreatpwd0968')
      .update(username + password)
      .digest('hex');

      var added = userlist.add({
        username: username,
        password: cryptedPassword,
        group: 'admin'
      });

      if (added) {
        res.send(201);
      } else {
        res.send(500);
      }
    });
  });

  /**
   * GET route on /users
   * To get the user list
   */
  app.get('/users', passport.authenticate('basic', { session: true }), function (req, res) {
      var users = userlist.getAll();
      res.set("Content-Type", "application/json; charset=utf-8");
      res.set("ezPAARSE-Logged-User", req.user.username);
      res.send(200, JSON.stringify(users));
    }
  );

  /**
   * POST route on /users
   * To add a user
   */
  app.post('/users/', passport.authenticate('basic', { session: true }),
    userlist.authorizeMembersOf('admin'), function (req, res) {
      var bodyString = '';

      req.on('readable', function () {
        bodyString += req.read() || '';
      });

      req.on('error', function () {
        res.send(500);
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

        if (userlist.get(username)) {
          res.writeHead(409, {
            'ezPAARSE-Status-Message': 'cet utilisateur existe'
          });
          res.end();
          return;
        }

        var cryptedPassword = crypto.createHmac('sha1', 'ezgreatpwd0968')
        .update(username + password)
        .digest('hex');


        var user = userlist.add({
          username: username,
          password: cryptedPassword,
          group: 'user'
        });

        if (user) {
          var copyUser = {};
          for (var prop in user) {
            if (prop != 'password') { copyUser[prop] = user[prop]; }
          }
          res.set("Content-Type", "application/json; charset=utf-8");
          res.send(201, JSON.stringify(copyUser, null, 2));
        } else {
          res.send(500);
        }
      });
    }
  );

  /**
   * DELETE route on /users/{username}
   * To remove a user
   */
  app.delete(/^\/users\/([a-zA-Z0-9\-_]+)$/, passport.authenticate('basic', { session: true }),
    userlist.authorizeMembersOf('admin'), function (req, res) {
      var username = req.params[0];
      if (username == req.user.username) {
        res.set('ezPAARSE-Status-Message', 'vous ne pouvez pas vous supprimer vous-même');
        res.send(403);
      } else {
        var user = userlist.remove(username);
        if (user) {
          res.send(204);
        } else {
          res.send(404);
        }
      }
    }
  );

  /**
   * GET route on /pkb/status
   * To know if there are incoming changes in the PKB folder
   */
  app.get('/pkb/status', passport.authenticate('basic', { session: true }), function (req, res) {
    var pkbFolder = path.join(__dirname, '../platforms-kb');
    var gitscript = path.join(__dirname, '../bin/check-git-uptodate');

    execFile(gitscript, {cwd: pkbFolder}, function (error, stdout) {
      if (error || !stdout) {
        res.send(500);
        return;
      }
      res.send(200, stdout);
    });
  });

  function updatePkb(req, res) {
    var bodyString = '';

    req.on('readable', function () {
      bodyString += req.read() || '';
    });

    req.on('error', function () {
      res.send(500);
    });

    req.on('end', function () {
      if (bodyString.trim() == 'uptodate') {
        var pkbFolder = path.join(__dirname, '../platforms-kb');
        var gitscript = path.join(__dirname, '../bin/git-update');

        execFile(gitscript, {cwd: pkbFolder}, function (error) {
          if (error) {
            res.send(500);
            return;
          }
          res.send(200);
        });
      } else {
        res.send(400);
      }
    });
  }

  /**
   * PUT route on /pkb/status
   * To update the PKB folder
   */
  app.put('/pkb/status', passport.authenticate('basic', { session: true }),
    userlist.authorizeMembersOf('admin'), updatePkb);

  /**
   * GET route on /parsers/status
   * To know if there are incoming changes in the parsers folder
   */
  app.get('/parsers/status', passport.authenticate('basic', { session: true }),
    function (req, res) {
    var parsersFolder = path.join(__dirname, '../platforms-parsers');
    var gitscript = path.join(__dirname, '../bin/check-git-uptodate');

    execFile(gitscript, {cwd: parsersFolder}, function (error, stdout) {
      if (error || !stdout) {
        res.send(500);
        return;
      }
      res.send(200, stdout);
    });
  });

  function updateParsers(req, res) {
    var bodyString = '';

    req.on('readable', function () {
      bodyString += req.read() || '';
    });

    req.on('error', function () {
      res.send(500);
    });

    req.on('end', function () {
      if (bodyString.trim() == 'uptodate') {
        var parsersFolder = path.join(__dirname, '../platforms-parsers');
        var gitscript = path.join(__dirname, '../bin/git-update');

        execFile(gitscript, {cwd: parsersFolder}, function (error) {
          if (error) {
            res.send(500);
            return;
          }
          res.send(200);
        });
      } else {
        res.send(400);
      }
    });
  }

  /**
   * PUT route on /parsers/status
   * To update the parsers folder
   */
  app.put('/parsers/status', passport.authenticate('basic', { session: true }),
    userlist.authorizeMembersOf('admin'), updateParsers);
};
