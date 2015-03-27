'use strict';

var fs     = require('graceful-fs');
var path   = require('path');
var moment = require('moment');

module.exports = function (app) {

  var jobidPattern = '^/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})';

  /**
   * GET route on /:rid/job-report.{html|json}
   * Used to get a report file
   */
  app.get(new RegExp(jobidPattern + '/job-report\\.(html|json)$'), function (req, res) {
    var requestID  = req.params[0];
    var format     = req.params[1];
    var reportFile = path.join(__dirname, '/../tmp/jobs/',
    requestID.charAt(0),
    requestID.charAt(1),
    requestID,
    'report.json');

    fs.exists(reportFile, function (exists) {
      if (!exists) {
        res.status(404);
        res.end();
        return;
      }

      switch (format) {
      case 'json':
        res.download(reportFile, requestID.substr(0, 8) + '_report.json');
        break;
      case 'html':
        fs.readFile(reportFile, function (err, data) {
          if (err) {
            res.status(500);
            res.end();
            return;
          }
          var report = {};
          try {
            report = JSON.parse(data);
          } catch (e) {
            res.status(500).end();
          }
          var title = "Rapport d'exécution";
          if (report.general && report.general['Job-Date']) {
            title += " (" + moment(report.general['Job-Date']).format('DD-MM-YYYY hh[h]mm') + ')';
          }
          title += ' - ezPAARSE';
          // Rapport d’exécution (25-06-2013 11h25) - ezPAARSE
          res.render('report-standalone', { report: report, title: title });
        });
        break;
      default:
        res.status(406);
        res.end();
      }
    });
  });

  /**
   * GET route on /:rid/:logfile
   * Used to get a logfile
   */
  app.get(new RegExp(jobidPattern + '/([a-zA-Z0-9\\-_]+(?:\\.[a-z]{2,4}){1,2})$'),
    function (req, res) {
    var requestID = req.params[0];
    var filename  = req.params[1];
    var logFile   = path.join(__dirname, '/../tmp/jobs/',
      requestID.charAt(0),
      requestID.charAt(1),
      requestID,
      filename);

    fs.stat(logFile, function (err, stats) {
      if (err) { return res.status(err.code == 'ENOENT' ? 404 : 500).end(); }

      // download as an attachment if file size is >500ko
      // open it in directly in the browser if file size is <500ko
      if (stats.size > 500 * 1024) {
        res.download(logFile, requestID.substr(0, 8) + '_' + filename);
      } else {
        res.set('Content-Disposition', 'inline');
        res.sendFile(logFile);
      }
    });
  });
};
