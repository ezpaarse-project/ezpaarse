'use strict';

const Boom = require('boom');
const co = require('co');

const statusCodes = require('../statuscodes.json');
const ezJobs      = require('./jobs.js');
const io          = require('./socketio.js').io;

const init      = require('./job/init');
const read      = require('./job/read');
const terminate = require('./job/terminate');

const treatment = require('./treatment');

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

    const general = (self.report && self.report.report && self.report.report.general) || {};
    let status = 'completed';

    if (general.status) {
      status = 'error';
    } else if (general['Job-Done'] === false && self.onAbort) {
      status = 'abort';
    }
    return treatment.update(self.jobID, status);
  };

  this.error = function (code, status) {
    return new Boom(statusCodes[code], {
      statusCode: status,
      decorate: { code, status }
    });
  };

  this.register = async function () {
    const user = (req.user && req.user.username) || null;
    try {
      await treatment.insert(user, jobID);
    } catch (e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        return Promise.reject(Boom.conflict('Job identifier already exists'));
      }
      return Promise.reject(e);
    }
  };

  /**
   * Initiate the job by getting eventual predefined settings and calling init().
   * Once initialized, the job will automatically start.
   */
  this._run = async function () {
    let error = null;

    try {
      await self.register();
      await co(self.init(req, res, options));
      await co(self.read(req, res));
      await co(self.terminate(req, res));
    } catch (err) {
      // If in dev mode, show the stack of unexpected errors
      if (!err.isBoom && process.env.NODE_ENV === 'development') {
        (self.logger || console).error(err.stack);
      }

      const message = err.message || statusCodes[err.code];

      self.headers = self.headers || {};
      self.headers[self.msgHeader] = message;
      self.headers[self.statusHeader] = err.code;

      if (self.logger) {
        self.logger.error(message || 'unknown');
      }

      if (self.report) {
        self.report.set('general', 'status', err.code);
        self.report.set('general', 'status-message', message);
      }

      if (!res.headersSent) {
        // When the job stops before writing anything, send a clear HTTP error
        res.set(self.headers);
        error = err.isBoom ? err : new Boom(message, { statusCode: err.status });
        error.output.payload.code = err.code;
      } else {
        // If anything happens during the process, try to corrupt the results
        const corruptionText = '\nJob aborted'.repeat(250);

        if (self.writer) {
          self.writer.corrupt(corruptionText);
        } else {
          res.write(corruptionText);
        }
      }
    }

    try {
      await closeStreams();
    } finally {
      await self.wipe();
    }

    if (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Stop the splitter
   * Used to stop the job prematurely
   * Should be use only for error cases
   */
  this._stop = function (err) {
    if (!self.aborted) {
      self.aborted = true;
      if (self.onAbort) {
        self.onAbort(err ? Boom.boomify(err) : new Boom('Job aborted'));
      }
    }
  };

  /**
   * Close all stream objects in the job
   */
  async function closeStreams() {
    await Promise.all([
      new Promise((resolve, reject) => {
        if (!self.logStreams) { return resolve(); }

        self.logger.info('Closing reject log streams');
        self.logStreams.closeAll(err => {
          if (err) { reject(err); }
          else { resolve(); }
        });
      }),

      new Promise(resolve => {
        if (!self.deniedStream) { return resolve(); }

        self.logger.info('Closing denied stream');
        self.deniedStream.end(resolve);
      }),

      new Promise(resolve => {
        if (!self.ecsStream) { return resolve(); }

        self.logger.info('Closing result stream');
        self.ecsStream.end(() => {
          self.ecsStream = null;
          resolve();
        });
      })
    ]);

    if (!self.logger) {
      return;
    }

    self.logger.info('Closing trace loggers');
    self.logger.end();

    await Promise.all(self.logger.transports.map(transport => new Promise(resolve => {
      if (!transport._stream) { return resolve(); }
      transport._stream.on('close', resolve);
      transport._stream.end();
    })));

    self.logger.clear();
  }
}
