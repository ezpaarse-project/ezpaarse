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
        refreshing: false,
        sort: '+longname'
      },
      selectedPKBs: {}
    };

    var adm = $scope.adm;

    adm.sortBy = function (name) {
      var sort  = adm.platforms.sort.substr(1);
      var order = adm.platforms.sort.charAt(0);

      if (sort == name) {
        adm.platforms.sort = (order == '+' ? '-' : '+') + name;
      } else {
        adm.platforms.sort = '+' + name;
      }
    };

    adm.togglePkbOf = function (platform) {
      if (adm.selectedPKBs[platform]) {
        delete adm.selectedPKBs[platform];
      } else {
        adm.selectedPKBs[platform] = true;
      }
    };

    adm.selectTab = function (tabName) {
      adm.tab = tabName;
      $location.search('tab', tabName);
    };

    adm.refreshStatus = function (what) {
      if (!what || what == 'platforms') {
        adm.platforms.refreshing        = true;
        adm.platforms.refreshingList    = true;
        adm.platforms.errored           = false;
        adm.platforms.erroredList       = false;
        adm.platforms.erroredChanges    = false;

        $http.get('/platforms/status')
          .success(function (data) {
            adm.platforms.git            = data;
            adm.platforms.refreshing     = false;
            adm.platforms.currentVersion = data.current;
            adm.platforms.outdated       = data['from-head'] == 'outdated';
          })
          .error(function ()       {
            adm.platforms.errored    = true;
            adm.platforms.refreshing = false;
          });

        $http.get('/info/platforms')
          .success(function (list) {
            adm.platforms.list     = list;
            adm.platforms.brandNew = [];

            $http.get('/info/platforms/changed')
              .success(function (changed) {
                adm.platforms.changed  = changed;

                for (var platform in changed) {
                  for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i].name == platform) {
                      list[i].hasChanges = true;
                      break;
                    }
                  }

                  if (i < 0) { adm.platforms.brandNew.push(platform); }
                }

                adm.platforms.refreshingList = false;
              })
              .error(function () {
                adm.platforms.erroredChanges = true;
                adm.platforms.refreshingList = false;
              });
          })
          .error(function () {
            adm.platforms.erroredList    = true;
            adm.platforms.refreshingList = false;
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

    adm.credentials  = {};
    adm.changed      = {};
    adm.loadingUsers = true;

    $http.get('/users/')
      .success(function (users) {
        adm.users        = users;
        adm.loadingUsers = false;
      })
      .error(function () {
        adm.usersError   = 'admin+get_users_fail';
        adm.loadingUsers = false;
      });

    adm.toggleModification = function (user) {
      var mail = user.username;
      adm.changed[mail] = adm.changed[mail] ? false : angular.copy(user);
    };

    adm.saveUser = function (userid) {
      var changedUser = adm.changed[userid];
      if (!changedUser) { return; }

      changedUser._saving = true;

      $http.post('/users/' + userid, changedUser)
        .success(function (newUser) {
          adm.changed[userid] = false;

          for (var i = adm.users.length - 1; i >= 0; i--) {
            if (adm.users[i].username == userid) {
              adm.users[i] = newUser;
              break;
            }
          }
        })
        .error(function (data, status, headers) {
          var err             = headers('ezPAARSE-Status-Message');
          adm.usersError      = err ? 'admin+' + err : 'admin+an_error_occurred';
          changedUser._saving = false;
        });
    };

    adm.deleteUser = function (userid) {
      adm.usersError = null;

      $http({ method: 'DELETE', url: '/users/' + userid })
        .success(function () {
          for (var i = adm.users.length - 1; i >= 0; i--) {
            if (adm.users[i].username == userid) {
              adm.users.splice(i, 1);
              break;
            }
          }
        })
        .error(function (data, status, headers) {
          var err = headers('ezpaarse-status-message');
          adm.usersError = err ? 'admin+' + err : 'admin+an_error_occurred';
        });
    };

    adm.createUser = function () {
      adm.creatingUser        = true;
      adm.usersError          = null;
      adm.credentials.confirm = adm.credentials.password;
      $http.post('/users/', adm.credentials)
        .success(function (user) {
          adm.users.push(user);
          adm.creatingUser = false;
        })
        .error(function (data, status, headers) {
          adm.creatingUser = false;
          var err          = headers('ezPAARSE-Status-Message');
          adm.usersError   = err ? 'admin+' + err : 'admin+an_error_occurred';
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

      version = version || (adm.software.isBeta ? 'latest' : 'stable');

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
  })
  .controller('AdminJobsCtrl', function ($scope, $http, socket) {
    var jobs = $scope.adm.jobs = {};

    var getJobs = function () {
      jobs.loading = true;
      jobs.error   = false;

      $http.get('/jobs?socket=' + socket._id)
      .success(function (data) {
        jobs.list    = data;
        jobs.loading = false;
      })
      .error(function () {
        jobs.loading = false;
        jobs.error   = true;
      });
    };

    getJobs();
    if (!socket._id) {
      socket.once('connected', getJobs);
    }

    socket.on('jobs', function (jobs) {
      $scope.adm.jobs = jobs;
    });
  });