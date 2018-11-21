'use strict';

var fs = require('fs-extra');
var path = require('path');
var os = require('os');
var bodyParser = require('body-parser');
var request = require('request');
var mailer = require('../lib/mailer.js');
var git = require('../lib/git-tools.js');
var config = require('../lib/config.js');
var pkg = require('../package.json');

var { Router } = require('express');
var app = Router();

/**
 * POST route on /
 * To submit a feedback
 */
app.post('/', bodyParser.urlencoded({ extended: true }), bodyParser.json(),
  function (req, res) {
    if (!config.EZPAARSE_ADMIN_MAIL || !config.EZPAARSE_FEEDBACK_RECIPIENTS) {
      res.status(500).end();
      return;
    }

    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    var feedback = req.body;

    if (!feedback || !feedback.comment) {
      res.status(400).end();
      return;
    }

    var usermail;
    if (req.user) {
      usermail = req.user.username;
    } else if (feedback.mail) {
      usermail = feedback.mail;
    }

    var subject = '[ezPAARSE] Feedback ';
    subject += usermail ? 'de ' + usermail : 'anonyme';
    var text = 'Utilisateur : ' + (usermail || 'anonyme');

    if (feedback.browser) { text += '\nNavigateur : ' + feedback.browser; }

    text += '\nezPAARSE ' + pkg.version + ' / ' + os.platform() + ' ' + os.release();
    text += ' (' + os.arch() + ')';
    text += '\n===============================\n\n';
    text += feedback.comment;

    var mail = mailer.mail();
    mail.subject(subject)
      .text(text)
      .from(config.EZPAARSE_ADMIN_MAIL)
      .to(config.EZPAARSE_FEEDBACK_RECIPIENTS)
      .cc(feedback.mail);

    var sendMail = function () {
      mail.send(function (error) {
        if (error) { res.status(500).end(); }
        else { res.status(200).end(); }
      });
    };

    if (feedback.report) {
      mail.attach('report.json', feedback.report);
      return sendMail();
    }

    if (!req.body.jobID) { return sendMail(); }

    var jobID = req.body.jobID;
    var reportFile = path.join(__dirname, '/../tmp/jobs/',
      jobID.charAt(0),
      jobID.charAt(1),
      jobID,
      'report.json');

    fs.readFile(reportFile, function (err, content) {
      if (err && err.code !== 'ENOENT') { return res.status(500).end(); }

      mail.attach('report.json', content.toString());
      sendMail();
    });
  });

/**
 * POST route on /feedback/freshinstall
 * To inform the team about a fresh installation
 */
app.post('/freshinstall', bodyParser.urlencoded({ extended: true }), bodyParser.json(),
  function (req, res) {
    if (!config.EZPAARSE_FEEDBACK_RECIPIENTS || !config.EZPAARSE_ADMIN_MAIL) {
      res.status(500).end();
      return;
    }

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    if (!req.body.mail) {
      res.status(400).end();
      return;
    }

    git.exec('describe', function (err, stdout) {

      var text = 'Une nouvelle instance d\'ezPAARSE vient d\'être installée.';
      text += '\n\nPremier compte : ' + req.body.mail;
      text += ' | http://' + req.body.mail.split('@')[1];
      text += '\nPlateforme : ' + os.platform() + ' ' + os.release() + ' (' + os.arch() + ')';
      text += '\nVersion :';
      text += '\n- package : ' + pkg.version || 'inconnue';
      text += '\n- git : ' + (!err && stdout ? stdout : 'inconnue');

      mailer.mail()
        .subject('[ezPAARSE] Nouvelle installation')
        .text(text)
        .from(config.EZPAARSE_ADMIN_MAIL)
        .to(config.EZPAARSE_FEEDBACK_RECIPIENTS)
        .send(function (error, response) {
          if (error) { res.status(500).end(); }
          else { res.status(200).end(); }
        });
    });
  });

/**
 * GET route on /feedback/status
 * To know if sending a feedback is possible
 */
app.get('/', function (req, res) {
  if (!config.EZPAARSE_FEEDBACK_RECIPIENTS || !config.EZPAARSE_ADMIN_MAIL) {
    res.status(501).end();
    return;
  }

  if (mailer.canSendMail) {

    mailer.checkServer(function (online) {
      if (online) {
        res.status(200).send(config.EZPAARSE_FEEDBACK_RECIPIENTS);
      } else {
        res.status(501).end();
      }
    });
  } else if (config.EZPAARSE_PARENT_URL) {
    request.get(config.EZPAARSE_PARENT_URL + '/feedback/status', function (err, response, body) {
      if (err || !response || response.statusCode != 200) {
        res.status(501).end();
      } else {
        res.status(200).send(config.EZPAARSE_FEEDBACK_RECIPIENTS);
      }
    });
  } else {
    res.status(501).end();
  }
});

module.exports = app;