'use strict';

/* Controllers of the process page */

angular.module('ezPAARSE.form-controllers')
  .controller('ProcessCtrl', function ($scope, requestService) {
    $scope.progress = '0';

    $scope.$on('process:progress', function (event, percentComplete) {
      $scope.$apply(function () {
        console.log('pouet: ' + percentComplete);
        $scope.progress = percentComplete.toFixed(1);
      });
    });
  });