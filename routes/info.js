// ##EZPAARSE

/*jshint maxlen: 180*/
'use strict';

var fs         = require('graceful-fs');
var path       = require('path');
var uuid       = require('uuid');
var pp         = require('../lib/platform-parser.js');
var parserlist = require('../lib/parserlist.js');
var config     = require('../lib/config.js');
var pkg        = require('../package.json');

module.exports = function (app) {

  /**
   * GET route on /info/version
   */
  app.get('/info/version', function (req, res) {
    if (pkg.version) {
      res.send(200, pkg.version);
    } else {
      res.send(500);
    }
  });

  /**
   * GET route on /info/platforms
   */
  app.get('/info/platforms', function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.status(200);

    var status  = req.param('status', null);
    var sort    = req.param('sort', null);

    var delimiter       = '';
    var platformsFolder = path.join(__dirname, '/../platforms');
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
      var configFile  = path.join(platformsFolder, folder, cfgFilename);
      var pFile  = pp.getParser(folder);
      var parserFile = pFile.path;

      var configExists = fs.existsSync(configFile) && fs.statSync(configFile).isFile();
      if (configExists && parserFile !== false) {
        var config = require(configFile);
        if (!status || config.status == status) {
          var platform       = {};
          platform.longname  = config.longname;
          platform.version   = config.version;
          platform.status    = config.status;
          platform.contact   = config.contact;
          platform.describe  = config.describe;
          platform.docurl    = config.docurl;
          platform.recognize = config.recognize;
          res.write(delimiter + JSON.stringify(platform, null, 2));
          if (delimiter === '') { delimiter = ','; }
        }
      }
    }

    res.write(']');
    res.end();
  });

  /**
   * GET route on /info/rtype
   */
  app.get('/info/rtype', function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var file = path.join(__dirname, '/../platforms/rtype.json');
    if (fs.existsSync(file)) {
      var types = require(file);
      res.status(200);
      res.write(JSON.stringify(types, null, 2));
    } else {
      res.status(404);
    }
    res.end();
  });

  /**
   * GET route on /info/config
   */
  app.get('/info/config', function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var cfg = {};
    var fieldsToReturn = [
      'EZPAARSE_REQUIRE_AUTH',
      'EZPAARSE_IGNORED_DOMAINS'
    ];
    fieldsToReturn.forEach(function (field) {
      cfg[field] = config[field];
    });
    res.send(200, JSON.stringify(cfg, null, 2));
  });

  /**
   * GET route on /info/mime
   */
  app.get('/info/mime', function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var file = path.join(__dirname, '/../platforms/mime.json');
    if (fs.existsSync(file)) {
      var types = require(file);
      res.status(200);
      res.write(JSON.stringify(types, null, 2));
    } else {
      res.status(404);
    }
    res.end();
  });

  /**
   * GET route on /info/rid
   */
  app.get('/info/rid', function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var file = path.join(__dirname, '/../platforms/rid.json');
    if (fs.existsSync(file)) {
      var types = require(file);
      res.status(200);
      res.write(JSON.stringify(types, null, 2));
    } else {
      res.status(404);
    }
    res.end();
  });

  /**
   * GET route on /info/codes
   */
  app.get('/info/codes', function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var file = path.join(__dirname, '/../statuscodes.json');
    if (fs.existsSync(file)) {
      var statusCodes = require(file);
      res.status(200);
      res.write(JSON.stringify(statusCodes, null, 2));
    } else {
      res.status(404);
    }
    res.end();
  });

  /**
   * GET route on /info/codes/:number
   */
  app.get(/\/info\/codes\/([0-9]+)$/, function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var code = req.params[0];
    var file = path.join(__dirname, '/../statuscodes.json');
    if (fs.existsSync(file)) {
      var statusCodes = require(file);
      var status      = statusCodes[code];
      if (status) {
        res.status(200);
        res.write(JSON.stringify(status, null, 2));
      } else {
        res.status(404);
      }
    } else {
      res.status(404);
    }
    res.end();
  });

  /**
   * GET a uuid
   */
  app.get('/info/uuid', function (req, res) {
    res.header('Content-Type', 'text/plain');
    res.send(uuid.v1());
  });

  /**
   * GET route on /info/form-predefined
   */
  app.get('/info/form-predefined', function (req, res) {
    var settingsFile = path.join(__dirname, '/../form-predefined.json');

    fs.exists(settingsFile, function (exists) {
      if (!exists) {
        res.send(404);
        return;
      }

      fs.readFile(settingsFile, function (err, data) {
        var settings;
        try {
          settings = JSON.parse(data);
        } catch (e) {
          res.send(500);
          return;
        }

        res.header('Content-Type', 'application/json; charset=utf-8');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.json(200, settings);
      });
    });
  });

  /**
   * GET route on /info/form-predefined
   */
  app.get(/\/info\/domains\/([a-zA-Z0-9\-\.]+)/, function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var domain = req.params[0];
    var parser = parserlist.get(domain);
    if (parser) {
      res.json(200, parser);
    } else {
      res.send(404);
    }
  });

  /**
   * GET route on /info/usage
   */
  app.get('/info/usage.json', function (req, res) {
    var usageFile = path.join(__dirname, '/../usage.json');

    fs.exists(usageFile, function (exists) {
      if (!exists) {
        res.send(404);
        return;
      }

      fs.readFile(usageFile, function (err, data) {
        var usage;
        try {
          usage = JSON.parse(data);
        } catch (e) {
          res.send(500);
          return;
        }

        res.header('Content-Type', 'application/json; charset=utf-8');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.json(200, usage);
      });
    });
  });
};