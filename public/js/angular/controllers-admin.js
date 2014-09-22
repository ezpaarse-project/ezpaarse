'use strict';

/* Controllers of the admin page */

angular.module('ezPAARSE.admin-controllers', [])
  .controller('AdminCtrl', function ($scope, $http) {
    $scope.tab = 'general';
    $scope.soft = {
      version: 'stable',
      updating: false
    };

    $scope.selectTab = function (tabName) { $scope.tab = tabName; };

    $scope.refreshStatus = function (what) {
      if (!what || what == 'platforms') {
        $scope.platformsStatus = { status: 'refresh' };
        $http.get('/platforms/status')
          .success(function (data) { $scope.platformsStatus = data; })
          .error(function ()       { $scope.platformsStatus = 'error'; });
      }

      if (!what || what == 'software') {
        $scope.softwareStatus = { status: 'refresh' };
        $http.get('/app/status?ref=' + $scope.soft.version)
          .success(function (data) {
            $scope.softwareStatus = data;
            $scope.soft.currentVersion = data.version;
          })
          .error(function () { $scope.softwareStatus = 'error'; });
      }
    };

    $scope.refreshStatus();
  })
  .controller('AdminPlatformsCtrl', function ($scope, $http) {
    $scope.updatePlatforms = function () {
      $scope.platformsStatus = { status: 'refresh' };
      $http.put('/platforms/status', 'uptodate')
        .success(function () { $scope.refreshStatus('platforms'); })
        .error(function ()   { $scope.platformsStatus = 'error'; });
    };
  })
  .controller('AdminUsersCtrl', function ($scope, $http) {
    $scope.credentials = {};

    $http.get('/users/')
      .success(function (users) { $scope.users = users; })
      .error(function () { $scope.getUsersError = true; });

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
  })
  .controller('AdminGeneralCtrl', function ($scope, $http) {

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

    $scope.updateSoftWare = function () {
      $scope.softwareStatus = { status: 'refresh' };
      $scope.soft.updating  = true;

      $http.put('/app/status?version=' + $scope.soft.version)
        .success(function () { checkOnline(function () {
          $scope.soft.updating = false;
          $scope.refreshStatus(); });
        })
        .error(function () {
          $scope.soft.updating  = false;
          $scope.softwareStatus = 'error';
        });
    };
  });