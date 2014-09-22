'use strict';

/* Controllers of the admin page */

angular.module('ezPAARSE.admin-controllers', [])
  .controller('AdminCtrl', function ($scope, $http) {
    $scope.adm = {
      tab: 'general',
      soft: {
        referenceVersion: 'stable',
        updating: false
      }
    };

    var adm = $scope.adm;

    adm.selectTab = function (tabName) { adm.tab = tabName; };

    adm.refreshStatus = function (what) {
      if (!what || what == 'platforms') {
        adm.platforms = { status: 'refresh' };

        $http.get('/platforms/status')
          .success(function (data) { adm.platforms = data; })
          .error(function ()       { adm.platforms = { status: 'error' }; });
      }

      if (!what || what == 'software') {
        adm.software = { status: 'refresh' };

        $http.get('/app/status?ref=' + adm.soft.referenceVersion)
          .success(function (data) {
            adm.software = data;
            adm.soft.currentVersion = data.version;
          })
          .error(function () { adm.softwareStatus = 'error'; });
      }
    };

    adm.refreshStatus();
  })
  .controller('AdminPlatformsCtrl', function ($scope, $http) {
    var adm = $scope.adm;

    adm.updatePlatforms = function () {
      adm.platforms = { status: 'refresh' };

      $http.put('/platforms/status', 'uptodate')
        .success(function () { adm.refreshStatus('platforms'); })
        .error(function ()   { adm.platforms = 'error'; });
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
    var adm = $scope.adm;

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

    adm.updateSoftWare = function () {
      adm.software      = { status: 'refresh' };
      adm.soft.updating = true;

      $http.put('/app/status?version=' + adm.soft.referenceVersion)
        .success(function () {
          checkOnline(function () {
            adm.soft.updating = false;
            adm.refreshStatus();
          });
        })
        .error(function () {
          adm.soft.updating = false;
          adm.software      = { status: 'error' };
        });
    };
  });