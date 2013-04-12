/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs = require('fs');

module.exports = function (app) {
  
  /**
   * GET route on /logs/:rid/:logfile
   * Used to get a logfile
   */
  app.get(/^\/logs\/([a-zA-Z0-9\-]+)\/([a-zA-Z]+\.log)$/, function (req, res) {
    var folder  = __dirname + '/../tmp/logs/' + req.params[0];
    var logFile = folder + '/' + req.params[1];
    if (fs.existsSync(logFile)) {
      res.sendfile(req.params[1], {root: folder}, function (err) {
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