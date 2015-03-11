'use strict';

var path       = require('path');
var bodyParser = require('body-parser');
var pkbmanager = require('../lib/pkbmanager.js');
var parserlist = require('../lib/parserlist.js');
var execFile   = require('child_process').execFile;
var config     = require('../lib/config.js');
var userlist   = require('../lib/userlist.js');
var mailer     = require('../lib/mailer.js');
var auth       = require('../lib/auth-middlewares.js');
var ezJobs     = require('../lib/jobs.js');
var io         = require('../lib/socketio.js').io;

var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

module.exports = function (app) {

  /**
   * GET route on /jobs
   * Get IDs of current jobs
   */
  app.get('/jobs', auth.ensureAuthenticated(true), auth.authorizeMembersOf('admin'),
    function (req, res) {

    res.status(200).json(Object.keys(ezJobs));

    var socket = io().sockets.connected[req.query.socket];
    if (socket) {
      socket.join('admin');
    }
  });

  /**
   * GET route on /app/status
   * To know if there are incoming changes
   */
  app.get('/app/status', auth.ensureAuthenticated(true), function (req, res) {
    var gitscript = path.join(__dirname, '../bin/git-status');

    var args = [];

    execFile(gitscript, args, { cwd: __dirname }, function (error, stdout) {
      if (error || !stdout) {
        res.status(500).end();
        return;
      }

      try {
        var result = JSON.parse(stdout);
        res.status(200).json(result);
      } catch (e) {
        res.status(500).end();
      }

    });
  });

  /**
   * Auto-update
   */
  app.put('/app/status', auth.ensureAuthenticated(true), auth.authorizeMembersOf('admin'),
    function (req, res) {

    var args = ['--restart'];

    if (req.query.version === 'latest') { args.push('--latest'); }
    if (req.query.force == 'yes')       { args.push('--force'); }
    if (req.query.rebuild !== 'no')     { args.push('--rebuild'); }

    res.on('finish', function () {
      execFile('../lib/bin/update-app.js', args, { cwd: __dirname });
    });

    res.status(200).end();
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
    var group    = 'user';

    var isAdmin = (req.user && req.user.group == 'admin');
    if (isAdmin) { group = req.body.group || group; }

    var sendErr = function (status, message) {
      res.writeHead(status, { 'ezPAARSE-Status-Message': message });
      res.end();
    };

    if (!userid || !password || !confirm) {
      sendErr(400, 'fill_all_fields');
      return;
    }

    // Regex used by angular
    if (!emailRegexp.test(userid)) {
      sendErr(400, 'invalid_address');
      return;
    }

    if (password != confirm) {
      sendErr(400, 'password_does_not_match');
      return;
    }

    if (userlist.get(userid)) {
      sendErr(409, 'user_already_exists');
      return;
    }

    var cryptedPassword = userlist.crypt(userid, password);

    var user = userlist.add({
      username: userid,
      password: cryptedPassword,
      group: userlist.length() === 0 ? 'admin' : group
    });

    if (!user) {
      res.status(500).end();
      return;
    }

    var copyUser = {};
    for (var prop in user) {
      if (prop != 'password') { copyUser[prop] = user[prop]; }
    }

    if (isAdmin) {
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
        res.set('ezPAARSE-Status-Message', 'cant_delete_yourself');
        res.status(403).end();
      } else {
        var user = userlist.remove(username);
        if (user) {
          res.status(204).end();
        } else {
          res.set('ezPAARSE-Status-Message', 'user_does_not_exist');
          res.status(404).end();
        }
      }
    }
  );

  /**
   * POST route on /users/{username}
   * To change a user
   */
  app.post(/^\/users\/(.+)$/, auth.ensureAuthenticated(true), auth.authorizeMembersOf('admin'),
    bodyParser.urlencoded({ extended: true }), bodyParser.json(), function (req, res) {
      var mail = req.params[0];
      var user = userlist.get(mail);
      if (!user) { return res.status(404).end(); }

      var body = req.body;

      if (body.username) {
        // Regex used by angular
        if (!emailRegexp.test(body.username)) {
          res.header('ezPAARSE-Status-Message', 'invalid_address');
          return res.status(400).end();
        } else {
          user.username = body.username;
        }
      }

      if (body.group && body.group != user.group) {
        if (mail == req.user.username) {
          res.header('ezPAARSE-Status-Message', 'cant_change_your_own_group');
          return res.status(400).end();
        }
        user.group = body.group;
      }

      userlist.save();
      var copy = {};
      for (var p in user) {
        if (p != 'password') { copy[p] = user[p]; }
      }
      res.status(200).json(copy);
    }
  );

  /**
   * POST route on /password/{username}
   * To reset a user password
   */
  app.post(/^\/passwords\/(.+)$/, function (req, res) {
      var mail = req.params[0];
      var user = userlist.get(mail);
      if (!user) { return res.status(404).end(); }

      var chars    = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var password = '';

      for (var i = 0; i < 10; i++) {
        password += chars[Math.round(Math.random() * (chars.length - 1))];
      }

      var cryptedPassword = userlist.crypt(mail, password);

      if (userlist.set(mail, 'password', cryptedPassword)) {
        mailer.mail()
          .subject('[ezPAARSE] Réinitialisation de votre mot de passe')
          .text('Votre mot de passe est désormais : ' + password)
          .from(config.EZPAARSE_ADMIN_MAIL)
          .to(mail)
          .send(function (err) {
            res.status(err ? 500 : 200).end();
          });
      } else {
        res.status(500).end();
      }
    }
  );

  /**
   * POST route on /profile
   * To change profile settings
   */
  app.post('/profile', auth.ensureAuthenticated(true),
    bodyParser.urlencoded({ extended: true }), bodyParser.json(), function (req, res) {
      var user = userlist.get(req.user.username);
      var body = req.body;

      if (!user) { return res.status(404).end(); }

      switch (body.section) {
        case 'password':
          if (!body.oldPassword || !body.newPassword || !body.confirm) {
            res.set('ezPAARSE-Status-Message', 'fill_all_fields');
            return res.status(400).end();
          } else if (body.newPassword != body.confirm) {
            res.set('ezPAARSE-Status-Message', 'password_does_not_match');
            return res.status(400).end();
          }

          var oldCryptedPassword = userlist.crypt(user.username, body.oldPassword);

          if (user.password != oldCryptedPassword) {
            res.set('ezPAARSE-Status-Message', 'wrong_password');
            return res.status(400).end();
          }

          user.password = userlist.crypt(user.username, body.newPassword);
          userlist.save();
          return res.status(204).end();
        default:
          res.set('ezPAARSE-Status-Message', 'bad_section');
          res.status(400).end();
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

      try {
        var result = JSON.parse(stdout);
        res.status(200).json(result);
      } catch (e) {
        res.status(500).end();
      }
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
