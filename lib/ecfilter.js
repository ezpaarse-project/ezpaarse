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
      return false;
    }
    // Filters images and javascript files
    if (/\.css|\.gif|\.GIF|\.jpg|\.JPG|favicon\.ico/.test(ec.url) || /\.js$/.test(ec.url)) {
      return false;
    }
    // Filters http codes other than 200 or 304
    if (ec.status && ['200', '304'].indexOf(ec.status) == -1) {
      return false;
    }
    return true;
  };
};

module.exports = ECFilter;