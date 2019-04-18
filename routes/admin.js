'use strict';

const fs         = require('fs');
const path       = require('path');
const Boom       = require('boom');
const bodyParser = require('body-parser');
const { execFile, spawn }   = require('child_process');
const geoip      = require('geoip-lite');
const parserlist = require('../lib/parserlist.js');
const config     = require('../lib/config.js');
const userlist   = require('../lib/userlist.js');
const mailer     = require('../lib/mailer.js');
const auth       = require('../lib/auth-middlewares.js');
const ezJobs     = require('../lib/jobs.js');
const io         = require('../lib/socketio.js').io;
const password = require('../lib/password');

const emailRegexp = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

const { Router } = require('express');
const app = Router();

/**
 * GET route on /jobs
 * Get IDs of current jobs
 */
app.get('/jobs', auth.ensureAuthenticated(true), auth.authorizeMembersOf('admin'),
  function (req, res) {

    res.status(200).json(Object.keys(ezJobs));

    var socket = io().sockets.connected[req.query.socket];
    if (socket) { socket.join('admin'); }
  });

/**
 * GET route on /.../status
 * To know if there are incoming changes in a repository
 */
app.get('/:repo/status', auth.ensureAuthenticated(true),
  function (req, res, next) {
    var gitScript = path.join(__dirname, '../bin/git-status');
    var directory;

    switch (req.params.repo) {
    case 'platforms':
    case 'resources':
    case 'middlewares':
      directory = path.join(__dirname, '..', req.params.repo);
      break;
    case 'app':
      directory = path.join(__dirname, '..');
      break;
    default:
      return next(Boom.notAcceptable('invalid_repository'));
    }

    execFile(gitScript, { cwd: directory }, function (error, stdout) {
      if (error) { return next(error); }
      if (!stdout) { return next(Boom.badImplementation()); }

      try {
        var result = JSON.parse(stdout);
        res.status(200).json(result);
      } catch (e) {
        return next(e);
      }
    });
  }
);

/**
 * Auto-update
 */
app.put('/app/status', auth.ensureAuthenticated(true), auth.authorizeMembersOf('admin'),
  function (req, res) {

    var args = [];

    if (req.query.version === 'latest') { args.push('--latest'); }
    if (req.query.force == 'yes')       { args.push('--force'); }
    if (req.query.rebuild !== 'no')     { args.push('--rebuild'); }

    const socket = io().sockets.connected[req.query.socket];
    if (socket) {
      socket.join('admin');
    }

    res.locals.updating = true;
    const child = execFile('../bin/update-app', args, { cwd: __dirname });

    child.stdout.on('data', data => {
      io().to('admin').emit('update-logs', data);
    });
    child.stderr.on('data', data => {
      io().to('admin').emit('update-logs', data);
    });
    child.on('close', () => {
      res.status(200).end();
      io().to('admin').emit('update-logs', 'Restarting...');

      setTimeout(() => {
        spawn('make', ['restart'], { cwd: path.resolve(__dirname, '..') });
      }, 500);
    });
  });

/**
 * GET route on /users
 * To get the user list
 */
app.get('/users', auth.ensureAuthenticated(true), function (req, res, next) {
  userlist.getAll(function (err, users) {
    if (err) { return next(err); }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.set('ezPAARSE-Logged-User', req.user.username);
    res.status(200).json(users);
  });
});

/**
 * GET route on /usersnumber
 * To get the number of registered users
 */
app.get('/usersnumber', function (req, res, next) {
  userlist.length(function (err, length) {
    if (err) { return next(err); }

    res.status(200).send(length.toString());
  });
});

/**
 * POST route on /register
 * To sign up
 */
app.post('/register', bodyParser.urlencoded({ extended: true }), bodyParser.json(),
  function (req, res, next) {
    var userid   = req.body.userid;
    var password = req.body.password;
    var confirm  = req.body.confirm;

    if (!userid || !password || !confirm) {
      return next(Boom.badRequest('fillAllFields'));
    }

    // Regex used by angular
    if (!emailRegexp.test(userid)) {
      return next(Boom.badRequest('invalidAddress'));
    }

    if (password != confirm) {
      return next(Boom.badRequest('passwordDoesNotMatch'));
    }

    userlist.get(userid, function (err, user) {
      if (err) { return next(err); }
      if (user) { return next(Boom.conflict('userAlreadyExists')); }

      var cryptedPassword = userlist.crypt(userid, password);

      userlist.add({
        username: userid,
        password: cryptedPassword,
        group: 'user',
        createdAt: new Date()
      }, function (err, user) {

        if (err) { return next(err); }
        if (!user) { return next(Boom.badImplementation()); }

        var copyUser = {};
        for (var prop in user) {
          if (prop != 'password') { copyUser[prop] = user[prop]; }
        }

        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          res.status(201).json(copyUser);
        });

        if (config.EZPAARSE_SUBSCRIPTION_MAIL) {
          // Extract IPv4 from IPv4-mapped IPv6
          var ipMatch = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/.exec(req.ip);

          var locals = {
            user: user,
            userIP: req.ip,
            hostname: req.hostname,
            geoip: geoip.lookup(ipMatch ? ipMatch[1] : req.ip) || {}
          };

          mailer.generate('subscription', locals, function (err, html, text) {
            if (err) {
              text = `Mail: ${user.username}\nSignup date: ${user.createdAt}`;
            }

            mailer.mail()
              .subject('[ezPAARSE] New subscription')
              .html(html)
              .text(text)
              .from(config.EZPAARSE_ADMIN_MAIL)
              .to(config.EZPAARSE_FEEDBACK_RECIPIENTS)
              .send();
          });
        }
      });

    });
  }
);

