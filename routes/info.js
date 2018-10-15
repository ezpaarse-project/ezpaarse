// ##EZPAARSE

'use strict';

var fs         = require('fs-extra');
var path       = require('path');
var uuid       = require('uuid');
var parserlist = require('../lib/parserlist.js');
var git        = require('../lib/git-tools.js');
var config     = require('../lib/config.js');
var pkg        = require('../package.json');
var trello     = require('../lib/trello-analogist.js');

var statusCodes = require(path.join(__dirname, '/../statuscodes.json'));

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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    trello.getCertifications(function (certifications) {
      var status = req.query.status;

      var platformsFolder = path.join(__dirname, '/../platforms');

      fs.readdir(platformsFolder, function (err, folders) {
        if (err) { return res.status(500).end(); }

        var kbartReg  = /(.*)_([0-9]{4}-[0-9]{2}-[0-9]{2})\.txt$/;
        var platforms = [];
        var i = 0;

        var countEntries = function (file, callback) {
          var count  = 0;
          var stream = fs.createReadStream(file);
          var buffer = '';

          stream.on('error', function (err) { callback(err, 0); });
          stream.on('readable', function () {
            var data = stream.read();
            if (!data) { return; }

            buffer += data.toString();

            var index = buffer.indexOf('\n');

            while (index >= 0) {
              if (buffer.substr(0, index).trim().length > 0) { count++; }
              buffer = buffer.substr(++index);
              index  = buffer.indexOf('\n');
            }
          });
          stream.on('end', function () { callback(null, Math.max(--count, 0)); });
        };

        var getPkbPackages = function (pkbDir, callback) {
          fs.readdir(pkbDir, function (err, files) {
            if (err && err.code != 'ENOENT') { return callback(err); }

            files = files || [];
            var dates = {};

            (function nextFile(cb) {

              var file = files.pop();
              if (!file) { return cb(); }

              var match = kbartReg.exec(file);
              if (!match) { return nextFile(cb); }

              var pkg  = match[1];
              var date = match[2];

              countEntries(path.join(pkbDir, file), function (err, count) {
                if (!dates[pkg] || dates[pkg].date < date) {
                  dates[pkg] = { date: date, entries: 0 };
                }

                dates[pkg].entries += count;

                nextFile(cb);
              });
            })(function () {

              var packages = [];

              for (var i in dates) {
                packages.push({
                  name: i,
                  date: dates[i].date,
                  entries: dates[i].entries
                });
              }

              callback(null, packages);
            });

          });
        };

        (function readNextDir(callback) {
          var folder = folders[i++];

          if (!folder) { return callback(); }
          if (folder == 'js-parser-skeleton') { return readNextDir(callback); }

          var configFile = path.join(platformsFolder, folder, 'manifest.json');
          var parserFile = path.join(platformsFolder, folder, 'parser.js');

          fs.exists(parserFile, function (exists) {
            if (!exists) { return readNextDir(callback); }

            fs.readFile(configFile, function (err, content) {
              if (err) { return readNextDir(callback); }

              var manifest;
              try {
                manifest = JSON.parse(content);
                var match = /^http:\/\/([a-z.]+)\/platforms\/([a-z0-9]+)$/i.exec(manifest.docurl);
                if (match !== null) {
                  if (certifications[match[2]]) {
                    manifest.certifications = certifications[match[2]];
                  }
                }
              } catch (e) {
                return readNextDir(callback);
              }

              if (!manifest.name || (status && manifest.status != status)) {
                return readNextDir(callback);
              }

              getPkbPackages(path.join(platformsFolder, folder, 'pkb'), function (err, packages) {
                if (!err) { manifest['pkb-packages'] = packages; }

                platforms.push(manifest);
                readNextDir(callback);
              });

            });
          });
        })(function () {
          res.status(200).json(platforms);
        });
      });
    });

    /**
     * GET route on /info/fields.json
     */
    app.get(/^\/info\/(fields|rid|mime|rtype)(?:\.json)?$/, function (req, res) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');

      var file = path.join(__dirname, '/../platforms/fields.json');

      fs.readFile(file, function (err, content) {
        if (err) { return res.status(500).end(); }

        var name = req.params[0];
        if (name == 'fields') {
          return res.status(200).json(content);
        }

        try {
          content = JSON.parse(content)[name];
        } catch (e) {
          return res.status(500).end();
        }

        if (req.query.sort) {
          content.sort(function (a, b) {
            var comp = a.code < b.code ? -1 : 1;
            if (req.query.sort === 'desc') { comp *= -1; }
            return comp;
          });
        }

        res.status(200).json(content);
      });
    });
  });

  /**
   * GET route on /info/config
   */
  app.get('/info/config', function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    var cfg = {};
    var fieldsToReturn = [
      'EZPAARSE_IGNORED_DOMAINS'
    ];
    fieldsToReturn.forEach(function (field) {
      cfg[field] = config[field];
    });
    res.status(200).json(cfg);
  });

  /**
   * GET route on /info/codes
   */
  app.get('/info/codes', function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    res.status(200).json(statusCodes);
  });

  /**
   * GET route on /info/codes/:number
   */
  app.get(/\/info\/codes\/([0-9]+)$/, function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    var code = req.params[0];

    if (statusCodes[code]) {
      res.status(200).json(statusCodes[code]);
    } else {
      res.status(404).end();
    }
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
    var settingsFile = path.join(__dirname, '/../resources/predefined-settings.json');

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
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        res.status(200).json(settings);
      });
    });
  });

  /**
   * GET route on /info/domains/unknown
   */
  app.get('/info/domains/unknown', function (req, res) {
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    fs.readFile(path.join(__dirname, '../domains.miss.csv'), function (err, data) {
      if (err) { return res.status(err.code == 'ENOENT' ? 404 : 500).end(); }

      res.status(200).send(data);
    });
  });

  /**
   * GET route on /info/domains/:domain:
   */
  app.get(/\/info\/domains\/([a-zA-Z0-9\-.]+)/, function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    var domain = req.params[0];
    var parser = parserlist.get(domain, false);

    if (!parser) { return res.status(404).end(); }

    var manifestFile = path.join(__dirname, '/../platforms/' + parser.platform + '/manifest.json');
    fs.readFile(manifestFile, function (err, data) {
      if (err) { return res.status(err.code == 'ENOENT' ? 404 : 500).end(); }

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
};