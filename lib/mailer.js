'use strict';

var nodemailer  = require('nodemailer');
var portscanner = require('portscanner');
var config      = require('./config.js');

var smtpTransport;
var server      = config.EZPAARSE_SMTP_SERVER;
var canSendMail = !!(server && server.port && server.host);

if (canSendMail) {
  smtpTransport = nodemailer.createTransport('SMTP', {
    host: server.host,
    port: server.port
  });
}

module.exports = {
  canSendMail: canSendMail,
  checkServer: function (callback) {
    portscanner.checkPortStatus(server.port, server.host, function (err, status) {
      callback(!err && status !== 'open');
    });
  },
  mail: function mail() {
    var opts = {};

    return {
      send:    function (callback) {
        if (typeof callback === 'function') { callback(); }
        smtpTransport.sendMail(opts, callback);
        return this;
      },
      message: function (msg)   { opts.text = msg; return this; },
      append:  function (str)   { opts.text = (opts.text || '') + str; return this; },
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
  }
};
