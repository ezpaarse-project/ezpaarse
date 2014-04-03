'use strict';

/* Controllers of the admin page */

angular.module('ezPAARSE.admin-controllers', [])
  .controller('AdminCtrl', function ($scope, $http) {
    $http.get('/users/')
      .success(function (users) {
        $scope.users = users;
      });
  });