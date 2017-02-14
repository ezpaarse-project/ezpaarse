/* eslint global-require: 0, no-sync: 0 */
'use strict';

const co = require('co');

const statusCodes = require('../statuscodes.json');
const ezJobs      = require('./jobs.js');
const io          = require('./socketio.js').io;

const init      = require('./job/init');
const read      = require('./job/read');
const terminate = require('./job/terminate');

module.exports = Job;

/**
 * Create a Job instance that handles the entire process
 */
function Job(req, res, jobID, options) {
  const self = ezJobs[jobID] = this;
  req._jobID = jobID;

  io().to('admin').emit('jobs', Object.keys(ezJobs));

  res.set('Connection', 'close');
  res.setTimeout(parseInt(req.get('ezPAARSE-Response-Timeout')) || 1000 * 60 * 30);

  this.jobID        = jobID;
  this.shortID      = jobID.substr(0, 8);
  this.options      = options || {};
  this.statusHeader = 'ezPAARSE-Status';
  this.msgHeader    = 'ezPAARSE-Status-Message';

  this.init      = init.bind(this);
  this.read      = read.bind(this);
  this.terminate = terminate.bind(this);

  this.wipe = function () {
    delete ezJobs[jobID];
    io().to('admin').emit('jobs', Object.keys(ezJobs));
  };

  this.error = function (code, status) {
    const err  = new Error();
    err.code   = code;
    err.status = status;
    err.type   = 'JobError';
    return err;
  };

  /**
   * Initiate the job by getting eventual predefined settings and calling init().
   * Once initialized, the job will automatically start.
   */
  this._run = function () {
    co(function* () {
      yield co(self.init(req, res, options));
      yield co(self.read(req, res));
      yield co(self.terminate(req, res));
    }).catch(err => {
      // If in dev mode, show the stack of unexpected errors
      if (err.type !== 'JobError' && process.env.NODE_ENV === 'development') {
        (self.logger || console).error(err.stack);
      }

      const msg = err.message || statusCodes[err.code];

      self.headers = self.headers || {};
      self.headers[self.msgHeader] = msg;
      self.headers[self.statusHeader] = err.code;

      if (self.logger) {
        self.logger.error(msg || 'unknown');
      }

      if (self.report) {
        self.report.set('general', 'status', err.code);
        self.report.set('general', 'status-message', msg);
      }

      // When the job stops before writing anything, send a clear HTTP error
      if (!res.headersSent) {
        return res.writeHead(err.status || 500, self.headers);
      }

      // If anything happens during the process, try to corrupt the results
      const corruptionText = '\nJob aborted'.repeat(250);

      if (self.writer) {
        self.writer.corrupt(corruptionText);
      } else {
        res.write(corruptionText);
      }
    })
    .then(closeStreams)
    .then(closeJob)
    .catch(closeJob);
  };

  function closeJob() {
    res.end();
    self.wipe();
  }

  /**
   * Stop the splitter
   * Used to stop the job prematurely
   * Should be use only for error cases
   */
  this._stop = function (err) {
    if (!self.aborted) {
      self.aborted = true;
      if (self.onAbort) { self.onAbort(err); }
    }
  };

  /**
   * Close all stream objects in the job
   */
  function closeStreams() {
    return co(function* () {
      yield new Promise((resolve, reject) => {
        self.logger.info('Closing reject log streams');

        self.logStreams.closeAll(err => {
          if (err) { reject(); }
          else { resolve(); }
        });
      });

      yield new Promise((resolve, reject) => {
        self.logger.info('Closing denied stream');

        if (!self.deniedStream) { return resolve(); }
        self.deniedStream.end(resolve);
      });

      yield new Promise((resolve, reject) => {
        self.logger.info('Closing result stream');

        if (!self.ecsStream) { return resolve(); }
        self.ecsStream.end(function () {
          self.ecsStream = null;
          resolve();
        });
      });

      yield new Promise((resolve, reject) => {
        self.logger.info('Closing trace loggers');

        if (self.logger.transports.file) {
          self.logger.transports.file._stream.on('close', resolve);
          return self.logger.clear();
        }

        self.logger.clear();
        resolve();
      });
    });
  }
}
