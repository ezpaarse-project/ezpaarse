/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs = require('fs');

module.exports = function (app) {
  
  /**
   * GET route on /logs/:rid/:logfile
   * Used to get a logfile
   */
  app.get(/^\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/([a-zA-Z\-]+\.log)$/,
    function (req, res) {
    var requestID = req.params[0];
    var logPath   = __dirname + '/../tmp/jobs/'
    + requestID.charAt(0) + '/'
    + requestID.charAt(1) + '/'
    + requestID;
    var logFile = logPath + '/' + req.params[1];
    if (fs.existsSync(logFile)) {
      res.sendfile(req.params[1], {root: logPath}, function (err) {
        if (err) {
          res.status(500);
          res.end();
        }
      });
    } else {
      res.status(404);
      res.end();
    }
  });
};