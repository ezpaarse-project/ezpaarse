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
    userlist.getAll(function (err, users) {
      if (err) { return res.status(500).end(); }

      res.set("Content-Type", "application/json; charset=utf-8");
      res.set("ezPAARSE-Logged-User", req.user.username);
      res.status(200).json(users);
    });
  });

  /**
   * GET route on /usersnumber
   * To get the number of registered users
   */
  app.get('/usersnumber', function (req, res) {
    userlist.length(function (err, length) {
      if (err) { return res.status(500).end(); }

      res.status(200).send(length.toString());
    });
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
      return sendErr(400, 'fill_all_fields');
    }

    // Regex used by angular
    if (!emailRegexp.test(userid)) {
      return sendErr(400, 'invalid_address');
    }

    if (password != confirm) {
      return sendErr(400, 'password_does_not_match');
    }

    userlist.get(userid, function (err, user) {
      if (err) { res.status(500).end(); }
      if (user) { return sendErr(409, 'user_already_exists'); }

      var cryptedPassword = userlist.crypt(userid, password);

      userlist.add({
        username: userid,
        password: cryptedPassword
      }, function (err, user) {

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
        userlist.remove(username, function (err) {
          if (err) { res.status(500).end(); }
          res.status(204).end();
        });
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
      userlist.get(mail, function (err, user) {
        if (err) { return res.status(500).end(); }
        if (!user) { return res.status(404).end(); }

        var body   = req.body;
        var change = {};

        if (body.username) {
          // Regex used by angular
          if (!emailRegexp.test(body.username)) {
            res.header('ezPAARSE-Status-Message', 'invalid_address');
            return res.status(400).end();
          } else {
            change.username = body.username;
          }
        }

        if (body.group && body.group != user.group) {
          if (mail == req.user.username) {
            res.header('ezPAARSE-Status-Message', 'cant_change_your_own_group');
            return res.status(400).end();
          }
          change.group = body.group;
        }

        userlist.set(user.username, change, function (err, newUser) {
          if (err) { return res.status(500).end(); }

          delete newUser.password;
          res.status(200).json(newUser);
        });
      });
    }
  );

  /**
   * POST route on /password/{username}
   * To reset a user password
   */
  app.post(/^\/passwords\/(.+)$/, function (req, res) {
      var mail = req.params[0];
      userlist.get(mail, function (err, user) {
        if (err) { return res.status(500).end(); }
        if (!user) { return res.status(404).end(); }

        var chars    = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var password = '';

        for (var i = 0; i < 10; i++) {
          password += chars[Math.round(Math.random() * (chars.length - 1))];
        }

        var cryptedPassword = userlist.crypt(mail, password);

        userlist.set(mail, 'password', cryptedPassword, function (err) {
          if (err) { return res.status(500).end(); }

          mailer.mail()
            .subject('[ezPAARSE] Réinitialisation de votre mot de passe')
            .text('Votre mot de passe est désormais : ' + password)
            .from(config.EZPAARSE_ADMIN_MAIL)
            .to(mail)
            .send(function (err) {
              res.status(err ? 500 : 200).end();
            });
        });
      });
    }
  );

  /**
   * POST route on /profile
   * To change profile settings
   */
  app.post('/profile', auth.ensureAuthenticated(true),
    bodyParser.urlencoded({ extended: true }), bodyParser.json(), function (req, res) {
      userlist.get(req.user.username, function (err, user) {
        if (err) { return res.status(500).end(); }
        if (!user) { return res.status(404).end(); }

        var body = req.body;

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

            var newPassword = userlist.crypt(user.username, body.newPassword);
            userlist.set(user.username, 'password', newPassword, function (err) {
              return res.status(err ? 500 : 204).end();
            });
            break;
          default:
            res.set('ezPAARSE-Status-Message', 'bad_section');
            res.status(400).end();
        }
      });
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
