'use strict';

var alertRate = require('../config.js').EZPAARSE_ALERTS.unknownDomainsRate;

/**
 * Alert - unknown domains
 */
module.exports = function () {
  var _domains = {};

  return {
    increment: function (domain) {
      if (!domain) { return; }

      if (_domains[domain]) {
        _domains[domain]++;
      } else {
        _domains[domain] = 1;
      }
    },
    alerts: function (job) {
      var totalLines     = job.report.get('general', 'nb-lines-input');
      var ignoredLines   = job.report.get('rejets', 'nb-lines-ignored');
      var pertinentLines = totalLines - ignoredLines;

      for (var domain in _domains) {
        var rate = Math.round(_domains[domain] / pertinentLines * 100);

        if (rate >= alertRate) {
          job.alerts.push(domain + ' is unknown but represents ' + rate + '% of the log lines');
        }
      }
    }
  };
};
