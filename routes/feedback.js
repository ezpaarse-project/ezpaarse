'use strict';

var fs          = require('graceful-fs');
var path        = require('path');
var express     = require('express');
var request     = require('request');
var mailer      = require('../lib/mailer.js');
var config      = require('../lib/config.js');

module.exports = function (app) {

  if (config.EZPAARSE_HTTP_PROXY) {
    request.defaults({ proxy: config.EZPAARSE_HTTP_PROXY });
  }

  /**
   * Send a mail using mail settings
   * Require sender, receiver(s), and a smtp server
   */
  function sendFeedback(req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    var feedback = req.body;

    if (!feedback || !feedback.comment) {
      res.send(400);
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
    var text = "Utilisateur : " + (usermail ? usermail : "anonyme");

    if (feedback.browser) { text += '\nNavigateur : ' + feedback.browser; }
    text += "\n===============================\n\n";
    text += feedback.comment;

    var mail = mailer.mail();
    mail.subject(subject)
        .message(text)
        .from(config.EZPAARSE_ADMIN_MAIL)
        .to(config.EZPAARSE_FEEDBACK_RECIPIENTS)
        .cc(feedback.mail);

    if (feedback.report) {
      mail.attach("report.json", feedback.report);
    } else if (req.body.jobID) {
      var jobID      = req.body.jobID;
      var reportFile = path.join(__dirname, '/../tmp/jobs/',
        jobID.charAt(0),
        jobID.charAt(1),
        jobID,
        'report.json');

      if (fs.existsSync(reportFile)) {
        mail.attach("report.json", fs.readFileSync(reportFile));
      }
    }

    mail.send(function (error, response) {
      if (error) {
        res.send(500);
      } else {
        res.send(200);
      }
    });
  }

  /**
   * Forward feedback request to the main ezpaarse instance
   */
  function forwardFeedback(req, res) {
    if (req.body.jobID) {
      var jobID      = req.body.jobID;
      var reportFile = path.join(__dirname, '/../tmp/jobs/',
        jobID.charAt(0),
        jobID.charAt(1),
        jobID,
        'report.json');
      if (fs.existsSync(reportFile)) {
        req.body.report = fs.readFileSync(reportFile).toString();
      }
    }

    if (config.EZPAARSE_PARENT_URL) {
      if (req.user) {
        req.body.mail = req.user.username;
      }

      request({
        uri: config.EZPAARSE_PARENT_URL + '/feedback',
        method: 'POST',
        json: req.body
      }, function (err, response, body) {
        if (err || !response || response.statusCode != 200) {
          res.send(501);
        } else {
          res.send(200, body);
        }
      });
    } else {
      res.send(500);
    }
  }

  /**
   * POST route on /feedback
   * To submit a feedback
   */
  app.post('/feedback', express.bodyParser(), function (req, res) {
    if (mailer.canSendMail && config.EZPAARSE_ADMIN_MAIL && config.EZPAARSE_FEEDBACK_RECIPIENTS) {
      sendFeedback(req, res);
    } else {
      forwardFeedback(req, res);
    }
  });

  /**
   * POST route on /feedback/freshinstall
   * To inform the team about a fresh installation
   */
  app.post('/feedback/freshinstall', express.bodyParser(), function (req, res) {
    if (mailer.canSendMail && config.EZPAARSE_FEEDBACK_RECIPIENTS && config.EZPAARSE_ADMIN_MAIL) {
      // If mail can be sent
      res.header('Content-Type', 'application/json; charset=utf-8');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');

      if (!req.body.mail) {
        res.send(400);
        return;
      }

      var text = "Une nouvelle instance d'ezPAARSE vient d'être installée.";
      text    += "\n\nPremier compte : " + req.body.mail;
      text    += "\nVersion installée : " + req.body.ezversion || 'inconnue';

      mailer.mail()
      .subject('[ezPAARSE] Nouvelle installation')
      .message(text)
      .from(config.EZPAARSE_ADMIN_MAIL)
      .to(config.EZPAARSE_FEEDBACK_RECIPIENTS)
      .send(function (error, response) {
        if (error) { res.send(500); }
        else       { res.send(200); }
      });
    } else {
      // If mail can not be sent
      if (!config.EZPAARSE_PARENT_URL) {
        res.send(500);
      } else {
        request({
          uri: config.EZPAARSE_PARENT_URL + '/feedback/freshinstall',
          method: 'POST',
          json: req.body
        }, function (err, response, body) {
          if (err || !response || response.statusCode != 200) {
            res.send(501);
          } else {
            res.send(200, body);
          }
        });
      }
    }

  });

  /**
   * GET route on /feedback/status
   * To know if sending a feedback is possible
   */
  app.get('/feedback/status', function (req, res) {
    if (mailer.canSendMail && config.EZPAARSE_FEEDBACK_RECIPIENTS) {

      mailer.checkServer(function (online) {
        if (online) {
          res.send(200, config.EZPAARSE_FEEDBACK_RECIPIENTS);
        } else {
          res.send(501);
        }
      });
    } else if (config.EZPAARSE_PARENT_URL) {
      request.get(config.EZPAARSE_PARENT_URL + '/feedback/status', function (err, response, body) {
        if (err || !response || response.statusCode != 200) {
          res.send(501);
        } else {
          res.send(200, body);
        }
      });
    } else {
      res.send(501);
    }
  });
};
