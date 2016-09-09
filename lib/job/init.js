'use strict';

const fs      = require('fs');
const path    = require('path');
const winston = require('winston');
const mkdirp  = require('mkdirp');
const moment  = require('moment');

const ReportManager = require('../reportmanager.js');
const StreamHandler = require('../streamhandler.js');

const config     = require('../config.js');
const io         = require('../socketio.js').io;
const pkg        = require('../../package.json');

const predefFile = path.resolve(__dirname, '../../resources/predefined-settings.json');
const tmpDir     = path.resolve(__dirname, '../../tmp/jobs');
/**
 * Define all job parameters and call start()
 */
module.exports = function* init(req, res, options) {
  const self  = this;
  const jobID = this.jobID;

  yield setPredefSettings();

  const logRoute = `${req.ezBaseURL}/${jobID}`;
  const logPath  = path.resolve(tmpDir, jobID.charAt(0), jobID.charAt(1), jobID);
  const loglevel = req.header('Traces-Level')
               || (config.EZPAARSE_ENV == 'production' ? 'info' : 'verbose');

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
      'Job-ID':           jobID,
      'Job-Date':         moment().format(),
      'Job-Done':         false,
      'result-file-ecs':  logRoute,
      'URL-Traces':       `${logRoute}/job-traces.log`,
      'nb-ecs':           0,
      'nb-denied-ecs':    0,
      'nb-lines-input':   0,
      'Rejection-Rate':   '0 %',
      'Job-Duration':     '0 s',
      'process-speed':    '0 lignes/s',
      'client-user-agent': req.headers['user-agent']
    },
    'rejets': {
      'nb-lines-ignored':         0,
      'nb-lines-duplicate-ecs':   0,
      'nb-lines-ignored-domains': 0,
      'nb-lines-unknown-domains': 0,
      'nb-lines-unknown-formats': 0,
      'nb-lines-unqualified-ecs': 0,
      'nb-lines-pkb-miss-ecs':    0,
      'nb-lines-unordered-ecs':   0,
      'nb-lines-ignored-hosts':   0,
      'nb-lines-robots-ecs':      0
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
    'unqualified-ecs',
    'pkb-miss-ecs',
    'duplicate-ecs',
    'unordered-ecs',
    'filtered-ecs',
    'ignored-hosts',
    'robots-ecs'
  ]);

  const rejectHeader = (req.header('Reject-Files') || '').toLowerCase();

  this.rejects = rejectHeader === 'all'
    ? Array.from(rejectList)
    : rejectHeader.split(',')
                  .map(r => r.trim())
                  .filter(r => rejectList.has(r));

  this.rejects.forEach(reject => {
    baseReport.rejets[`url-${reject}`] = `${logRoute}/lines-${reject}.log`;
  });

  this.jobPath = logPath; // temp job directory
  this.socket  = io().sockets.connected[req.header('Socket-ID')];
  this.report  = new ReportManager(path.join(logPath, '/report.json'), {
    baseReport: baseReport,
    socket: this.socket,
    updateThrottle: 1000,
    writeThrottle: 4000
  });
  this.resIsDeferred    = options.resIsDeferred || false;
  this.aborted          = false;
  this.maxParseAttempts = parseInt(req.header('max-parse-attempts')) || 10;
  this.cleanOnly        = /^true$/i.test(req.header('clean-only'));
  this.filterRedirs     = /^true$/i.test(req.header('ezpaarse-filter-redirects') || 'true');
  this.outputFields     = { added: [], removed: [] };
  this.headers          = {
    'Job-ID':                jobID,
    'Job-Report':            `${logRoute}/job-report.json`,
    'Job-Traces':            `${logRoute}/job-traces.log`,
    'Lines-Unknown-Formats': `${logRoute}/lines-unknown-formats.log`,
    'Lines-Ignored-Domains': `${logRoute}/lines-ignored-domains.log`,
    'Lines-Unknown-Domains': `${logRoute}/lines-unknown-domains.log`,
    'Lines-Unqualified-ECs': `${logRoute}/lines-unqualified-ecs.log`,
    'Lines-PKB-Miss-ECs':    `${logRoute}/lines-pkb-miss-ecs.log`,
    'Lines-Duplicate-ECs':   `${logRoute}/lines-duplicate-ecs.log`,
    'Lines-Unordered-ECs':   `${logRoute}/lines-unordered-ecs.log`,
    'Lines-Filtered-ECs':    `${logRoute}/lines-filtered-ecs.log`,
    'Lines-Ignored-Hosts':   `${logRoute}/lines-ignored-hosts.log`,
    'Lines-Robots-ECs':      `${logRoute}/lines-robots-ecs.log`
  };

  this.logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: loglevel,
        colorize: true,
        timestamp: true
      }),
      new (winston.transports.File)({
        level: loglevel,
        stream: fs.createWriteStream(path.join(logPath, '/job-traces.log'))
      }),
      new (winston.transports.IOLogger)({
        level: loglevel,
        socket: this.socket
      })
    ]
  });

  this.logger.info('New job with ID: %s', jobID);

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


  const mwDir   = path.resolve(__dirname, '../../middlewares');
  const mwNames = config.EZPAARSE_MIDDLEWARES;

  self.middlewares = [];

  for (let mwName of mwNames) {
    const ctx = {
      request: req,
      response: res,
      job: self,
      logger: self.logger,
      report: self.report,
      saturate: function () { self.addPressure(mwName); },
      drain: function () { self.removePressure(mwName); }
    };

    // eslint-disable-next-line global-require
    const mw = require(path.join(mwDir, mwName)).call(ctx);

    if (mw instanceof Error) {
      throw mw;
    } else if (mw instanceof Promise) {
      const m = yield mw;
      self.middlewares.push(m.bind(ctx));
    } else {
      self.middlewares.push(mw.bind(ctx));
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

  /**
   * Check if predefined settings are requested and override the headers
   */
  function setPredefSettings() {
    return new Promise((resolve, reject) => {

      const predefKey = req.get('ezPAARSE-Predefined-Settings');

      if (!predefKey) { return resolve(); }

      fs.readFile(predefFile, function (err, content) {
        if (err) { return reject(err); }

        let predef;
        try {
          predef = JSON.parse(content)[predefKey];
        } catch (e) {
          return reject(e);
        }

        if (predef && predef.headers) {
          for (const name in predef.headers) {
            if (!req.headers.hasOwnProperty(name)) {
              req.headers[name.toLowerCase()] = predef.headers[name];
            }
          }
        }

        resolve();
      });
    });
  }
};
