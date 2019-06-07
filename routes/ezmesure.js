'use strict';

const Boom       = require('boom');
const path       = require('path');
const bodyParser = require('body-parser');
const fs         = require('fs-extra');
const ezmesure   = require('ezmesure');

const { Router } = require('express');
const app = Router();

app.post('/:jobId', bodyParser.json(), (req, res, next) => {
  const { indice, options } = req.body;
  const jobId = req.params.jobId;
  const jobDir = path.resolve(__dirname, '../tmp/jobs/', jobId.charAt(0), jobId.charAt(1), jobId);

  if (!indice) {
    return next(Boom.badRequest('missing mandatory field: indice'));
  }

  if (!options || !options.token) {
    return next(Boom.badRequest('missing mandatory field: options.token'));
  }

  fs.readdir(jobDir, function (err, files) {
    if (err) {
      return next(err.code === 'ENOENT' ? Boom.notFound() : err);
    }

    const reg = /.*\.job-ecse(\.[a-z]+){1,2}$/;
    const filename = files.find(name => reg.test(name));

    if (!filename) {
      return next(Boom.notFound('no result file found'));
    }

    if (!filename.endsWith('.csv')) {
      return next(Boom.notAcceptable('invalid result type : result file should be a CSV'));
    }

    const stream = fs.createReadStream(path.resolve(jobDir, filename));

    ezmesure.indices.insert(stream, indice, options).then((result) => {
      res.status(200);
      res.json(result);
    }).catch(next);
  });
});

module.exports = app;
