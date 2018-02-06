'use strict';

const EventEmitter = require('events').EventEmitter;
const util         = require('util');
const co           = require('co');
const crypto       = require('crypto');
const Organizer    = require('./organizer.js');

/**
 * Create a Line Processor
 * Handle the process chain, from line parsing up to the final EC
 */
const LinesProcessor = function (job) {
  let ecNumber   = 0;
  let nbBadLines = 0;
  let firstLine  = true;
  const emit = this.emit.bind(this);

  if (!job) {
    this.ended = true;
    return this.emit('end');
  }

  const logParser   = job.logParser;
  const ecOrganizer = new Organizer();

  ecOrganizer.on('ec', ec => {
    job.counterReporter.count(ec);
    this.emit('ec', ec);
    // count masters values for reporting
    if (!job.report.get('stats', 'platform-' + ec.platform)) {
      job.report.inc('stats', 'platforms');
    }
    job.report.inc('stats', 'platform-' + ec.platform);
    if (ec.rtype) { job.report.inc('stats', 'rtype-' + ec.rtype); }
    if (ec.mime)  { job.report.inc('stats', 'mime-' + ec.mime); }
  });

  ecOrganizer.on('drain', () => {
    this.ended = true;
    this.emit('end');
  });

  /**
   * Parse a line and push the resulting EC into the enhancement process (if valid)
   * @param  {String} line
   */
  this.push = function processLine(line) {
    let isObjectSource = (typeof line === 'object');
    let ec;

    if (isObjectSource) {
      ec = line;
      line = JSON.stringify(line);
    }

    if (firstLine) {
      firstLine = false;
      job.report.set('general', 'input-first-line', line);
    }
    if (!job.parsedLines && nbBadLines >= job.maxParseAttempts) { return; }

    job.report.inc('general', 'nb-lines-input');

    line = line.replace(/\r$/, '');

    if (!line) { return; }
    if (!ec) {
      // If an EC is already defined, we got a CSV source
      ec = logParser.parse(line, {
        ignoreUrl: true,
        ignoreDate: true
      });
    }

    if (!ec) {
      job.logStreams.write('unknown-formats', line + '\n');
      job.report.inc('rejets', 'nb-lines-unknown-formats');

      if (!job.parsedLines) {
        nbBadLines++;
        job.logger.warn(`Line #${nbBadLines} not recognized`);

        if (nbBadLines >= job.maxParseAttempts) {
          job.logger.warn(`The first ${job.maxParseAttempts} line(s) couldn't be parsed`);
          job._stop(job.error(4003, 400));
        }
      }
      return;
    }

    if (!job.parsedLines) {
      if (!isObjectSource) {
        job.report.set('general', 'input-format-proxy',
          logParser.getProxy() || 'none, auto-recognition failed');
        job.report.set('general', 'input-format-literal',
          logParser.getFormat() || 'none, auto-recognition failed');
        job.report.set('general', 'input-format-regex',
          logParser.getRegexp(true) || 'none, bad format given or auto-recognition failed');

        // Add or remove user fields from those extracted by the log parser
        // We can't do it before because we need to process one line to autodetect the format
        job.addOutputFields(logParser.getFields());
      } else {
        job.addOutputFields(job.csvColumns);
      }
    }

    job.parsedLines = true;

    if (!ec['log_id']) {
      ec['log_id'] = crypto.createHash('sha1').update(line).digest('hex');
    }

    logParser.parseUrl(ec);
    logParser.parseDate(ec, { ignoreFormat: isObjectSource });

    Object.defineProperty(ec, '_meta', {
      value: {
        originalLine: line,
        lineNumber: ++ecNumber,
      },
      writable: true,
      enumerable: false,
      configurable: false
    });

    co(function* () {
      for (const mw of job.middlewares) {
        yield new Promise((resolve, reject) => {
          mw(ec, err => {
            if (err) { reject(err); }
            else { resolve(); }
          });
        });
      }

      if (ec._meta.enhancementFailed) {
        job.logStreams.write('pkb-miss-ecs', ec._meta.originalLine + '\n');
        job.report.inc('rejets', 'nb-lines-pkb-miss-ecs');
      }

      if (ec._meta.granted === false) {
        emit('denied', ec);
        ecOrganizer.skip(ec._meta.lineNumber);
      } else {
        ecOrganizer.push(ec);
      }
    }).catch(err => handleError(err, ec));
  };

  this.drain = function () {
    ecOrganizer.setLast(ecNumber);

    co(function* () {
      for (const mw of job.middlewares) {
        yield new Promise((resolve, reject) => {
          mw(null, err => {
            if (err) { reject(err); }
            else { resolve(); }
          });
        });
      }
    });
  };

  function handleError(err, ec) {
    ecOrganizer.skip(ec._meta.lineNumber);

    switch (err.type) {
    case 'ECLEAN':
      emit('ec', ec);
      break;
    case 'ENOPARSER':
      job.notifiers['unknown-domains'].increment(ec.domain);
      job.logStreams.write('unknown-domains', ec._meta.originalLine + '\n');
      job.report.inc('rejets', 'nb-lines-unknown-domains');
      break;
    case 'ECHRONO':
      job.logger.verbose('A log line is not chronological : ' + ec._meta.originalLine);
      job.report.inc('rejets', 'nb-lines-unordered-ecs');
      job.logStreams.write('unordered-ecs', ec._meta.originalLine + '\n');
      break;
    case 'EDUPLICATE':
      job.report.inc('rejets', 'nb-lines-duplicate-ecs');
      job.logStreams.write('duplicate-ecs', ec._meta.originalLine + '\n');
      break;
    case 'EIRRELEVANT':
      job.report.inc('rejets', 'nb-lines-ignored');
      job.logStreams.write('filtered-ecs', ec._meta.originalLine + '\n');
      break;
    case 'EIGNOREDDOMAIN':
      job.report.inc('rejets', 'nb-lines-ignored-domains');
      job.logStreams.write('ignored-domains', ec._meta.originalLine + '\n');
      break;
    case 'EIGNOREDHOST':
      job.report.inc('rejets', 'nb-lines-ignored-hosts');
      job.logStreams.write('ignored-hosts', ec._meta.originalLine + '\n');
      break;
    case 'EROBOT':
      job.report.inc('rejets', 'nb-lines-robots-ecs');
      job.logStreams.write('robots-ecs', ec._meta.originalLine + '\n');
      break;
    case 'ENOTQUALIFIED':
      if (!ec._meta.denied) {
        job.report.inc('rejets', 'nb-lines-unqualified-ecs');
        job.logStreams.write('unqualified-ecs', ec._meta.originalLine + '\n');
      }
      break;
    }
  }
};

util.inherits(LinesProcessor, EventEmitter);
module.exports = LinesProcessor;
