/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';


/**
 * Provides functions to filter ECs
 * @param {[type]} bufferSize [description]
 */
var ECFilter = function (ignoredDomains) {
  var that = this;
  that.ignoredDomains = ignoredDomains || [];

  /**
   * Check if an EC should be ignored
   * @param  {Object}  ec the EC to test
   * @return {boolean}    false if the ec should be ignored
   */
  that.isValid = function (ec) {
    if (!ec.url || !ec.domain || ignoredDomains.indexOf(ec.domain) !== -1) {
      return false;
    }
    // Filters images and javascript files
    if (/\.css|\.gif|\.GIF|\.jpg|\.JPG|favicon\.ico/.test(ec.url) || /\.js$/.test(ec.url)) {
      return false;
    }
    // Filters http codes other than 200 and 302
    if (ec.status && ['200', '302'].indexOf(ec.status) == -1) {
      return false;
    }
    return true;
  }
}

module.exports = ECFilter;