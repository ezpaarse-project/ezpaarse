/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

var qualifying = require('../config.json').EZPAARSE_QUALIFYING_FIELDS;
var lgt = qualifying.length;

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
    for (var i = 0; i < lgt; i++) {
      if (self[qualifying[i]]) { return true; }
    }
    return false;
  };
};

module.exports = ConsultationEvent;