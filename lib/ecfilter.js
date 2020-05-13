/* eslint global-require: 0 */
/*eslint max-len: ["error", 200]*/
'use strict';

/**
 * Provides functions to filter ECs
 */

const fs                = require('fs-extra');
const path              = require('path');
const config            = require('./config.js');
const qualifyingLevel   = config.EZPAARSE_QUALIFYING_LEVEL;
const qualifyingFactors = config.EZPAARSE_QUALIFYING_FACTORS.internal;
const externalFactors   = config.EZPAARSE_QUALIFYING_FACTORS.external;

const domains = {};
const hosts   = {};
const robots  = {};

/**
 * Init data required for filtering
 */
exports.init = function (callback) {

  externalFactors.forEach(function (factors) {
    if (factors.file) {
      const filepath = path.join(__dirname, '..', factors.file);
      let factorsList = require(filepath);

      if (factors.sublist) { factorsList = factorsList[factors.sublist]; }

      factorsList.forEach(function (factor) {
        qualifyingFactors[factor.code] = factors.weight;
      });
    }
  });

  const exclusionsDir = path.join(__dirname, '../exclusions');

  fs.readdir(exclusionsDir, function (err, files) {
    if (err) { return callback(err); }

    (function readFile() {
      const file = files.pop();
      if (!file) { return callback(null, Object.keys(robots).length); }

      const type = file.substr(0, file.indexOf('.'));
      let list;

      switch (type) {
      case 'hosts':
        list = hosts;
        break;
      case 'domains':
        list = domains;
        break;
      case 'robots':
        list = robots;
        break;
      default:
        return readFile();
      }

      fs.readFile(path.join(exclusionsDir, file), function (err, content) {
        if (err)      { return callback(err); }
        if (!content) { return readFile(); }

        const partial = /^[0-9]+\.[0-9]+\.[0-9]+$/;

        content.toString().split(/\r?\n/).forEach(function (line) {
          const comment = line.indexOf('#');
          if (comment >= 0) { line = line.substr(0, comment); }
          line = line.trim();

          if (line.length > 0) {
            if (partial.test(line)) {
              for (let i = 0; i <= 255; i++) { list[line + '.' + i] = 1; }
            } else {
              list[line] = 1;
            }
          }
        });

        readFile();
      });
    })();
  });
};

/**
 * Check if an EC should be ignored
 * @param  {Object}  ec the EC to test
 * @param  {Object}  currently executing job
 * @return {boolean}    false if the EC should be ignored
 */
exports.isValid = function (ec, job) {
  const validCodes = new Set(['200', '304']);
  const deniedCodes = new Set(['401', '403']);
  const filterRedirs = job.hasOwnProperty('filterRedirs') ? job.filterRedirs : true;
  const filterStatus = job.hasOwnProperty('filterStatus') ? job.filterStatus : true;

  if (!filterRedirs) {
    validCodes.add('301').add('302');
  }

  if (!ec.url || !ec.timestamp) {
    job.logger.silly('Missing field: url or timestamp');
    return { valid: false, reason: 'Missing field: url or timestamp' };
  }

  if (!ec.domain && !job.forceParser) {
    job.logger.silly('Missing field: domain');
    return { valid: false, reason: 'Missing field: domain' };
  }

  // Filters images and javascript files
  if (/\.otf|\.css|\.gif|\.jpe?g|\.png|favicon\.ico/i.test(ec.url) || /\.js$/.test(ec.url) || /\.js\.min$/.test(ec.url)) {
    return { valid: false, reason: 'Not interesting hit: otf, css, gif, jpg, png, favicon' };
  }

  if (filterStatus === true) {
    if (deniedCodes.has(ec.status)) {
      // Let 401 and 403 pass, but mark them as denied
      ec._meta.granted = false;
    } else if (ec.status && !validCodes.has(ec.status)) {
      // Filters http codes other than 200 or 304
      return {
        valid: false,
        reason: `Ignored HTTP status code: ${ec.status}`
      };
    }
  } else if (filterStatus instanceof Set) {
    if (ec.status && !filterStatus.has(ec.status)) {
      // Filters http codes which are not listed in filterStatus
      return {
        valid: false,
        reason: `Ignored HTTP status code: ${ec.status}`
      };
    }
  }
  return { valid: true };
};

/**
 * Check if an EC is qualified
 * @param  {Object}  ec the EC to test
 * @return {boolean} true if the EC is qualified, otherwise false
 */
exports.isQualified = function (ec) {
  let level = 0;
  for (const field in qualifyingFactors) {
    if (ec[field]) {
      level += qualifyingFactors[field];
      if (level >= qualifyingLevel) { return true; }
    }
  }
  return false;
};

/**
 * Check if a host is ignored
 * @param  {String}  host
 * @return {boolean} true if the host is ignored
 */
exports.isIgnoredHost = function (host) {
  return !!hosts[host];
};

/**
 * Check if a domain is ignored
 * @param  {String}  domain
 * @return {boolean} true if the domain is ignored
 */
exports.isIgnoredDomain = function (domain) {
  return !!domains[domain];
};

/**
 * Check if a host is a robot
 * @param  {String}  host
 * @return {boolean} true if the host is a robot
 */
exports.isRobot = function (host) {
  return !!robots[host];
};
