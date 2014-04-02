'use strict';

/* Controllers of the anonymous pages */

angular.module('ezPAARSE.anonymous-controllers', [])
  .controller('ReportCtrl', function ($scope, $stateParams, $http, $anchorScroll, $timeout) {

    $http.get('/' + $stateParams.jobID + '/job-report.json')
      .success(function (data) {
        if (angular.isObject(data)) {
          $scope.report = data;
          $timeout($anchorScroll);
        } else {
          $scope.error = true;
        }
      })
      .error(function () {
        $scope.error = true;
      });
  });