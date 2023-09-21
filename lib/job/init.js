'use strict';

const fs      = require('fs-extra');
const path    = require('path');
const winston = require('winston');
const mkdirp  = require('mkdirp').mkdirp;
const moment  = require('moment');
const Boom    = require('boom');

const ReportManager  = require('../reportmanager.js');
const StreamHandler  = require('../streamhandler.js');
const customSettings =  require('../custom-predefined-settings');
const dbConfig = require('../db-config');

const config     = require('../config.js');
const io         = require('../socketio.js').io;
const pkg        = require('../../package.json');

const predefFile = path.resolve(__dirname, '../../resources/predefined-settings.json');
const tmpDir     = path.resolve(__dirname, '../../tmp/jobs');
/**
 * Define all job parameters and call start()
 */
module.exports = function* init(req, res, options) {
  const self      = this;
  const jobID     = this.jobID;
  const logPath   = path.resolve(tmpDir, jobID.charAt(0), jobID.charAt(1), jobID);
  const predefKey = req.get('ezPAARSE-Predefined-Settings');

  setDefaultHeaders();
  yield checkJobDirectory(logPath);
  yield setPredefSettings(predefKey);

  const logRoute = `${req.ezBaseURL}/${jobID}`;
  const loglevel = req.header('Traces-Level')
               || (config.EZPAARSE_ENV === 'production' ? 'info' : 'verbose');

  mkdirp.sync(logPath);

  this.saturated = new Set();

  this.addPressure = function (name) {
    self.saturated.add(name);
    if (self.onPause) { self.onPause(); }
  };

  this.removePressure = function (name) {
    self.saturated.delete(name);
    if (self.saturated.size === 0 && self.onResume) { self.onResume(); }
  };

  const baseReport = {
    'general': {
      'ezPAARSE-version': `${pkg.name} ${pkg.version}`,
      'Job-ID': jobID,
      'Job-Date': moment().format(),
      'Job-Done': false,
      'result-file-ecs': logRoute,
      'predefined-settings': predefKey || false,
      'URL-Traces': `${logRoute}/job-traces.log`,
      'URL-Report': `${logRoute}/job-report.json`,
      'nb-ecs': 0,
      'nb-denied-ecs': 0,
      'nb-lines-input': 0,
      'Rejection-Rate': '0 %',
      'Job-Duration': '0 s',
      'process-speed': '0 lignes/s',
      'client-user-agent': req.headers['user-agent']
    },
    'rejets': {
      'nb-lines-ignored':         0,
      'nb-lines-duplicate-ecs':   0,
      'nb-lines-ignored-domains': 0,
      'nb-lines-unknown-domains': 0,
      'nb-lines-unknown-formats': 0,
      'nb-lines-unqualified-ecs': 0,
      'nb-lines-unordered-ecs':   0,
      'nb-lines-ignored-hosts':   0,
      'nb-lines-robots-ecs':      0,
      'nb-lines-unknown-errors':  0,
    },
    'stats': {
      'platforms': 0,
      'mime-PDF':  0,
      'mime-HTML': 0
    }
  };

  const rejectList = new Set([
    'ignored-domains',
    'unknown-domains',
    'unknown-formats',
    'unknown-errors',
    'unqualified-ecs',
    'duplicate-ecs',
    'unordered-ecs',
    'filtered-ecs',
    'ignored-hosts',
    'robots-ecs'
  ]);

  const rejectHeader = (req.header('Reject-Files') || '').toLowerCase();

  this.rejects = rejectHeader === 'all'
    ? Array.from(rejectList)
    : rejectHeader
      .split(',')
      .map(r => r.trim())
      .filter(r => rejectList.has(r));

  this.rejects.forEach(reject => {
    baseReport.rejets[`url-${reject}`] = `${logRoute}/lines-${reject}.log`;
  });

  this.jobPath = logPath; // temp job directory
  this.socket  = io().to(req.header('Socket-ID'));
  this.report  = new ReportManager(path.join(logPath, '/report.json'), {
    baseReport: baseReport,
    socket: this.socket,
    updateThrottle: 1000,
    writeThrottle: 4000
  });
  this.resIsDeferred    = options.resIsDeferred || false;
  this.outputFields     = { added: [], removed: [] };
  this.aborted          = false;
  this.maxParseAttempts = parseInt(req.header('max-parse-attempts')) || 10;
  this.cleanOnly        = /^true$/i.test(req.header('clean-only'));
  this.filterRedirs     = /^true$/i.test(req.header('ezpaarse-filter-redirects') || 'true');

  const filterStatus = req.header('ezpaarse-filter-status') || 'true';

  if (/^(true|false)$/i.test(filterStatus)) {
    this.filterStatus = /^true$/i.test(filterStatus);
  } else {
    this.filterStatus = new Set(filterStatus.split(',').map(s => s.trim()));
  }

  this.headers = {
    'Job-ID':                jobID,
    'Job-Report':            `${logRoute}/job-report.json`,
    'Job-Traces':            `${logRoute}/job-traces.log`,
    'Lines-Unknown-Formats': `${logRoute}/lines-unknown-formats.log`,
    'Lines-Ignored-Domains': `${logRoute}/lines-ignored-domains.log`,
    'Lines-Unknown-Domains': `${logRoute}/lines-unknown-domains.log`,
    'Lines-Unqualified-ECs': `${logRoute}/lines-unqualified-ecs.log`,
    'Lines-Duplicate-ECs':   `${logRoute}/lines-duplicate-ecs.log`,
    'Lines-Unordered-ECs':   `${logRoute}/lines-unordered-ecs.log`,
    'Lines-Filtered-ECs':    `${logRoute}/lines-filtered-ecs.log`,
    'Lines-Ignored-Hosts':   `${logRoute}/lines-ignored-hosts.log`,
    'Lines-Robots-ECs':      `${logRoute}/lines-robots-ecs.log`,
    'Lines-Unknown-Errors':  `${logRoute}/lines-unknown-errors.log`
  };

  this.addOutputFields = function (fields) {
    if (!fields) { return; }
    if (!Array.isArray(fields)) { fields = [fields]; }
    let { added, removed } = this.outputFields;

    fields.forEach(field => {
      if (!added.includes(field)) {
        added.push(field);
      }
      removed = removed.filter(f => f !== field);
    });
  };

  this.removeOutputFields = function (fields) {
    if (!fields) { return; }
    if (!Array.isArray(fields)) { fields = [fields]; }
    let { added, removed } = this.outputFields;

    fields.forEach(field => {
      if (!removed.includes(field)) {
        removed.push(field);
      }
      added = added.filter(f => f !== field);
    });
  };

  const { format } = winston;

  this.logger = winston.createLogger({
    level: loglevel,
    format: format.combine(
      format.timestamp(),
      format.splat(),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
      new (winston.transports.Console)({
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        )
      }),
      new (winston.transports.Stream)({
        stream: fs.createWriteStream(path.join(logPath, '/job-traces.log'))
      }),
      new (winston.transports.IOLogger)({
        socket: this.socket
      })
    ]
  });

  this.logger?.info(`New job with ID: ${jobID}`);

  this.logStreams = new StreamHandler();
  this.rejects.forEach(reject => {
    this.logStreams.add(reject, `${logPath}/lines-${reject}.log`);
  });

  const initDir   = path.resolve(__dirname, '../init');
  const initFiles = yield new Promise((resolve, reject) => {
    fs.readdir(initDir, (err, files) => {
      if (err) { reject(err); }
      else { resolve(files); }
    });
  });

  for (let file of initFiles) {
    // eslint-disable-next-line global-require
    const initFunction = require(path.resolve(initDir, file));

    yield new Promise((resolve, reject) => {
      initFunction(req, res, self, err => {
        if (err) { reject(err); }
        else { resolve(); }
      });
    });
  }

  const mwDir    = path.resolve(__dirname, '../../middlewares');
  const mwHeader = req.header('ezpaarse-middlewares');
  let mwNames    = config.EZPAARSE_MIDDLEWARES.slice();

  try {
    const mwConfig = yield dbConfig.getConfig('middlewares');

    if (Array.isArray(mwConfig && mwConfig.data)) {
      mwNames = mwConfig.data;
      this.logger?.info('Using the middleware list saved in the database');
    } else {
      this.logger?.info('Using the default middleware list from the JSON config');
    }
  } catch (e) {
    this.logger?.error('Failed to fetch the middleware list saved in the database');
    return Promise.reject(e);
  }

  if (mwHeader) {
    mwHeader.split('|').forEach(mwPart => {
      const match = /^\(\s*(before|after|only)\s*(.*?)\s*\)(.+)$/i.exec(mwPart.trim()) || [];

      let mwList      = match[3] || mwPart;
      let insertPoint = mwNames.indexOf(match[2] || 'qualifier');
      let direction   = match[1];

      if (insertPoint === -1) {
        insertPoint = mwNames.length - 1;
      }
      if (direction === 'after') {
        insertPoint++;
      }

      const mwToAdd = mwList.split(',').map(mw => mw.trim()).filter(mw => mw);

      if (direction === 'only') {
        mwNames = mwToAdd;
      } else {
        mwNames.splice(insertPoint, 0, ...mwToAdd);
      }
    });
  }

  self.report.set('general', 'middlewares', mwNames.join(', '));
  self.middlewares = [];

  for (let mwName of mwNames) {
    if (!/^[a-z0-9_-]+$/i.test(mwName)) {
      const err = self.error(4024, 400);
      err.message = `Invalid middleware name : ${mwName}`;
      return Promise.reject(err);
    }

    const ctx = {
      request: req,
      response: res,
      job: self,
      logger: self.logger,
      report: self.report,
      saturate: function () { self.addPressure(mwName); },
      drain: function () { self.removePressure(mwName); }
    };

    let mw;
    try {
      // eslint-disable-next-line global-require
      mw = require(path.join(mwDir, mwName)).call(ctx);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        const err = self.error(4025, 400);
        err.message = `Middleware not found : ${mwName}`;
        return Promise.reject(err);
      }
      return Promise.reject(e);
    }

    if (mw instanceof Error) {
      return Promise.reject(Boom.boomify(mw, { statusCode: mw.status }));
    } else if (mw instanceof Promise) {
      const m = yield mw;
      self.middlewares.push({ name: mwName, process: m.bind(ctx) });
    } else {
      self.middlewares.push({ name: mwName, process: mw.bind(ctx) });
    }
  }

  // Add URL of denied ECs to headers and report
  // we can't do it before because we need the extension
  self.headers['Denied-ECs'] = `${logRoute}/denied-ecs.${self.fileExtension}`;
  self.report.set('general', 'url-denied-ecs', self.headers['Denied-ECs']);

  // Define writer charset using the one we get in the header
  self.writer.charset = self.outputCharset;

  res.set(self.headers);

  if (self.socket) {
    self.socket.emit('headers', self.headers);
  }

  function checkJobDirectory(logPath) {
    return new Promise((resolve, reject) => {
      fs.stat(logPath, (err, stat) => {
        if (err && err.code === 'ENOENT') {
          return resolve();
        }

        reject(err || self.error(4023, 409));
      });
    });
  }

  /**
   * Merge default headers from the config into the request
   */
  function setDefaultHeaders() {
    if (typeof config.EZPAARSE_DEFAULT_HEADERS === 'object') {
      for (const [name, value] of Object.entries(config.EZPAARSE_DEFAULT_HEADERS)) {
        if (!req.headers[name.toLowerCase()]) {
          req.headers[name.toLowerCase()] = value;
        }
      }
    }
  }

  /**
   * Check if predefined settings are requested and override the headers
   */
  async function setPredefSettings(predefKey) {
    if (!predefKey) { return; }

    let predef = JSON.parse(await fs.readFile(predefFile, 'utf-8'))[predefKey];

    if (!predef) {
      predef = await customSettings.findById(predefKey);
    }

    if (!predef) {
      return Promise.reject(self.error(4026, 409));
    }

    if (predef.headers) {
      for (const name in predef.headers) {
        if (!req.headers[name.toLowerCase()]) {
          req.headers[name.toLowerCase()] = predef.headers[name];
        }
      }
    }
  }
};
