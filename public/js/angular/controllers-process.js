'use strict';

/* Controllers of the process page */

angular.module('ezPAARSE.form-controllers')
  .controller('ProcessCtrl', function ($scope, requestService) {
    $scope.request = requestService.data;
  });