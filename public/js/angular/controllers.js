'use strict';

/* Controllers */

angular.module('ezPAARSE.controllers', [])
  .controller('AppCtrl', function ($scope, $state, userService, $http) {

    userService.onLogin(function (user) {
      $scope.user = user;
    });
    userService.onLogout(function () {
      $scope.user = null;
    });

    $scope.login  = { group: 'user' };
    $scope.groups = [
      { value: 'user', label: "Utilisateur" },
      { value: 'admin', label: "Administrateur" }
    ];

    $scope.fakeConnect = function () {
      userService.login($scope.login.name, $scope.login.group);
      $scope.user = userService.user;
      $state.transitionTo('process');
    };

    $scope.hasAccess = function () {
      return userService.hasAccess('admin');
    }

    $scope.logout = function () {
      var cb = function () {
        userService.logout();
        $scope.user = null;
        $state.transitionTo('login');
      };

      $http.get('/logout').then(cb, cb);
    }

  }).controller('LoginCtrl', function ($scope, $state, $http, userService, $element) {
    $scope.credentials = {};
    $scope.error       = null;

    $scope.login = function () {
      $scope.loading = true;

      $http.post('/login', $scope.credentials)
      .success(function (user) {
        userService.login(user.username, user.group);
        $scope.user    = userService.user;
        $scope.loading = false;

        $element.modal('hide');
        $state.transitionTo('form');
      })
      .error(function (data, status) {
        $scope.loading = false;
        $scope.error = status == 401 ? 'bad credentials' : 'unknown';
      });
    };
  }).controller('FormCtrl', function ($scope, $http) {

    $scope.files         = [];
    $scope.totalSize     = 0;
    $scope.progress      = 0;
    $scope.progressStyle = { width: '0%' };


    var updateTotalSize = function () {
      $scope.totalSize = 0;
      for (var i = 0, l = $scope.files.length; i < l; i++) {
        $scope.totalSize += $scope.files[i].size;
      }
    }

    $scope.addFiles = function (files) {
      if (!files) { return; }

      $scope.$apply(function () {
        for (var i = 0, l = files.length; i < l; i++) {
          $scope.files.push(files[i]);
        }
        updateTotalSize();
      });
    };

    $scope.removeFile = function (index) {
      $scope.files.splice(index, 1);
      updateTotalSize();
    };

    $scope.selectFiles = function (fileInput) {
      var input = $(fileInput);
      var files = input.prop('files') || [];
      $scope.addFiles(files);
      input.val('');
    };

    $scope.start = function (ajax) {
      var jobid    = uuid.v1();
      var formData = new FormData();

      $scope.files.forEach(function (file) {
        formData.append("files[]", file);
      });

      $.ajax({
        headers:     {},
        type:        'PUT',
        url:         '/' + jobid,
        // dataType:    'html',
        data:        formData,
        cache:       false,
        contentType: false,
        processData: false,
        xhr: function() {
          var myXhr = $.ajaxSettings.xhr();
          if (myXhr.upload) {
            myXhr.upload.addEventListener('progress', function (e) {
              if (e.lengthComputable) {
                var percentComplete = ( e.loaded * 100 ) / e.total;
                $scope.$apply(function () {
                  $scope.progressStyle.width = percentComplete + '%';
                  $scope.progress = percentComplete.toFixed(1);
                });
              }
            });
            myXhr.upload.addEventListener('load', function (e) {
              $scope.$apply(function () {
                $scope.progressStyle.width = '100%';
                $scope.progress = 100;
              });
            });
          }
          return myXhr;
        },
        success: function(data) {
          console.log('Success');
        },
        error: function(jqXHR, textStatus, errorThrown) {
          if (textStatus != 'abort') {
            var status  = jqXHR.getResponseHeader("ezPAARSE-Status");
            var message = jqXHR.getResponseHeader("ezPAARSE-Status-Message");
            console.log('Error %s : %s', status, message);
          }
        }
      });
    };
  });