'use strict';

/* Controllers of the process page */

angular.module('ezPAARSE.form-controllers')
  .controller('ProcessCtrl', function ($scope, requestService, socket) {
    $scope.request = requestService.data;
    $scope.report  = {};

    socket.on('report', function (report) {
      $scope.report = report;
    });
  });