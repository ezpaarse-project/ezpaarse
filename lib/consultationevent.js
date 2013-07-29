/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

/**
 * Create a consultation event
 */
var ConsultationEvent = function () {
  var self = this;
  self._meta = {};

  /**
   * Remove all meta attributes / functions
   */
  self._clean = function () {
    for (var attr in self) {
      if (/^_/.test(attr)) { delete self[attr]; }
    }
  };

  /**
   * Check if the EC is qualified
   * @return {boolean} true if the EC is qualified, otherwise false
   */
  self._isQualified = function () {
    if (self.issn || self.eissn || self.doi || self.rtype || self.mime) {
      return true;
    }
    return false;
  };
};

module.exports = ConsultationEvent;