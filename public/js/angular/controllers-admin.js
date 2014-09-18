'use strict';

/* Controllers of the admin page */

angular.module('ezPAARSE.admin-controllers', [])
  .controller('AdminCtrl', function ($scope, $http) {
    $scope.credentials = {};
    $scope.platformsStatus = 'refresh';
    $scope.softwareStatus  = 'refresh';

    function refreshStatus() {
      $http.get('/platforms/status')
        .success(function (data) { $scope.platformsStatus = data.trim(); })
        .error(function ()       { $scope.platformsStatus = 'error'; });
      $http.get('/app/status')
        .success(function (data) { $scope.softwareStatus = data.trim(); })
        .error(function ()       { $scope.softwareStatus = 'error'; });
    }
    refreshStatus();

    $http.get('/users/')
      .success(function (users) { $scope.users = users; })
      .error(function () { $scope.getUsersError = true; });

    /**
     * Check every 5sec if the server is online
     */
    var checkOnline = function (callback) {
      setTimeout(function () {
        $http.get('/', { timeout: 5000 })
        .success(callback)
        .error(checkOnline);
      }, 5000);
    };

    $scope.updatePlatforms = function () {
      $scope.platformsStatus = 'refresh';
      $http.put('/platforms/status', 'uptodate')
        .success(function () { $scope.platformsStatus = 'uptodate'; })
        .error(function ()   { $scope.platformsStatus = 'error'; });
    };

    $scope.updateSoftWare = function () {
      $scope.softwareStatus = 'refresh';
      $http.put('/app/status?version=latest&rebuild=no') // TODO turn rebuild back on
        .success(function () { checkOnline(refreshStatus); })
        .error(function () { $scope.softwareStatus = 'error'; });
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