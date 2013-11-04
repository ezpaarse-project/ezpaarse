'use strict';

var fs         = require('fs');
var path       = require('path');
var express    = require('express');
var nodemailer = require('nodemailer');
var request    = require('request');
var config     = require('../lib/config.js');

module.exports = function (app) {

  var proxy = config.EZPAARSE_HTTP_PROXY ||
              process.env.HTTP_PROXY ||
              process.env.http_proxy;
  if (proxy) { request.defaults({ proxy: proxy }); }

  var mailConfig  = config.EZPAARSE_FEEDBACK_MAIL || {};
  var canSendMail = mailConfig.FROM &&
                    mailConfig.TO &&
                    mailConfig.SMTP_SERVER &&
                    mailConfig.SMTP_SERVER.PORT &&
                    mailConfig.SMTP_SERVER.HOST;
  var smtpTransport;
  if (canSendMail) {
    smtpTransport = nodemailer.createTransport('SMTP', {
      host: mailConfig.SMTP_SERVER.HOST,
      port: mailConfig.SMTP_SERVER.PORT
    });
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

    if (!feedback || !feedback.note) {
      res.send(400);
      return;
    }

    var username;
    if (feedback.username) {
      username = feedback.username;
    } else if (req.user) {
      username = req.user.username;
    }

    var subject = '[ezPAARSE] Feedback ';
    subject += username ? 'de ' + username : 'anonyme';
    var text = "Utilisateur : " + (username ? username : "non connecté");
    if (feedback.browser) {
      if (feedback.browser.userAgent) { text += '\nNavigateur : ' + feedback.browser.userAgent; }
      if (feedback.browser.platform)  { text += '\nPlateforme : ' + feedback.browser.platform; }
    }
    text += "\n===============================\n\n"
    text += feedback.note;


    var mailOptions = {
      from: mailConfig.FROM,
      to: mailConfig.TO,
      subject: subject,
      text: text
    };

    if (feedback.img) {
      mailOptions.attachments = [
        {
          fileName: "screenshot.png",
          contents: new Buffer(feedback.img.replace(/^data:image\/png;base64,/, ""), "Base64")
        }
      ];
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
        res.send(500);
      } else {
        console.log("Message sent: " + response.message);
        res.send(201, {});
      }
    });
  }

  /**
   * Forward feedback request to the main ezpaarse instance
   */
  function forwardFeedback(req, res) {
    if (req.user) {
      req.body.username = req.user.username;
    }

    request({
      uri: 'http://ezpaarse-preprod.couperin.org/feedback',
      method: 'POST',
      json: req.body
    }).pipe(res);
  }

  /**
   * POST route on /feedbacks/
   * To submit a feedback
   */
  app.post('/feedback', express.bodyParser(), canSendMail ? sendFeedback : forwardFeedback);
};
