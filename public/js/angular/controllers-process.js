'use strict';

/* Controllers of the process page */

angular.module('ezPAARSE.form-controllers')
  .controller('ProcessCtrl', function ($scope, $location, requestService) {
    if (requestService.data.state == 'idle') {
      $location.path('/form');
    }

    $scope.request = requestService.data;
    $scope.tab     = 'metrics';

    $scope.selectTab = function (tab) { $scope.tab = tab; };
    $scope.selectHelper = function (helper) { $scope.helper = helper; };

    $scope.abort = function () {
      requestService.abort(function () {
        $location.path('/form');
      });
    };

    $scope.inProgress = function () {
      return requestService.isLoading();
    };
  });