/**
 * POST route on /users
 * To add a user as admin
 */
app.post('/users/', auth.ensureAuthenticated(true), auth.authorizeMembersOf('admin'),
  bodyParser.urlencoded({ extended: true }), bodyParser.json(), function (req, res, next) {
    var userid   = req.body.userid;
    var password = req.body.password;
    var group    = req.body.group || 'user';

    if (!userid || !password) {
      return next(Boom.badRequest('fillAllFields'));
    }

    // Regex used by angular
    if (!emailRegexp.test(userid)) {
      return next(Boom.badRequest('invalidAddress'));
    }

    userlist.get(userid, function (err, user) {
      if (err) { return next(err); }
      if (user) { return next(Boom.conflict('userAlreadyExists')); }

      var cryptedPassword = userlist.crypt(userid, password);

      userlist.add({
        username: userid,
        password: cryptedPassword,
        group: group,
        createdAt: new Date()
      }, function (err, user) {

        if (err) { return next(err); }
        if (!user) { return next(Boom.badImplementation()); }

        var copyUser = {};
        for (var prop in user) {
          if (prop != 'password') { copyUser[prop] = user[prop]; }
        }

        res.status(201).json(copyUser);
      });
    });
  }
);

/**
 * DELETE route on /users/{username}
 * To remove a user
 */
app.delete(/^\/users\/(.+)$/, auth.ensureAuthenticated(true),
  auth.authorizeMembersOf('admin'), function (req, res, next) {
    var username = req.params[0];
    if (username == req.user.username) {
      return next(Boom.forbidden('cannotDeleteYourself'));
    }
    userlist.remove(username, function (err) {
      if (err) { return next(err); }
      res.status(204).end();
    });
  }
);

/**
 * POST route on /users/{username}
 * To change a user
 */
app.post(/^\/users\/(.+)$/, auth.ensureAuthenticated(true), auth.authorizeMembersOf('admin'),
  bodyParser.urlencoded({ extended: true }), bodyParser.json(), function (req, res, next) {
    var mail = req.params[0];

    userlist.get(mail, function (err, user) {
      if (err) { return next(err); }
      if (!user) { return next(Boom.notFound()); }

      var body   = req.body;
      var change = {};

      if (typeof body.username === 'string') {
        // Regex used by angular
        if (!emailRegexp.test(body.username)) {
          return next(Boom.badRequest('invalidAddress'));
        }

        change.username = body.username;
      }

      if (body.group && body.group !== user.group) {
        if (mail == req.user.username) {
          return next(Boom.badRequest('cannotChangeYourOwnGroup'));
        }
        change.group = body.group;
      }

      userlist.set(user.username, change, function (err, newUser) {
        if (err) { return next(err); }

        delete newUser.password;
        res.status(200).json(newUser);
      });
    });
  }
);

/**
 * POST route on /passwords
 * To reset a user password
 */
/* eslint-disable-next-line */
app.post('/passwords', bodyParser.urlencoded({ extended: true }), bodyParser.json(), function (req, res, next) {
  const username = req.body.username;
  const locale = req.body.locale || 'en';
  if (!username) { return next(Boom.badRequest('missingUsername')); }

  userlist.get(username, function (err, user) {
    if (err) { return next(err); }
    if (!user) { return next(Boom.notFound('userNotFound')); }

    password.genereateUniqId(username, function (err, result, uuid) {
      if (err || !uuid) { return next(err); }
      if (!result) { return next(Boom.notFound()); }

      const host = req.get('x-forwarded-host') || req.get('host');
      const url = `${req.protocol}://${host}/password/${uuid}`;

      mailer.generate(`password/${locale}`, { url }, function (err, html, text) {
        if (err) { return next(err); }

        const subject = locale === 'fr'
          ? 'Réinitialisation de votre mot de passe'
          : 'Resetting your password';

        mailer.mail()
          .subject(`[ezPAARSE] ${subject}`)
          .html(html)
          .text(text)
          .from(config.EZPAARSE_ADMIN_MAIL)
          .to(username)
          .send(function (err) {
            if (err) { return next(err); }
            res.status(200).end();
          });
      });
    });
  });
});

