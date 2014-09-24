'use strict';

/* Controllers of the admin page */

angular.module('ezPAARSE.admin-controllers', [])
  .controller('AdminCtrl', function ($scope, $http, $location) {
    $scope.adm = {
      tab: $location.search().tab || 'platforms',
      software: {
        refreshing: false,
        updating: false
      },
      platforms: {
        refreshing: false
      }
    };

    var adm = $scope.adm;

    adm.selectTab = function (tabName) {
      adm.tab = tabName;
      $location.search('tab', tabName);
    };

    adm.refreshStatus = function (what) {
      if (!what || what == 'platforms') {
        adm.platforms.refreshing = true;
        adm.platforms.errored    = false;

        $http.get('/platforms/status')
          .success(function (data) {
            adm.platforms.git           = data;
            adm.platforms.refreshing    = false;
            adm.platforms.currentVersion = data.current;

            adm.platforms.outdated = data['from-head'] == 'outdated';
          })
          .error(function ()       {
            adm.platforms.errored    = true;
            adm.platforms.refreshing = false;
          });
      }

      if (!what || what == 'software') {
        adm.software.refreshing = true;
        adm.software.errored    = false;

        $http.get('/app/status')
          .success(function (data) {
            adm.software.git = data;
            adm.software.currentVersion = data.current;

            adm.software.isBeta   = !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(data.current);
            adm.software.latest   = adm.software.isBeta ? data.head : data.tag;
            adm.software.outdated = (adm.software.isBeta ? data['from-head'] : data['from-tag']) == 'outdated';

            adm.software.refreshing = false;
          })
          .error(function () {
            adm.software.refreshing = false;
            adm.software.errored    = true;
          });
      }
    };

    adm.refreshStatus();
  })
  .controller('AdminPlatformsCtrl', function ($scope, $http) {
    var adm = $scope.adm;

    adm.updatePlatforms = function () {
      adm.platforms.refreshing = true;

      $http.put('/platforms/status', 'uptodate')
        .success(function () { adm.refreshStatus('platforms'); })
        .error(function ()   {
          adm.platforms.refreshing = false;
          adm.platforms.errored    = true;
        });
    };
  })
  .controller('AdminUsersCtrl', function ($scope, $http) {
    var adm = $scope.adm;

    adm.credentials = {};

    $http.get('/users/')
      .success(function (users) { adm.users = users; })
      .error(function () { adm.getUsersError = true; });

    adm.deleteUser = function (userid) {
      adm.postUserError = undefined;

      $http.delete('/users/' + userid)
        .success(function () {
          for (var i = adm.users.length - 1; i>=0; i--) {
            if (adm.users[i].username == userid) {
              adm.users.splice(i, 1);
              break;
            }
          }
        })
        .error(function (data, status, headers) {
          var errorMessage    = headers('ezpaarse-status-message');
          adm.postUserError = errorMessage || 'An error occured';
        });
    };

    adm.createUser = function () {
      adm.postUserError       = undefined;
      adm.credentials.confirm = adm.credentials.password;
      $http.post('/users/', adm.credentials)
        .success(function (user) {
          adm.users.push(user);
        })
        .error(function (data, status, headers) {
          var errorMessage  = headers('ezpaarse-status-message');
          adm.postUserError = errorMessage || 'An error occured';
        });
    };
  })
  .controller('AdminSystemCtrl', function ($scope, $http, $timeout) {
    var adm = $scope.adm;

    /**
     * Used to display elapsed time during software update
     */
    var timer = {
      start: function () {
        if (timer.started) { return; }
        timer.started   = true;
        timer.startTime = new Date().getTime();
        timer.elapsed();
      },
      elapsed: function () {
        var now = new Date().getTime();
        var elapsed = new Date(now - timer.startTime);

        adm.software.longUpdate = (elapsed > 300000);

        var seconds = elapsed.getSeconds().toString();
        if (seconds.length == 1) { seconds = '0' + seconds; }
        var minutes = elapsed.getMinutes().toString();
        if (minutes.length == 1) { minutes = '0' + minutes; }

        adm.software.elapsed = minutes + ':' + seconds;

        if (timer.started) { timer.timeoutID = $timeout(timer.elapsed, 1000); }
      },
      stop: function () {
        timer.started = false;
        $timeout.cancel(timer.timeoutID);
      }
    }

    /**
     * Check every 5sec if the server is online
     */
    var checkOnline = function (callback) {
      $timeout(function () {
        $http.get('/', { timeout: 5000 })
        .success(function () { callback(); })
        .error(function () { checkOnline(callback); });
      }, 5000);
    };

    adm.updateSoftware = function (version) {
      adm.software.refreshing = true;
      adm.software.updating = true;

      version = version || adm.software.isBeta ? 'latest' : 'stable';

      $http.put('/app/status?version=' + version)
        .success(function () {
          timer.start();

          checkOnline(function () {
            timer.stop();
            adm.software.updating = false;
            adm.refreshStatus();
          });
        })
        .error(function () {
          adm.software.updating   = false;
          adm.software.errored    = true;
          adm.software.refreshing = false;
        });
    };
  });