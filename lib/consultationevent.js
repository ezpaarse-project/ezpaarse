/*jslint node: true, maxlen: 100, maxerr: 50, indent: 2 */
'use strict';

/**
 * Create a consultation event
 */
var ConsultationEvent = function () {
  var self = this;
  self._meta = { isValid: false };

  self._clean = function () {
    for (var attr in self) {
      if (/^_/.test(attr)) { delete self[attr]; }
    }
  };
};

module.exports = ConsultationEvent;