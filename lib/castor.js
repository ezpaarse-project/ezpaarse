'use strict';

const { Router } = require('express');
const app = Router();

const { debounce } = require('lodash');
const path   = require('path');
const io     = require('./socketio.js').io;
const config = require('./config.js');
const logger = require('./logger.js');

const { CSV2Mongo } = require('./csv2mongo');

const platformsRoot = path.resolve(__dirname, '../platforms');

let state = {
  state: 'idle',
  remaining: 0,
  synchronizing: [],
};

const concurrency = Number.parseInt(config.EZPAARSE_PKB_SYNC_CONCURRENCY, 10) || 2;

const emitUpdate = debounce(() => {
  io()?.emit?.('castor:update', state);
}, 500, { maxWait: 1000 });

const csv2mongo = new CSV2Mongo({
  mongoUrl: config.EZPAARSE_MONGO_URL,
  concurrency,
  collection: {
    name: 'pkbs',
    indices: [
      '_platform',
      'content.title_id',
      'content.print_identifier',
      'content.online_identifier',
      'content.doi',
    ],
  },
  repository: {
    cwd: platformsRoot,
    globs: ['*/pkb/*.txt'],
    ignore: ['**/*.miss.txt', '.git', '.lib'],
    removeEmptyFields: true,
    csvParseOptions: {
      delimiter: '\t',
      columns: true,
      relaxColumnCount: true,
      skipEmptyLines: true,
      relaxQuotes: true,
    },
    docModifier: function (doc) {
      return {
        ...doc,
        _platform: path.relative(platformsRoot, doc.location).split(path.sep)[0],
      };
    },
  },
  onCleanUp: function ({ deletedCount }) {
    logger.verbose(`[PKB] Cleaned up ${deletedCount} old documents.`);
  },
  onSyncStart: function ({ filePath }) {
    logger.verbose(`[PKB] Syncing ${filePath}...`);
  },
  onComplete: function ({ took }) {
    logger.info(`[PKB] Sync complete in ${took} seconds.`);
  },
  onChange: function (syncList, synchronizing) {
    const remaining = syncList.length + synchronizing.size;
    logger.verbose(`[PKB] Synchronizing | Remaining: ${remaining}`);

    state = {
      state: remaining > 0 ? 'synchronizing' : 'synchronized',
      remaining,
      synchronizing: Array.from(synchronizing),
    };

    emitUpdate();
  },
  onError: function (err) {
    logger.error(`[PKB] Error: ${err.stack}`);
  },
});

app.get('/status', function (req, res) {
  res.status(200).send(state);
});

module.exports = {
  app,
  start() {
    csv2mongo.scan().catch(err => {
      state = {
        state: 'unavailable',
        remaining: 0,
        synchronizing: [],
        error: err,
      };
      logger.error(`[PKB] Error: ${err.stack}`);
    });
  },
};