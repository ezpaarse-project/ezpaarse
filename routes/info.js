// ##EZPAARSE

/*jshint maxlen: 180*/
'use strict';

var fs         = require('graceful-fs');
var path       = require('path');
var uuid       = require('uuid');
var pp         = require('../lib/platform-parser.js');
var parserlist = require('../lib/parserlist.js');
var git        = require('../lib/git-tools.js');
var config     = require('../lib/config.js');
var pkg        = require('../package.json');

module.exports = function (app) {

  /**
   * GET route on /info/version
   */
  app.get('/info/version', function (req, res) {
    if (pkg.version) {
      res.status(200).send(pkg.version);
    } else {
      res.status(500).end();
    }
  });

  /**
   * GET route on /info/platforms
   */
  app.get('/info/platforms/changed', function (req, res) {
    git.changed({ cwd: path.join(__dirname, '../platforms') }, function (err, files) {
      if (err) { return res.status(500).end(); }

      var changed = {};

      files.forEach(function (file) {
        var members = file.split('/');

        if (members.length < 2) { return; }

        var platform = members.shift();

        if (platform.charAt(0) == '.' || platform == 'js-parser-skeleton') { return; }
        if (!changed[platform]) { changed[platform] = []; }

        changed[platform].push(members.join('/'));
      });

      res.status(200).json(changed);
    });
  });

  /**
   * GET route on /info/platforms
   */
  app.get('/info/platforms', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var status = req.param('status', null);

    var platformsFolder = path.join(__dirname, '/../platforms');

    fs.readdir(platformsFolder, function (err, folders) {
      if (err) { return res.status(500).end(); }

      var platforms = {};
      var i = 0;

      (function readNextDir(callback) {
        var folder = folders[i++];

        if (!folder) { return callback(); }
        if (folder == 'js-parser-skeleton') { return readNextDir(callback); }

        var configFile = path.join(platformsFolder, folder, 'manifest.json');
        var parser = pp.getParser(folder);

        if (!parser || !parser.path) { return readNextDir(callback); }

        fs.readFile(configFile, function (err, content) {
          if (err) { return readNextDir(callback); }

          var manifest;
          try {
            manifest = JSON.parse(content);
          } catch (e) {
            return readNextDir(callback);
          }

          if (!manifest.name || (status && manifest.status != status)) {
            return readNextDir(callback);
          }

          manifest.uptodate = true;
          platforms[manifest.name] = manifest;
          readNextDir(callback);
        });
      })(function () {
        res.status(200).json(platforms);
      });
    });
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
    res.status(200).json(cfg);
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
    res.status(200).send(uuid.v1());
  });

  /**
   * GET route on /info/predefined-settings
   */
  app.get('/info/predefined-settings', function (req, res) {
    var settingsFile = path.join(__dirname, '/../predefined-settings.json');

    fs.exists(settingsFile, function (exists) {
      if (!exists) {
        res.status(404).end();
        return;
      }

      fs.readFile(settingsFile, function (err, data) {
        var settings;
        try {
          settings = JSON.parse(data);
        } catch (e) {
          res.status(500).end();
          return;
        }

        res.header('Content-Type', 'application/json; charset=utf-8');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.status(200).json(settings);
      });
    });
  });

  /**
   * GET route on /info/domains/:domain:
   */
  app.get(/\/info\/domains\/([a-zA-Z0-9\-\.]+)/, function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var domain = req.params[0];
    var parser = parserlist.get(domain);
    if (parser) {
      var manifestFile = path.join(__dirname, '/../platforms/' + parser.platform + '/manifest.json');
      fs.exists(manifestFile, function (exists) {
        if (!exists) {
          res.status(404).end();
          return;
        }

        fs.readFile(manifestFile, function (err, data) {
          var manifestJSON;
          try {
            manifestJSON = JSON.parse(data);
          } catch (e) {
            res.status(500).end();
            return;
          }
          parser.manifest = manifestJSON;
          res.status(200).json(parser);
        });
      });
    } else {
      res.status(404).end();
    }
  });

  /**
   * GET route on /info/usage
   */
  app.get('/info/usage.json', function (req, res) {
    var usageFile = path.join(__dirname, '/../usage.json');

    fs.exists(usageFile, function (exists) {
      if (!exists) {
        res.status(404).end();
        return;
      }

      fs.readFile(usageFile, function (err, data) {
        var usage;
        try {
          usage = JSON.parse(data);
        } catch (e) {
          res.status(500).end();
          return;
        }

        res.header('Content-Type', 'application/json; charset=utf-8');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.status(200).json(usage);
      });
    });
  });
};