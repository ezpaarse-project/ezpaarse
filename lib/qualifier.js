'use strict';

/**
 * Provides functions to check EC qualification
 */
var Qualifier = function () {
  var self = this;

  /**
   * Check if an EC is qualified
   * @param  {Object}  ec the EC to test
   * @return {boolean}    false if the EC is not qualified
   */
  self.check = function (ec) {
    if (ec.issn || ec.eissn || ec.doi || ec.rtype || ec.mime) {
      return true;
    }
    return false;
  }
}

module.exports = Qualifier;