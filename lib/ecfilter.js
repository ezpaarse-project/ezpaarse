'use strict';


/**
 * Provides functions to filter ECs
 */
var ECFilter = function () {
  var self = this;

  /**
   * Check if an EC should be ignored
   * @param  {Object}  ec the EC to test
   * @return {boolean}    false if the EC should be ignored
   */
  self.isValid = function (ec) {
    if (!ec.url || !ec.domain || !ec.timestamp) {
      return { valid: false, reason: 'Missing field: url, domain or timestamp' };
    }
    // Filters images and javascript files
    if (/\.css|\.gif|\.GIF|\.jpg|\.JPG|favicon\.ico/.test(ec.url) || /\.js$/.test(ec.url)) {
      return { valid: false, reason: 'Not interesting hit: css, git, jpg, favicon ...' };
    }
    // Filters http codes other than 200 or 304
    if (ec.status && ['200', '304'].indexOf(ec.status) == -1) {
      return {
        valid: false,
        reason: 'Ignored HTTP response code: ' + ec.status + ' (only 200 and 304 are kept)'
      };
    }
    return { valid: true };
  };
};

module.exports = ECFilter;