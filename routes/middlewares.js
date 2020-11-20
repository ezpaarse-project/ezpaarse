'use strict';

const bodyParser = require('body-parser');
const Boom       = require('boom');
const dbConfig   = require('../lib/db-config');
const auth       = require('../lib/auth-middlewares.js');

const { Router } = require('express');
const app = Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(auth.ensureAuthenticated(true));
app.use(auth.authorizeMembersOf('admin'));

app.post('/', async (req, res, next) => {
  const { middlewares } = req.body;

  if (!middlewares) {
    return next(Boom.internal('missingMiddlewareName'));
  }

  try {
    await dbConfig.update('middlewares', middlewares);
  } catch (e) {
    return next(Boom.internal('middlewaresInsertError'));
  }

  try {
    const result = await dbConfig.getConfig('middlewares');
    return res.json(result).end();
  } catch (e) {
    return next(Boom.internal('middlewaresGetListError'));
  }
});

module.exports = app;