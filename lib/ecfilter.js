/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';


/**
 * Provides functions to filter ECs
 */
var ECFilter = function () {
  var that = this;

  /**
   * Check if an EC should be ignored
   * @param  {Object}  ec the EC to test
   * @return {boolean}    false if the ec should be ignored
   */
  that.isValid = function (ec) {
    if (!ec.url || !ec.domain) {
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