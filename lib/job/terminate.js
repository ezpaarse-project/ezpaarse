'use strict';

/**
 * Close all streams, finalize report and close response
 */
module.exports = function terminateResponse(req, res) {
  this.logger.info('Terminating response');

  // If request ended and no buffer left, terminate the response
  if (this.writerStarted)       { this.writer.writeEnd(); }
  if (this.deniedWriterStarted) { this.deniedWriter.writeEnd(); }

  // No parsed lines = wrong format
  // If the headers are been sent, an upload error occured
  if (!this.parsedLines && !res.headersSent) {
    return Promise.reject(this.error(4003, 400));
  }

  this.report.set('general', 'Job-Done', true);
  this.logger.info(`${this.report.get('general', 'nb-lines-input')} lines were read`);
  this.logger.info(`${this.report.get('general', 'nb-ecs')} ECs were created`);

  const totalLines     = this.report.get('general', 'nb-lines-input');
  const ignoredLines   = this.report.get('rejets', 'nb-lines-ignored');
  const pertinentLines = totalLines - ignoredLines;

  if (pertinentLines > this.alertConfig.activationThreshold) {
    // Looks for alerts
    this.notifiers['unknown-domains'].alerts(this);

    this.alerts.forEach((alert, index) => {
      this.report.set('alerts', 'alert-' + (index + 1), alert);
    });
  }
};
