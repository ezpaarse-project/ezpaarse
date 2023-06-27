'use strict';

const Boom       = require('boom');
const bodyParser = require('body-parser');
const auth       = require('../lib/auth-middlewares.js');
const treatment  = require('../lib/treatment.js');

const { Router } = require('express');
const app = Router();

app.get('/:userId', auth.ensureAuthenticated(true), (req, res, next) => {
  treatment.findAllByUser(req.params.userId)
    .then(result => { res.status(200).json(result); })
    .catch(err => next(err));
});

app.get('/', auth.ensureAuthenticated(true), auth.authorizeMembersOf('admin'), (req, res, next) => {
  treatment.findAll()
    .then(result => { res.status(200).json(result); })
    .catch(err => next(err));
});

app.post('/', bodyParser.urlencoded({ extended: true }), bodyParser.json(),
  auth.ensureAuthenticated(true), (req, res, next)  => {
    if (!req.body.userId || !req.body.uuid) { return next(Boom.badRequest('NoBodySet')); }

    treatment.insert(req.body.userId, req.body.uuid)
      .then(result => { res.status(200).json(result); })
      .catch(err => next(err));
  });

module.exports = app;
