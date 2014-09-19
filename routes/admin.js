'use strict';

var path       = require('path');
var crypto     = require('crypto');
var bodyParser = require('body-parser');
var pkbmanager = require('../lib/pkbmanager.js');
var parserlist = require('../lib/parserlist.js');
var execFile   = require('child_process').execFile;
var userlist   = require('../lib/userlist.js');
var auth       = require('../lib/auth-middlewares.js');

var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

module.exports = function (app) {

  /**
   * GET route on /app/status
   * To know if there are incoming changes
   */
  app.get('/app/status', auth.ensureAuthenticated(true), function (req, res) {
    var gitscript = path.join(__dirname, '../bin/git-status');

    var args = [];

    if (req.query.ref !== 'latest') { args.push('--tag'); }

    execFile(gitscript, args, { cwd: __dirname }, function (error, stdout) {
      if (error || !stdout) {
        res.status(500).end();
        return;
      }
      res.status(200).send(stdout);
    });
  });

  /**
   * Auto-update
   */
  app.put('/app/status', auth.ensureAuthenticated(true), auth.authorizeMembersOf('admin'),
    function (req, res) {

    var args = [];

    if (req.query.version === 'latest') { args.push('--latest'); }
    if (req.query.force == 'yes')       { args.push('--force'); }
    if (req.query.rebuild !== 'no')     { args.push('--rebuild'); }

    res.status(200).end();
    execFile('../lib/bin/update-app.js', args, { cwd: __dirname });
  });

  /**
   * GET route on /users
   * To get the user list
   */
  app.get('/users', auth.ensureAuthenticated(true), function (req, res) {
    var users = userlist.getAll();
    res.set("Content-Type", "application/json; charset=utf-8");
    res.set("ezPAARSE-Logged-User", req.user.username);
    res.status(200).json(users);
  });

  /**
   * GET route on /usersnumber
   * To get the number of registered users
   */
  app.get('/usersnumber', function (req, res) {
    res.status(200).send(userlist.length().toString());
  });

  /**
   * POST route on /users
   * To add a user
   */
  app.post('/users/', bodyParser.urlencoded({ extended: true }), bodyParser.json(),
    function (req, res) {
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
      res.status(500).end();
      return;
    }

    var copyUser = {};
    for (var prop in user) {
      if (prop != 'password') { copyUser[prop] = user[prop]; }
    }

    if (req.user && req.user.group == 'admin') {
      //TODO: put that in a separate route
      res.set("Content-Type", "application/json; charset=utf-8");
      res.status(201).json(copyUser);
      return;
    }

    req.logIn(user, function (err) {
      if (err) {
        res.status(500).end();
        return;
      }
      res.set("Content-Type", "application/json; charset=utf-8");
      res.status(201).json(copyUser);
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
        res.status(403).end();
      } else {
        var user = userlist.remove(username);
        if (user) {
          res.status(204).end();
        } else {
          res.set('ezPAARSE-Status-Message', 'cet utilisateur n\'existe pas');
          res.status(404).end();
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
    var gitscript = path.join(__dirname, '../bin/git-status');

    execFile(gitscript, {cwd: platformsFolder}, function (error, stdout) {
      if (error || !stdout) {
        res.status(500).end();
        return;
      }
      res.status(200).send(stdout);
    });
  });

  /**
   * PUT route on /pkb/status
   * To update the platforms folder
   */
  app.put('/platforms/status', auth.ensureAuthenticated(true), auth.authorizeMembersOf('admin'),
    function (req, res) {
    var bodyString = '';

    req.on('readable', function () {
      bodyString += req.read() || '';
    });

    req.on('error', function () {
      res.status(500).end();
    });

    req.on('end', function () {
      if (bodyString.trim() == 'uptodate') {
        var platformsFolder = path.join(__dirname, '../platforms');
        var gitscript = path.join(__dirname, '../bin/git-update');

        execFile(gitscript, {cwd: platformsFolder}, function (error) {
          if (error) {
            res.status(500).end();
            return;
          }

          pkbmanager.clearCache();
          parserlist.clearCachedParsers();
          parserlist.init(function () {
            res.status(200).end();
          });
        });
      } else {
        res.status(400).end();
      }
    });
  });
};
