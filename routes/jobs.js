'use strict';

const bodyParser = require('body-parser');
const auth       = require('../lib/auth-middlewares.js');
const treatment  = require('../lib/treatment.js');

const { Router } = require('express');
const app = Router();

app.get('/:userId', (req, res, next) => {
  treatment.findAll(req.params.userId, (err, result) => {
    if (err) return next(err);

    return res.json(result);
  });
});

app.post('/', bodyParser.urlencoded({ extended: true }), bodyParser.json(),
  auth.ensureAuthenticated(true), (req, res, next)  => {
    if (!req.body.userId || !req.body.uuid) return next('No body set');

    treatment.insert(req.body.userId, req.body.uuid, (err, result) => {
      if (err || !result) return next(err);

      return res.status(200).json(result);
    });
  });

module.exports = app;
