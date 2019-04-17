// ##EZPAARSE

'use strict';

const fs             = require('fs-extra');
const path           = require('path');
const uuid           = require('uuid');
const Boom           = require('boom');
const bodyParser     = require('body-parser');
const parserlist     = require('../lib/parserlist.js');
const git            = require('../lib/git-tools.js');
const config         = require('../lib/config.js');
const pkg            = require('../package.json');
const trello         = require('../lib/trello-analogist.js');
const customSettings = require('../lib/custom-predefined-settings.js');
const auth           = require('../lib/auth-middlewares.js');

const statusCodes = require(path.join(__dirname, '/../statuscodes.json'));

const { Router } = require('express');
const app = Router();

/**
* GET route on /info/version
*/
app.get('/version', function (req, res, next) {
  if (!pkg.version) {
    return next(Boom.badImplementation());
  }
  res.status(200).end(pkg.version);
});

/**
* GET route on /info/app
*/
app.get('/app', function (req, res, next) {
  let time = Math.floor(process.uptime());

  const tmp = (time / 3600);
  const days = Math.floor(tmp / 24);
  const hours = Math.floor(tmp % 24);
  const minutes = Math.floor((time / 60) % 60);
  const seconds = (time % 60);

  if (!pkg.version) {
    return next(Boom.badImplementation());
  }

  res.status(200).json({
    version: pkg.version,
    uptime: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    demo: config.EZPAARSE_DEMO || false
  });
});

/**
* GET route on /info/platforms
*/
app.get('/platforms/changed', function (req, res, next) {
  git.changed({ cwd: path.join(__dirname, '../platforms') }, function (err, files) {
    if (err) { return next(err); }

    const changed = {};

    files.forEach(function (file) {
      const members = file.split('/');

      if (members.length < 2) { return; }

      const platform = members.shift();

      if (platform.charAt(0) === '.' || platform === 'js-parser-skeleton') { return; }
      if (!changed[platform]) { changed[platform] = []; }

      changed[platform].push(members.join('/'));
    });

    res.status(200).json(changed);
  });
});

/**
* GET route on /info/platforms
*/
app.get('/platforms', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  trello.getCertifications(function (certifications) {
    const status = req.query.status;

    const platformsFolder = path.resolve(__dirname, '../platforms');

    fs.readdir(platformsFolder, function (err, folders) {
      if (err) { return next(err); }

      const kbartReg  = /(.*)_([0-9]{4}-[0-9]{2}-[0-9]{2})\.txt$/;
      const platforms = [];
      let i = 0;

      const countEntries = function (file, callback) {
        const stream = fs.createReadStream(file);
        let count  = 0;
        let buffer = '';

        stream.on('error', function (err) { callback(err, 0); });
        stream.on('readable', function () {
          const data = stream.read();
          if (!data) { return; }

          buffer += data.toString();

          let index = buffer.indexOf('\n');

          while (index >= 0) {
            if (buffer.substr(0, index).trim().length > 0) { count++; }
            buffer = buffer.substr(++index);
            index  = buffer.indexOf('\n');
          }
        });
        stream.on('end', function () { callback(null, Math.max(--count, 0)); });
      };

      const getPkbPackages = function (pkbDir, callback) {
        fs.readdir(pkbDir, function (err, files) {
          if (err && err.code != 'ENOENT') { return callback(err); }

          files = files || [];
          const dates = {};

          (function nextFile(cb) {

            const file = files.pop();
            if (!file) { return cb(); }

            const match = kbartReg.exec(file);
            if (!match) { return nextFile(cb); }

            const pkg  = match[1];
            const date = match[2];

            countEntries(path.join(pkbDir, file), function (err, count) {
              if (!dates[pkg] || dates[pkg].date < date) {
                dates[pkg] = { date: date, entries: 0 };
              }

              dates[pkg].entries += count;

              nextFile(cb);
            });
          })(function () {

            const packages = [];

            for (const i in dates) {
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
        const folder = folders[i++];

        if (!folder) { return callback(); }
        if (folder == 'js-parser-skeleton') { return readNextDir(callback); }

        const configFile = path.join(platformsFolder, folder, 'manifest.json');
        const parserFile = path.join(platformsFolder, folder, 'parser.js');

        fs.exists(parserFile, function (exists) {
          if (!exists) { return readNextDir(callback); }

          fs.readFile(configFile, function (err, content) {
            if (err) { return readNextDir(callback); }

            let manifest;
            try {
              manifest = JSON.parse(content);
              const match = /^http:\/\/([a-z.]+)\/platforms\/([a-z0-9]+)$/i.exec(manifest.docurl);
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
app.get(/^\/(fields|rid|mime|rtype)(?:\.json)?$/, function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  const file = path.join(__dirname, '/../platforms/fields.json');

  fs.readFile(file, function (err, content) {
    if (err) { return next(err); }

    const name = req.params[0];
    if (name == 'fields') {
      return res.status(200).json(content);
    }

    try {
      content = JSON.parse(content)[name];
    } catch (e) {
      return next(e);
    }

    if (req.query.sort) {
      content.sort(function (a, b) {
        let comp = a.code < b.code ? -1 : 1;
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

  const cfg = {};
  const fieldsToReturn = [
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
app.get(/\/codes\/([0-9]+)$/, function (req, res, next) {
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  const code = req.params[0];

  if (statusCodes[code]) {
    res.status(200).json(statusCodes[code]);
  } else {
    return next(Boom.notFound());
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
* GET route on /info/countries.json
*/
app.get('/countries.json', function (req, res, next) {
  const countriesFile = path.resolve(__dirname, '../resources/countries.json');

  fs.readFile(countriesFile, function (err, data) {
    if (err) {
      return next(err.code === 'ENOENT' ? Boom.notFound() : err);
    }

    let countries;
    try {
      countries = JSON.parse(data);
    } catch (e) {
      return next(e);
    }

    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.status(200).json(countries);
  });
});

/**
* GET route on /info/predefined-settings
*/
app.get('/predefined-settings', function (req, res, next) {
  const settingsFile = path.join(__dirname, '/../resources/predefined-settings.json');

  fs.readFile(settingsFile, function (err, data) {
    if (err) {
      return next(err.code === 'ENOENT' ? Boom.notFound() : err);
    }

    let settings;
    try {
      settings = JSON.parse(data);
    } catch (e) {
      return next(e);
    }

    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.status(200).json(settings);
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
      return Boom.badRequest('no_settings_set');
    }

    customSettings.insert(settings)
      .then(() => res.status(200).end())
      .catch(err => {
        next(err.message === 'already_exists' ? Boom.conflict('already_exists') : err);
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
      return next(Boom.badRequest('missing_fields', { fields: errors }));
    }

    customSettings.updateOne(id, settings)
      .then(() => res.status(200).end())
      .catch(err => {
        next(err.message === 'already_exists' ? Boom.conflict('already_exists') : err);
      });
  });

app.delete('/predefined-settings/custom/:id',
  auth.ensureAuthenticated(true),
  function (req, res, next) {
    const id = req.params.id;
    if (!id) {
      return next(Boom.badRequest('unknown_id'));
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
