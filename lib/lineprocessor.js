'use strict';

var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var crypto       = require('crypto');
var ezJobs       = require('./jobs.js');
var parserlist   = require('./parserlist.js');
var config       = require('../config.json');
var statusCodes  = require('../statuscodes.json');

// process chain
var ECFilter      = require('./ecfilter.js');
var ECBuffer      = require('./ecbuffer.js');
var ECParser      = require('./ecparser.js');
var Deduplicator  = require('./deduplicator.js');
var Enhancer      = require('./enhancer.js');
var FieldSplitter = require('./fieldsplitter.js');
var Organizer     = require('./organizer.js');

/**
 * Create a Line Processor
 * Handle the process chain, from line parsing up to the final EC
 */
var LineProcessor = function (req) {
  var self      = this;
  var job       = ezJobs[req._jobID];
  var ecNumber  = 0;

  var logParser       = job.logParser;
  var ecFilter        = new ECFilter();
  var ecBuffer        = new ECBuffer(100);
  var ecParser        = new ECParser(job.logger);
  var ecOrganizer1    = new Organizer();
  var ecDeduplicator  = new Deduplicator(job.deduplication);
  var ecEnhancer      = new Enhancer(job.logger, job.logStreams, job.report);
  var ecFieldSplitter = new FieldSplitter(job.ufSplitters);
  var ecOrganizer2    = new Organizer();

  /**
   * All the logic of the process chain is defined into this auto-invocated function
   */
  (function defineProcess() {
    ecBuffer.on('packet', ecParser.push);
    ecBuffer.on('drain', function () {
      if (job.endOfRequest) { ecParser.drain(); }
    });
    ecParser.on('ec', ecOrganizer1.push);
    ecParser.on('drain', function () {
      self.emit('drain');
      if (job.endOfRequest) {
        if (!job.deduplication.use) { ecOrganizer2.setLast(ecNumber); }
        ecDeduplicator.drain();
      }
    });
    ecParser.on('saturated', function () {
      self.emit('saturated');
    });
    ecOrganizer1.on('ec', function (ec) {
      if (job.deduplication.use) { ecDeduplicator.push(ec); }
      else                       { ecEnhancer.push(ec); }
    });
    ecDeduplicator.on('unique', ecEnhancer.push);
    ecDeduplicator.on('duplicate', function (ec) {
      job.report.inc('rejets', 'nb-lines-duplicate-ecs');
      job.logger.silly('Duplicate EC, not written');
      job.logStreams.write('duplicateECs', ec._meta.originalLine + '\n');
      ecOrganizer2.skip(ec._meta.lineNumber);
    });
    ecDeduplicator.on('error', function (err, ec) {
      job.logger.verbose('A log line is not chronological : ' + ec._meta.originalLine);
      job.report.set('general', 'status', 4014);
      job.report.set('general', 'status-message', statusCodes['4014']);
      job.report.inc('rejets', 'nb-lines-unordered-ecs');
      job.logStreams.write('unorderedECs', ec._meta.originalLine + '\n');
    });
    ecDeduplicator.on('drain', function (last) {
      if (job.deduplication.use) { ecOrganizer2.setLast(last); }
    });
    ecEnhancer.on('ec', function (ec) {
      ecFieldSplitter.split(ec);

      if (ec._isQualified()) {
        ecOrganizer2.push(ec);
      } else {
        ecOrganizer2.skip(ec._meta.lineNumber);
        job.logger.silly('Unqualified EC, not written');
        job.logStreams.write('unqualifiedECs', ec._meta.originalLine + '\n');
        job.report.inc('rejets', 'nb-lines-unqualified-ecs');
      }
    });
    ecOrganizer2.on('ec', function (ec) {
      self.emit('ec', ec);
      // count masters values for reporting
      if (!job.report.get('stats', 'platform-' + ec.platform)) {
        job.report.inc('stats', 'platforms');
      }
      job.report.inc('stats', 'platform-' + ec.platform);
      if (ec.rtype) { job.report.inc('stats', 'rtype-' + ec.rtype); }
      if (ec.mime)  { job.report.inc('stats', 'mime-' + ec.mime); }
    });
    ecOrganizer2.on('drain', function () {
      self.emit('end');
    });
  })();

  /**
   * Parse a line and push the resulting EC into the enhancement process (if valid)
   * @param  {String} line
   */
  var processLine = function (line) {
    if (job.badBeginning) {
      return;
    }
    job.report.inc('general', 'nb-lines-input');
    line   = line.trim();
    var ec = logParser.parse(line);
    
    if (ec) {
      job.parsedLines = true;
      if (ecFilter.isValid(ec)) {
        if (config.EZPAARSE_IGNORED_DOMAINS.indexOf(ec.domain) === -1) {
          if (ec.host && job.anonymize.host) {
            ec.host = crypto.createHash(job.anonymize.host).update(ec.host).digest("hex");
          }
          if (ec.login && job.anonymize.login) {
            ec.login = crypto.createHash(job.anonymize.login).update(ec.login).digest("hex");
          }
          var parser = parserlist.get(ec.domain);
          if (parser) {
            ec._meta.originalLine = line;
            ec._meta.lineNumber   = ++ecNumber;
            ec.platform           = parser.platform;
            ecBuffer.push(ec, parser);
          } else {
            job.logger.silly('No parser found for : ' + ec.domain);
            job.logStreams.write('unknownDomains', line + '\n');
            job.report.inc('rejets', 'nb-lines-unknown-domains');
          }
        } else {
          job.logger.silly('The domain is ignored');
          job.logStreams.write('ignoredDomains', line + '\n');
          job.report.inc('rejets', 'nb-lines-ignored-domains');
        }
      } else {
        job.logger.silly('Line was ignored');
        job.report.inc('rejets', 'nb-lines-ignored');
      }
    } else {
      job.logger.silly('Line format was not recognized');
      job.logStreams.write('unknownFormats', line + '\n');
      job.report.inc('rejets', 'nb-lines-unknown-format');
      if (!job.parsedLines) {
        job.badBeginning = true;
        job._stop();
        job.logger.warn('Couldn\'t recognize first line : aborted.', {line: line});
      }
    }
  };

  /**
   * Do a specific work for first line
   * processLine (see above) replaces it once the first line has been processed
   * @param  {String} line
   */
  var processFirstLine = function (line) {
    processFirstLine = processLine;
    job.report.set('general', 'first-line', line);
    job.report.set('general', 'format-regex',
      logParser.getRegexp() || 'not found, build or auto-recognition failed');
    processLine(line);
  };

  self.push  = processFirstLine;
  self.drain = ecBuffer.drain;
};

util.inherits(LineProcessor, EventEmitter);
module.exports = LineProcessor;