'use strict';

/* Controllers of the process page */

angular.module('ezPAARSE.form-controllers')
  .controller('ProcessCtrl', function ($scope, $rootScope, requestService) {
    $scope.request = requestService.data;
  });