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
  smtpTransport = nodemailer.createTransport(server);
}

var render = function(filePath, locals, callback) {
  fs.stat(filePath, function(err, stats) {
    if (err) { return callback(err); }
    if (!stats.isFile()) {
      return callback(new Error(`${filePath} is not a valid file path`));
    }

    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) { return callback(err); }

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
        callback = callback || function () {};

        // Keep backward compatibility with nodemailer 0.7 configuration
        if (opts.hasOwnProperty('attachments')) {
          opts.attachments = opts.attachments.map(function (file) {
            file.filename = file.filename || file.fileName;
            file.content  = file.content  || file.contents;
            delete opts.fileName;
            delete opts.contents;
            return file;
          });
        }

        if (canSendMail) {
          smtpTransport.sendMail(opts, callback);
          return this;
        }

        if (!config.EZPAARSE_PARENT_URL) {
          callback(new Error('No mailing config'));
          return this;
        }

        request({
          uri: `${config.EZPAARSE_PARENT_URL}/mail`,
          method: 'POST',
          json: opts
        }, function (err, response) {
          if (err) { return callback(err); }
          if (response.statusCode != 200) {
            return callback(new Error(`got code ${response.statusCode} from parent server`));
          }

          callback();
        });

        return this;
      },
      text:    function (str)   { opts.text = str; return this; },
      html:    function (str)   { opts.html = str; return this; },
      subject: function (sub)   { opts.subject = sub; return this; },
      from:    function (mails) { opts.from = mails; return this; },
      to:      function (mails) { opts.to = mails; return this; },
      cc:      function (mails) { opts.cc = mails; return this; },
      attach:  function (filename, content) {
        opts.attachments = opts.attachments || [];
        opts.attachments.push({
          filename: filename,
          content: content
        });
        return this;
      }
    };
  },
  generate: function (templateName, locals, callback) {
    if (typeof callback !== 'function') { callback = function () {}; }
    if (!templateName) { return callback(new Error('No template name provided')); }

    locals = locals || {};
    var htmlFile = path.join(templatesDir, templateName, 'html.ejs');
    var textFile = path.join(templatesDir, templateName, 'text.ejs');

    render(htmlFile, locals, function (err, html) {
      if (err) { return callback(err); }

      render(textFile, locals, function (err, text) {
        if (err) { return callback(err); }

        callback(null, html, text);
      });
    });
  },
  handle: function (req, res) {
    if (typeof req.body !== 'object') {
      return res.status(400).end();
    }

    mailer.mail(req.body).send(function (err) {
      if (err) { res.status(500).end(); }
      else     { res.status(200).end(); }
    });
  }
};

module.exports = mailer;
