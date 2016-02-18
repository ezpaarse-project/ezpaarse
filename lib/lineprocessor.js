'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var Stackware    = require('stackware');
var Organizer    = require('./organizer.js');

/**
 * Create a Line Processor
 * Handle the process chain, from line parsing up to the final EC
 */
var LinesProcessor = function (job) {
  var self      = this;
  var ecNumber  = 0;
  var firstLine = true;

  if (!job) { return self.emit('end'); }

  var logParser   = job.logParser;

  var ecOrganizer = new Organizer();
  var stack       = new Stackware();

  job.middlewares.forEach(function (mw) {
    stack.use(mw);
  });

  stack.use(function done(ec) {
    if (!ec) { return; }

    if (ec._meta.enhancementFailed) {
      job.logStreams.write('pkb-miss-ecs', ec._meta.originalLine + '\n');
      job.report.inc('rejets', 'nb-lines-pkb-miss-ecs');
    }

    if (ec._meta.granted === false) {
      self.emit('denied', ec);
      ecOrganizer.skip(ec._meta.lineNumber);
    } else {
      ecOrganizer.push(ec);
    }
  });

  stack.use(function onError(err, ec, next) {
    ecOrganizer.skip(ec._meta.lineNumber);

    switch (err.type) {
    case 'ECLEAN':
      self.emit('ec', ec);
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
  });

  ecOrganizer.on('ec', function (ec) {
    job.counterReporter.count(ec);
    self.emit('ec', ec);
    // count masters values for reporting
    if (!job.report.get('stats', 'platform-' + ec.platform)) {
      job.report.inc('stats', 'platforms');
    }
    job.report.inc('stats', 'platform-' + ec.platform);
    if (ec.rtype) { job.report.inc('stats', 'rtype-' + ec.rtype); }
    if (ec.mime)  { job.report.inc('stats', 'mime-' + ec.mime); }
  });

  ecOrganizer.on('drain', function () {
    self.emit('end');
  });

  /**
   * Parse a line and push the resulting EC into the enhancement process (if valid)
   * @param  {String} line
   */
  self.push = function processLine(line) {
    if (firstLine) {
      firstLine = false;
      job.report.set('general', 'input-first-line', line);
    }
    if (job.badBeginning) {
      return;
    }
    job.report.inc('general', 'nb-lines-input');

    line = line.replace(/\r$/, '');
    if (!line) { return; }

    var ec = logParser.parse(line);

    if (!ec) {
      job.logStreams.write('unknown-formats', line + '\n');
      job.report.inc('rejets', 'nb-lines-unknown-formats');
      if (!job.parsedLines) {
        job.badBeginning = true;
        job._stop();
        job.logger.warn('Couldn\'t recognize first line : aborted.', {line: line});
      }
      return;
    }

    if (!job.parsedLines) {
      job.report.set('general', 'input-format-proxy',
        job.logParser.getProxy() || 'none, auto-recognition failed');
      job.report.set('general', 'input-format-literal',
        logParser.getFormat() || 'none, auto-recognition failed');
      job.report.set('general', 'input-format-regex',
        logParser.getRegexp(true) || 'none, bad format given or auto-recognition failed');
      // Add or remove user fields from those extracted by the log parser
      // We can't do it before because we need to process one line to autodetect the format
      job.outputFields.added = job.outputFields.added.concat(job.logParser.getFields());
    }

    job.parsedLines = true;

    ec._meta.originalLine = line;
    ec._meta.lineNumber   = ++ecNumber;

    stack.process(ec);
  };

  self.drain = function () {
    ecOrganizer.setLast(ecNumber);
    stack.process(null);
  };
};

util.inherits(LinesProcessor, EventEmitter);
module.exports = LinesProcessor;