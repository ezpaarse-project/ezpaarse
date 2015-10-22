'use strict';

/**
 * Provides functions to filter ECs
 */

var fs                = require('graceful-fs');
var path              = require('path');
var config            = require('./config.js');
var qualifyingLevel   = config.EZPAARSE_QUALIFYING_LEVEL;
var qualifyingFactors = config.EZPAARSE_QUALIFYING_FACTORS.internal;
var externalFactors   = config.EZPAARSE_QUALIFYING_FACTORS.external;

var domains = {};
var hosts   = {};
var robots  = {};

/**
 * Init data required for filtering
 */
exports.init = function (callback) {

  externalFactors.forEach(function (factors) {
    if (factors.file) {
      var filepath = path.join(__dirname, '..', factors.file);
      if (fs.existsSync(filepath)) {
        var factorsList = require(filepath);
        factorsList.forEach(function (factor) {
          qualifyingFactors[factor.code] = factors.weight;
        });
      }
    }
  });

  var exclusionsDir = path.join(__dirname, '../exclusions');

  fs.readdir(exclusionsDir, function (err, files) {
    if (err) { callback(err); }

    (function readFile() {
      var file = files.pop();
      if (!file) { return callback(null, Object.keys(robots).length); }

      var type = file.substr(0, file.indexOf('.'));
      var list;

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

        var partial = /^[0-9]+\.[0-9]+\.[0-9]+$/;

        content.toString().split(/\r?\n/).forEach(function (line) {
          var comment = line.indexOf('#');
          if (comment >= 0) { line = line.substr(0, comment); }
          line = line.trim();

          if (line.length > 0) {
            if (partial.test(line)) {
              for (var i = 0; i <= 255; i++) { list[line + '.' + i] = 1; }
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
  var validCodes = ['200', '304'];
  var deniedCodes = ['401', '403'];
  var filterRedirs = job.hasOwnProperty('filterRedirs')
    ? job.filterRedirs
    : true;

  if (!filterRedirs) {
    validCodes = validCodes.concat(['301', '302']);
  }

  if (!ec.url || !ec.timestamp) {
    job.logger.silly('Missing field: url or timestamp');
    return { valid: false, reason: 'Missing field: url or timestamp' };
  }
  if (!ec.domain && !job.forceParser ) {
    job.logger.silly('Missing field: domain', ec.domain);
    return { valid: false, reason: 'Missing field: domain' };
  }

  // Filters images and javascript files
  if (/\.otf|\.css|\.gif|\.jpg|\.png|favicon\.ico/i.test(ec.url) || /\.js$/.test(ec.url)) {
    return { valid: false, reason: 'Not interesting hit: otf, css, gif, jpg, png, favicon' };
  }
  // Filters http codes other than 200 or 304
  if (ec.status && validCodes.indexOf(ec.status) == -1) {
    // Let 401 and 403 pass, but mark them as denied
    if (deniedCodes.indexOf(ec.status) != -1) {
      ec._meta.granted = false;
    } else {
      return {
        valid: false,
        reason: 'Ignored HTTP response code: ' + ec.status +
                ' (only ' + validCodes.join(',') + ' are kept)'
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
  var level = 0;
  for (var field in qualifyingFactors) {
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
