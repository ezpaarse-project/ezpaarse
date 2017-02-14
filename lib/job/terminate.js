'use strict';

const fs   = require('fs');
const path = require('path');

const config = require('../config.js');
const mailer = require('../mailer.js');

/**
 * Close all streams, finalize report and close response
 */
module.exports = function* terminateResponse(req, res) {
  const self = this;

  this.logger.info('Terminating response');

  // If request ended and no buffer left, terminate the response
  if (this.writerStarted)       { this.writer.writeEnd(); }
  if (this.deniedWriterStarted) { this.deniedWriter.writeEnd(); }

  // No parsed lines = wrong format
  // If the headers are been sent, an upload error occured
  if (!this.parsedLines && !res.headersSent) {
    return Promise.reject(this.error(4003, 400));
  }

  const reports = this.counterReporter.getReports(this.counterFormat);
  for (let type in reports) {
    yield new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(this.jobPath, `${type}.${this.counterFormat}`),
        reports[type],
        err => { resolve(); }
      );
    });
  }

  this.report.set('general', 'Job-Done', true);
  this.logger.info('%d lines were read', this.report.get('general', 'nb-lines-input'));
  this.logger.info('%d ECs were created', this.report.get('general', 'nb-ecs'));

  const totalLines     = this.report.get('general', 'nb-lines-input');
  const ignoredLines   = this.report.get('rejets', 'nb-lines-ignored');
  const pertinentLines = totalLines - ignoredLines;

  if (pertinentLines > this.alertConfig.activationThreshold) {
    // Looks for alerts
    this.notifiers['unknown-domains'].alerts(this);
    this.notifiers['missing-title-ids'].alerts(this);

    this.alerts.forEach((alert, index) => {
      this.report.set('alerts', 'alert-' + (index + 1), alert);
    });
  }

  // If an email is requested
  if (!this.notifications.mail.length || !config.EZPAARSE_ADMIN_MAIL) {
    return finalize();
  }

  const locals = {
    job: this,
    ezBaseURL: req.ezBaseURL
  };

  yield new Promise((resolve, reject) => {
    mailer.generate('job-notification', locals, (err, html, text) => {
      if (err) {
        this.report.set('notifications', 'mail-status', 'fail');
        return finalize();
      }

      mailer.mail()
        .subject('[ezPAARSE] Your job is completed')
        .html(html)
        .text(text)
        .from(config.EZPAARSE_ADMIN_MAIL)
        .to(this.notifications.mail.join(','))
        .attach('report.json', JSON.stringify(this.report.getJson(), null, 2))
        .send(err => {
          this.report.set('notifications', 'mail-status', err ? 'fail' : 'success');
        });
    });
  });

  return finalize();

  function finalize() {
    return new Promise((resolve, reject) => {
      self.logger.info('Finalizing report file');
      self.report.finalize(resolve, self.socket);
    });
  }
};
