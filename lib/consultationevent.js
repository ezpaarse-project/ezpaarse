'use strict';

var fs                = require('fs');
var path              = require('path');
var config            = require('../config.json');
var qualifyingLevel   = config.EZPAARSE_QUALIFYING_LEVEL;
var qualifyingFactors = config.EZPAARSE_QUALIFYING_FACTORS.internal;
var externalFactors   = config.EZPAARSE_QUALIFYING_FACTORS.external;

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
    var level = 0;
    for (var field in qualifyingFactors) {
      if (self[field]) {
        level += qualifyingFactors[field];
        if (level >= qualifyingLevel) { return true; }
      }
    }
    return false;
  };
};

module.exports = ConsultationEvent;