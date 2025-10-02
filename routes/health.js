'use strict';

const { Router } = require('express');
const app = Router();

const mongo = require('../lib/mongo.js');

/**
 * heatlh
 */
app.get('/health', async function (req, res, next) {
  try {
    const result = await Promise.race([
      mongo.serverStatus(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout after 10000ms')), 10000)
      )
    ]);
    if (result.ok !== 1) {
      return res.status(503).send('MongoDB is not available');
    }
  } catch (err) {
    return res.status(503).send('MongoDB is not available');
  }

  res.status(204).end();
});


module.exports = app;