/* eslint-disable-next-line */
app.put('/passwords', bodyParser.urlencoded({ extended: true }), bodyParser.json(), function (req, res, next) {
  const pwd = req.body.credentials.password;
  const pwdRepeat = req.body.credentials.password_repeat;
  const uuid = req.body.uuid;

  if (!pwd || !pwdRepeat || !uuid) {
    return next(Boom.badRequest());
  }
  if (pwd !== pwdRepeat) {
    return next(Boom.badRequest('passwordDoesNotMatch'));
  }

  password.getUser(uuid, function (err, result) {
    if (err) { return next(err); }
    if (!result) { return next(Boom.badImplementation()); }

    const currentDate = Date.now();

    if (currentDate > result.expirationDate) {
      return next(Boom.resourceGone('expirationDate'));
    }

    const cryptedPassword = userlist.crypt(result.username, pwd);

    userlist.set(result.username, 'password', cryptedPassword, function (err) {
      if (err) { return next(Boom.badImplementation('passwordNotSet')); }

      userlist.set(result.username, 'expirationDate', 0, function (err) {
        if (err) { return next(Boom.badImplementation('passwordNotSet')); }

        return res.status(200).end();
      });
    });
  });
});

/**
 * POST route on /profile
 * To change profile settings
 */
app.post('/profile', auth.ensureAuthenticated(true),
  bodyParser.urlencoded({ extended: true }), bodyParser.json(), function (req, res, next) {
    userlist.get(req.user.username, function (err, user) {
      if (err) { return next(err); }
      if (!user) { return next(Boom.notFound()); }

      var body = req.body;

      switch (body.section) {
      case 'password':
        if (!body.oldPassword || !body.newPassword || !body.confirm) {
          return next(Boom.badRequest('fillAllFields'));
        } else if (body.newPassword != body.confirm) {
          return next(Boom.badRequest('passwordDoesNotMatch'));
        }

        var oldCryptedPassword = userlist.crypt(user.username, body.oldPassword);

        if (user.password != oldCryptedPassword) {
          return next(Boom.badRequest('wrongPassword'));
        }

        var newPassword = userlist.crypt(user.username, body.newPassword);
        userlist.set(user.username, 'password', newPassword, function (err) {
          if (err) { return next(err); }
          return res.status(204).end();
        });
        break;
      case 'notifications':
        if (typeof body.notifiate === 'string') {
          body.notifiate = (body.notifiate.toLowerCase() !== 'false');
        }
        userlist.set(user.username, 'notifiate', !!body.notifiate, function (err) {
          if (err) { return next(err); }
          return res.status(204).end();
        });
        break;
      default:
        return next(Boom.badRequest('badSection'));
      }
    });
  }
);

/**
 * Update a git folder
 */
app.put('/:repo/status', auth.ensureAuthenticated(true), auth.authorizeMembersOf('admin'),
  function (req, res, next) {
    const repo = req.params.repo;
    const repos = ['resources', 'middlewares', 'platforms'];

    if (repos.indexOf(repo) === -1) {
      return next(Boom.notAcceptable(`valid repos : ${repos.join(', ')}`));
    }

    const directory = path.join(__dirname, '..', repo);
    const gitScript = path.join(__dirname, '../bin/git-update');

    execFile(gitScript, { cwd: directory }, function (error) {
      if (error) { return next(error); }

      switch (repo) {
      case 'resources':
        clearCache('../resources/predefined-settings.json').then(() => {
          res.locals.bundle = null;
          res.status(200).end();
        }).catch(err => {
          res.status(200).end();
        });
        break;
      case 'middlewares':
        clearCache('../middlewares').then(() => {
          res.status(200).end();
        }).catch(err => {
          res.status(200).end();
        });
        break;
      case 'platforms':
        parserlist.clearCachedParsers();
        parserlist.init(function () {
          res.status(200).end();
        });
        res.status(200).end();
        break;
      default:
        return next(Boom.badImplementation());
      }
    });
  }
);

/**
 * Clear a file (JS or JSON) or a whole directory from the require cache
 * @param {String} filePath  file or dir
 */
function clearCache(filePath) {
  if (!filePath) { return Promise.resolve(); }

  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stat) => {
      if (err) {
        if (err.code === 'ENOENT') { return resolve(); }
        return reject(err);
      }

      if (stat.isFile()) {
        if (!filePath.endsWith('.js') && !filePath.endsWith('.json')) {
          return resolve();
        }

        try {
          delete require.cache[require.resolve(filePath)];
          return resolve();
        } catch (e) {
          return reject(err);
        }
      }

      if (!stat.isDirectory()) { return resolve(); }

      fs.readdir(filePath, (err, files) => {
        if (err) { return reject(err); }

        (function nextFile() {
          const file = files.pop();

          if (!file) { return resolve(); }

          clearCache(path.resolve(filePath, file))
            .then(nextFile)
            .catch(reject);
        })();
      });
    });
  });
}

module.exports = app;