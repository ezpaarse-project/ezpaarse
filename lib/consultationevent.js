'use strict';

var fs                = require('fs');
var path              = require('path');
var config            = require('./config.js');
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
function ConsultationEvent() {
  this._meta = {};
}
module.exports = ConsultationEvent;

/**
 * Remove all meta attributes / functions
 */
ConsultationEvent.prototype._clean = function () {
  for (var attr in this) {
    if (/^_/.test(attr)) { delete this[attr]; }
  }
};

/**
 * Check if the EC is qualified
 * @return {boolean} true if the EC is qualified, otherwise false
 */
ConsultationEvent.prototype._isQualified = function () {
  var level = 0;
  for (var field in qualifyingFactors) {
    if (this[field]) {
      level += qualifyingFactors[field];
      if (level >= qualifyingLevel) { return true; }
    }
  }
  return false;
};
