'use strict';

/* Controllers of the anonymous pages */

angular.module('ezPAARSE.anonymous-controllers', [])
  .controller('ReportCtrl', function ($scope, $stateParams, $http, $anchorScroll, $timeout) {
    $scope.tracesLoading = true;
    $scope.reportLoading = true;

    $http.get('/' + $stateParams.jobID + '/job-report.json')
      .success(function (data) {
        $scope.reportLoading = false;
        if (angular.isObject(data)) {
          var rejects = [
            { cat: 'general', key: 'nb-denied-ecs',            },
            { cat: 'rejets',  key: 'nb-lines-duplicate-ecs',   },
            { cat: 'rejets',  key: 'nb-lines-unordered-ecs',   },
            { cat: 'rejets',  key: 'nb-lines-ignored-domains', },
            { cat: 'rejets',  key: 'nb-lines-unknown-domains', },
            { cat: 'rejets',  key: 'nb-lines-unknown-formats', },
            { cat: 'rejets',  key: 'nb-lines-unqualified-ecs', },
            { cat: 'rejets',  key: 'nb-lines-pkb-miss-ecs',    }
          ];
          rejects.forEach(function (reject) {
            if (data[reject.cat][reject.key] === 0) {
              data[reject.cat][reject.key.replace(/^nb(?:-lines)?/, 'url')] = '';
            }
          });

          $scope.report = data;
          $timeout($anchorScroll);
        } else {
          $scope.reportError = true;
        }
      })
      .error(function () {
        $scope.reportLoading = false;
        $scope.reportError   = true;
      });

    function toJsonArray(data) {
      if (!data) { return []; }

      var logs = [];
      data.split('\n').forEach(function (line) {
        try {
          logs.push(JSON.parse(line));
        } catch (e) {
          return;
        }
      });

      return logs;
    }

    $http.get('/' + $stateParams.jobID + '/job-traces.log', { transformResponse: toJsonArray })
      .success(function (data) {
        $scope.tracesLoading = false;
        $scope.traces        = data;
      })
      .error(function () {
        $scope.tracesLoading = false;
        $scope.tracesError   = true;
      });
  });