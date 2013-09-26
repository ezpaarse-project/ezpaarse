'use strict';

var fs          = require('fs');
var path        = require('path');
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
      users[username] = password;

      fs.writeFile(credentialsFile, JSON.stringify(users), function (err) {
        if (err) {
          res.send(500);
          return;
        }
        res.send(204);
      });
    });
  });
};
