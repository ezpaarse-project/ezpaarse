'use strict';

var alertConfig       = require('../config.js').EZPAARSE_ALERTS;
var maxOccurrenceRate = alertConfig.titleIdOccurrenceRate;
var maxFailRate       = alertConfig.pkbFailRate;


/**
 * Alert - missing title IDs
 */
module.exports = function () {
  var _platforms = {};
  var _noPkb     = {};

  var initPlatform = function (platform) {
    var pl = {
      queries: 0,  //number of queries to the PKB
      titleIDs: {} //number of unsuccessful queries for each title ID
    };

    _platforms[platform] = pl;
    return pl;
  };

  return {
    /**
     * Increment the number of queries to a PKB
     */
    incrementQueries: function (platform) {
      if (_platforms.hasOwnProperty(platform)) {
        _platforms[platform].queries++;
      } else {
        initPlatform(platform).queries++;
      }
    },
    /**
     * Increment the number of unsuccessful queries for a title ID
     */
    incrementMisses: function (platform, pid) {
      var titleIDs = _platforms[platform].titleIDs;

      if (titleIDs.hasOwnProperty(pid)) {
        titleIDs[pid]++;
      } else {
        titleIDs[pid] = 1;
      }
    },
    /**
     * Flag a platform that has no PKB
     */
    noPkbFor: function (platform) {
      if (!_noPkb.hasOwnProperty(platform)) {
        _noPkb[platform] = 1;
      }
    },
    alerts: function (job) {
      var queries;
      var titleIDs;
      var totalMisses;
      var alert;
      var occurrenceRate;

      for (var pl in _noPkb) {
        job.alerts.push(pl + ' : no PKB found but some ECs needed one');
      }

      for (var platform in _platforms) {
        queries     = _platforms[platform].queries;
        titleIDs    = _platforms[platform].titleIDs;
        totalMisses = 0;

        for (var pid in titleIDs) {
          totalMisses   += titleIDs[pid];
          occurrenceRate = Math.round(titleIDs[pid] / queries * 1000) / 10;

          if (occurrenceRate > maxOccurrenceRate) {
            alert  = 'The title_id "' + pid + '" is not present in the PKB of ' + platform;
            alert += ' but has been requested in ' + occurrenceRate + '% of the queries';
            job.alerts.push(alert);
          }
        }

        var failRate = Math.round(totalMisses / queries * 1000) / 10;
        if (failRate > maxFailRate) {
          alert = platform + ' : ' + failRate + '% of the queries in the PKB were unsuccessful';
          job.alerts.push(alert);
        }
      }
    }
  };
};
