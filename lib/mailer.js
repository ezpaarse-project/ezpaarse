'use strict';

var nodemailer     = require('nodemailer');
var ejs            = require('ejs');
var fs             = require('fs');
var portscanner    = require('portscanner');
var request        = require('request');
var path           = require('path');
var config         = require('./config.js');

var templatesDir = path.join(__dirname, '../views/mail-templates');

var smtpTransport;
var server       = config.EZPAARSE_SMTP_SERVER;
var canSendMail  = !!(server && server.port && server.host);

if (canSendMail) {
  smtpTransport = nodemailer.createTransport('SMTP', {
    host: server.host,
    port: server.port
  });
}

var render = function(filePath, locals, callback) {
  fs.stat(filePath, function(err, stats) {
    if (err) { callback(err); return; }
    if (!stats.isFile()) { callback(filePath + ' is not a valid file path'); return; }

    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) { callback(err); return; }

      callback(null, ejs.render(data, locals));
    });
  });
};

var mailer = {
  canSendMail: canSendMail,
  checkServer: function (callback) {
    portscanner.checkPortStatus(server.port, server.host, function (err, status) {
      callback(!err && status == 'open');
    });
  },
  mail: function mail(options) {
    var opts = options || {};

    return {
      send: function (callback) {
        if (canSendMail) {
          smtpTransport.sendMail(opts, function (err) {
            callback(err);
          });
        } else if (config.EZPAARSE_PARENT_URL) {
          request({
            uri: config.EZPAARSE_PARENT_URL + '/mail',
            method: 'POST',
            json: opts
          }, function (err, response) {
            callback(err || response.statusCode != 200);
          });
        } else {
          callback(true);
        }
        return this;
      },
      text:    function (str)   { opts.text = str; return this; },
      html:    function (str)   { opts.html = str; return this; },
      subject: function (sub)   { opts.subject = sub; return this; },
      from:    function (mails) { opts.from = mails; return this; },
      to:      function (mails) { opts.to = mails; return this; },
      cc:      function (mails) { opts.cc = mails; return this; },
      attach:  function (fileName, contents) {
        opts.attachments = opts.attachments || [];
        opts.attachments.push({
          fileName: fileName,
          contents: contents
        });
        return this;
      }
    };
  },
  generate: function (templateName, locals, callback) {
    if (typeof callback !== 'function') { callback = function () {}; }
    if (!templateName) { callback(new Error('No template name provided')); return; }

    locals = locals || {};
    var htmlFile = path.join(templatesDir, templateName, 'html.ejs');
    var textFile = path.join(templatesDir, templateName, 'text.ejs');

    render(htmlFile, locals, function (err, html) {
      if (err) { callback(err); return; }

      render(textFile, locals, function (err, text) {
        if (err) { callback(err); return; }

        callback(null, html, text);
      });
    });
  },
  handle: function (req, res) {
    if (typeof req.body !== 'object') {
      res.send(400);
      return;
    }

    mailer.mail(req.body).send(function (err) {
      if (err) { res.send(500); }
      else     { res.send(200); }
    });
  }
};

module.exports = mailer;
