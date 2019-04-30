'use strict';

const fs     = require('fs-extra');
const path   = require('path');
const moment = require('moment');
const Boom   = require('boom');
const ejs   = require('ejs');

const { Router } = require('express');
const app = Router();

const jobidPattern = '^/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})';

const reportTemplate = `
<html>
  <head>
    <title><%= title %></title>
    <style type="text/css">
      table { border-collapse: collapse; margin-top: 20px; }
      td, th { border: 1px solid black; padding: 4px; min-width: 50px; text-align: left; }
      th { background-color: #B8E5FF; }
      td:first-child { background-color: #DCF1FD; }
    </style>
  </head>
  <body>
    <h1>Rapport d'exécution</h1>
    <table class="table table-bordered table-hover">
    <% for (let group in report) { %>
      <tr><th colspan="2"><%= group[0].toUpperCase() + group.substring(1) %></th></tr>

      <% for (let key in report[group]) { %>
      <tr id="<%= key %>">
        <td><%= key %></td>
        <% if (/^http/.test(report[group][key])) { %>
          <td><a href="<%= report[group][key] %>"><%= report[group][key] %></a></td>
        <% } else { %>
          <td><%= report[group][key] %></td>
        <% } %>
      </tr>
      <% } %>
    <% } %>
    </table>
  </body>
</html>
`;

/**
* GET route on /:rid/job-report.{html|json}
* Used to get a report file
*/
app.get(new RegExp(jobidPattern + '/job-report\\.(html|json)$'), function (req, res, next) {
  const requestID  = req.params[0];
  const format     = req.params[1];
  const reportFile = path.join(__dirname, '/../tmp/jobs/',
    requestID.charAt(0),
    requestID.charAt(1),
    requestID,
    'report.json'
  );

  fs.exists(reportFile, function (exists) {
    if (!exists) {
      return next(Boom.notFound());
    }

    switch (format) {
    case 'json':
      res.download(reportFile, requestID.substr(0, 8) + '_report.json');
      break;

    case 'html':
      fs.readFile(reportFile, function (err, data) {
        if (err) { return next(err); }

        let report;

        try {
          report = JSON.parse(data);
        } catch (e) {
          return next(err);
        }

        let title = 'Execution report';
        if (report.general && report.general['Job-Date']) {
          const jobDate = moment(report.general['Job-Date']).format('DD-MM-YYYY hh[h]mm');
          title += ` (${jobDate})`;
        }
        title += ' - ezPAARSE';
        // Execution report (25-06-2013 11h25) - ezPAARSE
        res.send(ejs.render(reportTemplate, { report, title }));
      });
      break;

    default:
      return next(Boom.notAcceptable());
    }
  });
});

/**
* GET route on /:rid/:logfile
* Used to get a logfile
*/
app.get(new RegExp(jobidPattern + '/([a-zA-Z0-9\\-_]+(?:\\.[a-z]{2,4}){1,2})$'),
  function (req, res, next) {
    const requestID = req.params[0];
    const filename  = req.params[1];
    const logFile   = path.join(__dirname, '/../tmp/jobs/',
      requestID.charAt(0),
      requestID.charAt(1),
      requestID,
      filename
    );

    fs.stat(logFile, function (err, stats) {
      if (err) {
        return next(err.code == 'ENOENT' ? Boom.notFound() : err);
      }

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

module.exports = app;
