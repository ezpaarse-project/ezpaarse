'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var crypto       = require('crypto');
var parserlist   = require('./parserlist.js');
var statusCodes  = require('../statuscodes.json');

// process chain
var ecFilter      = require('./ecfilter.js');
var Deduplicator  = require('./deduplicator.js');
var Enhancer      = require('./enhancer.js');
var FieldSplitter = require('./fieldsplitter.js');
var Organizer     = require('./organizer.js');

/**
 * Create a Line Processor
 * Handle the process chain, from line parsing up to the final EC
 */
var LinesProcessor = function (job) {
  var self      = this;
  var ecNumber  = 0;
  var firstLine = true;

  if (!job) { return self.emit('end'); }

  var logParser       = job.logParser;
  var ecDeduplicator  = new Deduplicator(job.deduplication);
  var ecEnhancer      = new Enhancer(job);
  var ecFieldSplitter = new FieldSplitter(job.ufSplitters);
  var ecOrganizer     = new Organizer();

  /**
   * All the logic of the process chain is defined into this auto-invocated function
   */
  (function defineProcess() {
    ecDeduplicator.on('unique', function (ec) {
      ecEnhancer.push(ec);
    });
    ecDeduplicator.on('duplicate', function (ec) {
      job.report.inc('rejets', 'nb-lines-duplicate-ecs');
      job.logStreams.write('duplicate-ecs', ec._meta.originalLine + '\n');
      ecOrganizer.skip(ec._meta.lineNumber);
    });
    ecDeduplicator.on('error', function (err, ec) {
      job.logger.verbose('A log line is not chronological : ' + ec._meta.originalLine);
      job.report.set('general', 'status', 4014);
      job.report.set('general', 'status-message', statusCodes['4014']);
      job.report.inc('rejets', 'nb-lines-unordered-ecs');
      job.logStreams.write('unordered-ecs', ec._meta.originalLine + '\n');
    });
    ecDeduplicator.on('drain', function (last) {
      if (job.deduplication.use) { ecOrganizer.setLast(last); }
    });
    ecEnhancer.on('ec', function (ec) {
      ecFieldSplitter.split(ec);

      if (ecFilter.isQualified(ec)) {
        if (ec._meta.granted === false) {
          self.emit('denied', ec);
          ecOrganizer.skip(ec._meta.lineNumber);
        } else {
          ecOrganizer.push(ec);
        }
      } else {
        ecOrganizer.skip(ec._meta.lineNumber);

        if (!ec._meta.denied) {
          job.logStreams.write('unqualified-ecs', ec._meta.originalLine + '\n');
          job.report.inc('rejets', 'nb-lines-unqualified-ecs');
        }
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
  })();

  /**
   * Parse a line and push the resulting EC into the enhancement process (if valid)
   * @param  {String} line
   */
  var processLine = function (line) {
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
      // Add or remove user fields from those extracted by logParser
      // We can't do it before because we need to process one line to autodetect the format
      var outputFields       = job.outputFields     || {};
      outputFields.added     = outputFields.added   || [];
      outputFields.removed   = outputFields.removed || [];
      job.outputFields.added = outputFields.added.concat(job.logParser.getFields());
    }

    job.parsedLines = true;
    var ecValid = ecFilter.isValid(ec, job);
    if (!ecValid.valid) {
      job.logStreams.write('filtered-ecs', line + '\n');
      job.report.inc('rejets', 'nb-lines-ignored');
      return;
    }

    ec._meta.originalLine = line;
    ec._meta.originalHost = ec.host;

    if (job.cleanOnly) { return self.emit('ec', ec); }

    if (job.filters.domains && ecFilter.isIgnoredDomain(ec.domain)) {
      job.logStreams.write('ignored-domains', line + '\n');
      job.report.inc('rejets', 'nb-lines-ignored-domains');
      return;
    }


    if (job.filters.hosts && ecFilter.isIgnoredHost(ec.host)) {
      job.logStreams.write('ignored-hosts', line + '\n');
      job.report.inc('rejets', 'nb-lines-ignored-hosts');
      return;
    }

    if (ecFilter.isRobot(ec.host)) {
      if (job.filters.robots) {
        job.logStreams.write('robots-ecs', line + '\n');
        job.report.inc('rejets', 'nb-lines-robots-ecs');
        return;
      }
      ec.robot = 'yes';
    } else {
      ec.robot = 'no';
    }

    if (ec.host && job.anonymize.host) {
      ec.host = crypto.createHash(job.anonymize.host).update(ec.host).digest("hex");
    }
    if (ec.login && job.anonymize.login) {
      ec.login = crypto.createHash(job.anonymize.login).update(ec.login).digest("hex");
    }


    var parser = parserlist.get(ec.domain);  // get the right parser from domain value

    if (!parser && job.forceParser) {
      // forceParser contains platform name parser to use
      parser = parserlist.getFromPlatform(job.forceParser);
      job.logger.silly('Parser found for platform ', parser);
    }

    if (!parser) {
      job.logger.silly('Parser not found for domain ', ec.domain);
      job.notifiers['unknown-domains'].increment(ec.domain);
      job.logStreams.write('unknown-domains', line + '\n');
      job.report.inc('rejets', 'nb-lines-unknown-domains');
      return;
    }

    job.logger.silly('job.forceECFieldPublisher ', job.forceECFieldPublisher);

    ec._meta.lineNumber = ++ecNumber;
    ec.platform         = parser.platform;
    ec.platform_name    = parser.platformName;
    ec.publisher_name   = job.forceECFieldPublisher || parser.publisherName;

    var result = require(parser.file).execute(ec) || {};

    if (result.hasOwnProperty('_granted')) {
      ec._meta.granted = result._granted;
      delete result._granted;
    }
    for (var p in result) { ec[p] = result[p]; }

    if (job.deduplication.use) { ecDeduplicator.push(ec); }
    else                       { ecEnhancer.push(ec); }
  };

  self.push  = processLine;
  self.drain = function () {
    if (!job.deduplication.use) { ecOrganizer.setLast(ecNumber); }
    ecDeduplicator.drain();
  };
};

util.inherits(LinesProcessor, EventEmitter);
module.exports = LinesProcessor;