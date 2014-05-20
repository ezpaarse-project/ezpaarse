'use strict';

/* Controllers of the admin page */

angular.module('ezPAARSE.admin-controllers', [])
  .controller('AdminCtrl', function ($scope, $http) {
    $scope.credentials = {};
    $scope.platformsStatus = 'refresh';

    $http.get('/platforms/status')
      .success(function (data) { $scope.platformsStatus = data.trim(); })
      .error(function ()       { $scope.platformsStatus = 'error'; });
    $http.get('/users/')
      .success(function (users) { $scope.users = users; })
      .error(function () { $scope.getUsersError = true; });

    $scope.updatePkb = function () {
      $scope.platformsStatus = 'refresh';
      $http.put('/pkb/status', 'uptodate')
        .success(function () { $scope.platformsStatus = 'uptodate'; })
        .error(function ()   { $scope.platformsStatus = 'error'; });
    };

    $scope.deleteUser = function (userid) {
      $scope.postUserError = undefined;

      $http.delete('/users/' + userid)
        .success(function () {
          for (var i = $scope.users.length - 1; i>=0; i--) {
            if ($scope.users[i].username == userid) {
              $scope.users.splice(i, 1);
              break;
            }
          }
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