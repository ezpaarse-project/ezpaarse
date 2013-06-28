/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs     = require('fs');
var moment = require('moment');

module.exports = function (app) {
  
  var jobidPattern = '^/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})';
  /**
   * GET route on /:rid/:logfile
   * Used to get a logfile
   */
  app.get(new RegExp(jobidPattern + '/([a-zA-Z\\-]+\\.log)$'), function (req, res) {
    var requestID = req.params[0];
    var logPath   = __dirname + '/../tmp/jobs/'
      + requestID.charAt(0) + '/'
      + requestID.charAt(1) + '/'
      + requestID;
    var logFile = fs.realpathSync(logPath + '/' + req.params[1]);
    if (fs.existsSync(logFile)) {
      fs.stat(logFile, function (err, stats) {
        if (err) {
          res.status(500);
          res.end();
          return;
        }
        // download as an attachment if file size is >500ko
        // open it in directly in the browser if file size is <500ko
        if (stats.size > 500 * 1024) {
          res.download(logFile, requestID + '-' + req.params[1]);
        } else {
          res.sendfile(logFile);
        }
      });
    } else {
      res.status(404);
      res.end();
    }
  });

  /**
   * GET route on /:rid/job-report.{html|json}
   * Used to get a report file
   */
  app.get(new RegExp(jobidPattern + '/job-report\\.(html|json)$'), function (req, res) {
    var requestID  = req.params[0];
    var format     = req.params[1];
    var logPath    = __dirname + '/../tmp/jobs/'
    + requestID.charAt(0) + '/'
    + requestID.charAt(1) + '/'
    + requestID;
    var reportFile = logPath + '/report.json';
    if (fs.existsSync(reportFile)) {
      switch (format) {
      case 'json':
        res.sendfile('report.json', {root: logPath}, function (err) {
          if (err) {
            res.status(500);
            res.end();
          }
        });
        break;
      case 'html':
        var report = require(reportFile);
        var title = "Rapport d'exécution";
        if (report.general && report.general['Job-Date']) {
          moment.lang('fr');
          title += " du " + moment(report.general['Job-Date']).format('DD MMMM YYYY (hh[h]mm)');
        }
        title += ' - ezPAARSE';
        // Rapport d’exécution du 5 juin 2013 (11h25) - ezPAARSE
        res.render('report', { report: report, title: title });
        break;
      }
    } else {
      res.status(404);
      res.end();
    }
  });
};