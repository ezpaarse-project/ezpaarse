'use strict';

/* Controllers of the admin page */

angular.module('ezPAARSE.admin-controllers', [])
  .controller('AdminCtrl', function ($scope, $http) {
    $scope.credentials = {};

    $http.get('/users/')
      .success(function (users) {
        $scope.users = users;
      })
      .error(function () {
        $scope.getUsersError = true;
      });

    $scope.deleteUser = function (userid) {
      $scope.postUserError = undefined;

      $http.delete('/users/' + userid)
        .success(function () {
          var index = $scope.users.indexOf(userid);
          $scope.users.splice(index, 1);
        })
        .error(function (data, status, headers) {
          var errorMessage    = headers('ezpaarse-status-message');
          $scope.postUserError = errorMessage || 'An error occured';
        });
    };

    $scope.createUser = function () {
      $scope.postUserError       = undefined;
      $scope.credentials.confirm = $scope.credentials.password;

      $http.post('/users/', $scope.credentials)
        .success(function (user) {
          $scope.users.push(user);
        })
        .error(function (data, status, headers) {
          var errorMessage     = headers('ezpaarse-status-message');
          $scope.postUserError = errorMessage || 'An error occured';
        });
    };

  });