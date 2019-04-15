// ##EZPAARSE

'use strict';

var fs             = require('fs-extra');
var path           = require('path');
var uuid           = require('uuid');
var parserlist     = require('../lib/parserlist.js');
var git            = require('../lib/git-tools.js');
var config         = require('../lib/config.js');
var pkg            = require('../package.json');
var trello         = require('../lib/trello-analogist.js');
var customSettings = require('../lib/custom-predefined-settings.js');
var bodyParser     = require('body-parser');
var auth           = require('../lib/auth-middlewares.js');

var statusCodes = require(path.join(__dirname, '/../statuscodes.json'));

var { Router } = require('express');
var app = Router();

/**
* GET route on /info/version
*/
app.get('/version', function (req, res) {
  if (pkg.version) {
    res.status(200).end(pkg.version);
  } else {
    res.status(500).end();
  }
});

/**
* GET route on /info/app
*/
app.get('/app', function (req, res) {
  let time = Math.floor(process.uptime());

  const tmp = (time / 3600);
  const days = Math.floor(tmp / 24);
  const hours = Math.floor(tmp % 24);
  const minutes = Math.floor((time / 60) % 60);
  const seconds = (time % 60);

  if (pkg.version) {
    res.status(200).json({
      version: pkg.version,
      uptime: `${days}d ${hours}h ${minutes}m ${seconds}s`,
      demo: config.EZPAARSE_DEMO || false
    });
  } else {
    res.status(500).end();
  }
});

/**
* GET route on /info/platforms
*/
app.get('/platforms/changed', function (req, res) {
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
app.get('/platforms', function (req, res) {
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
});

/**
* GET route on /info/fields.json
*/
app.get(/^\/(fields|rid|mime|rtype)(?:\.json)?$/, function (req, res) {
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

/**
* GET route on /info/config
*/
app.get('/config', function (req, res) {
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
app.get('/codes', function (req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  res.status(200).json(statusCodes);
});

/**
* GET route on /info/codes/:number
*/
app.get(/\/codes\/([0-9]+)$/, function (req, res) {
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
app.get('/uuid', function (req, res) {
  res.header('Content-Type', 'text/plain');
  res.status(200).send(uuid.v1());
});

/**
* GET route on /info/countries
*/
app.get('/countries', function (req, res) {
  var settingsFile = path.join(__dirname, '/../resources/countries.json');

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
* GET route on /info/predefined-settings
*/
app.get('/predefined-settings', function (req, res) {
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

app.get('/predefined-settings/custom', function (req, res, next) {
  customSettings.getAll()
    .then(settings => res.status(200).json(settings))
    .catch(next);
});

app.post('/predefined-settings/custom',
  bodyParser.json(),
  auth.ensureAuthenticated(true),
  function (req, res, next) {
    const settings = req.body.settings;

    if (!settings) {
      return res.status(406).json({ status: 406, message: 'no_settings_set' });
    }

    customSettings.insert(settings)
      .then(() => res.status(200).end())
      .catch(err => {
        if (err.message === 'already_exists') {
          err.status = 409;
        }
        next(err);
      });
  });

app.put('/predefined-settings/custom/:id',
  bodyParser.json(),
  auth.ensureAuthenticated(true),
  function (req, res, next) {
    const id = req.params.id;
    const settings = req.body.settings;

    const errors = [];
    if (!id) { errors.push('id'); }
    if (!settings) { errors.push('settings'); }

    if (errors.length > 0) {
      return res.status(406).json({ status: 406, fields: errors });
    }

    customSettings.updateOne(id, settings)
      .then(() => res.status(200).end())
      .catch(err => {
        if (err.message === 'already_exists') {
          err.status = 409;
        }
        next(err);
      });
  });

app.delete('/predefined-settings/custom/:id',
  auth.ensureAuthenticated(true),
  function (req, res, next) {
    const id = req.params.id;
    if (!id) {
      return res.status(406).json({ status: 406, message: 'unknown_id' });
    }

    customSettings.delete(id)
      .then(() => res.status(204).end())
      .catch(next);
  });

/**
* GET route on /info/domains/:domain:
*/
app.get(/\/domains\/([a-zA-Z0-9\-.]+)/, function (req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  const domain  = req.params[0];
  const parsers = parserlist.get(domain, false);

  if (!Array.isArray(parsers)) {
    return res.status(200).json([]);
  }

  res.status(200).json(parsers);
});

module.exports = app;
