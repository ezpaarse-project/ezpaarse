'use strict';

/**
 * Provides functions to filter ECs
 */

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

  if (!ec.url || !ec.domain || !ec.timestamp) {
    return { valid: false, reason: 'Missing field: url, domain or timestamp' };
  }
  // Filters images and javascript files
  if (/\.css|\.gif|\.GIF|\.jpg|\.JPG|favicon\.ico/.test(ec.url) || /\.js$/.test(ec.url)) {
    return { valid: false, reason: 'Not interesting hit: css, git, jpg, favicon ...' };
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