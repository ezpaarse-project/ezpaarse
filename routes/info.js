/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var fs = require('fs');

module.exports = function (app) {
  
  /**
   * GET route on /info/platforms
   */
  app.get('/info/platforms', function (req, res) {
    res.type('application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.status(200);

    var status  = req.param('status', null);
    var sort    = req.param('sort', null);

    var delimiter       = '';
    var platformsFolder = __dirname + '/../platforms';
    var cfgFilename     = 'manifest.json';
    var folders         = fs.readdirSync(platformsFolder);

    if (sort) {
      folders.sort();
      if (sort == 'desc') {
        folders.reverse();
      }
    }
    res.write('[');

    for (var i in folders) {
      var folder      = folders[i];
      var configFile  = platformsFolder + '/' + folder + '/' + cfgFilename;
      var parserFile  = platformsFolder + '/' + folder + '/parser';

      var configExists = fs.existsSync(configFile) && fs.statSync(configFile).isFile();
      var parserExists = fs.existsSync(parserFile) && fs.statSync(parserFile).isFile();
      if (configExists && parserExists) {
        var config = require(configFile);
        if (!status || config.status == status) {
          var platform      = {};
          platform.longname = config.longname;
          platform.version  = config.version;
          platform.status   = config.status;
          platform.contact  = config.contact;
          platform.describe = config.describe;
          platform.docurl   = config.docurl;
          platform.recognize   = config.recognize;
          res.write(delimiter + JSON.stringify(platform, null, 2));
          if (delimiter === '') { delimiter = ','; }
        }
      }
    }

    res.write(']');
    res.end();
  });

  /**
   * GET route on /info/ectypes
   */
  app.get('/info/ectypes', function (req, res) {
    res.type('application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var file = __dirname + '/../platforms/ectypes.json';
    if (fs.existsSync(file)) {
      var types = require(file);
      res.status(200);
      res.write(JSON.stringify(types, null, 2));
    } else {
      res.status(500);
    }
    res.end();
  });

  /**
   * GET route on /info/codes
   */
  app.get('/info/codes', function (req, res) {
    res.type('application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var file = __dirname + '/../statuscodes.json';
    if (fs.existsSync(file)) {
      var statusCodes = require(file);
      res.status(200);
      res.write(JSON.stringify(statusCodes, null, 2));
    } else {
      res.status(500);
    }
    res.end();
  });

  /**
   * GET route on /info/codes/:number
   */
  app.get(/\/info\/codes\/([0-9]+)$/, function (req, res) {
    res.type('application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var code = req.params[0];
    var file = __dirname + '/../statuscodes.json';
    if (fs.existsSync(file)) {
      var statusCodes = require(file);
      var status = statusCodes[code];
      if (status) {
        res.status(200);
        res.write(JSON.stringify(status, null, 2));
      } else {
        res.status(404);
      }
    } else {
      res.status(500);
    }
    res.end();
  });

  
  app.get('/info/dltest', function (req, res) {
    res.type('text/plain');
    res.header('Content-Disposition', 'attachment; filename=monfichier2.txt');
    res.status(200);
    
    var stopWrite = false;
    function writeDataToRes() {
      if (!stopWrite) {
        res.write('.');
        setTimeout(writeDataToRes, 1);
      }
    }
    writeDataToRes();
    
    setTimeout(function () {
      stopWrite = true;
      res.end();
    }, 30000);
    
  });
  
};