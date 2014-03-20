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

    $element.find('form').on('reset', function () {
      $scope.$apply(function () {
        $scope.error = null;
      });
    });

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
        var err = 'Une erreur est survenue';
        if (status == 401) { err = 'Identifiant ou mot de passe incorrect'; }
        $scope.error = err;
      });
    };
  }).controller('RegisterCtrl', function ($scope, $state, $http, userService, $element) {
    $scope.formData = {};
    $scope.error    = null;

    $element.find('form').on('reset', function () {
      $scope.$apply(function () {
        $scope.error = null;
      });
    });

    $scope.register = function () {
      $scope.loading = true;

      $http.post('/users/', $scope.formData)
      .success(function (user) {
        userService.login(user.username, user.group);
        $scope.user    = userService.user;
        $scope.loading = false;

        $element.modal('hide');
        $state.transitionTo('form');
      })
      .error(function (data, status, headers) {
        $scope.loading = false;
        var err        = headers('ezPAARSE-Status-Message');
        $scope.error   = err ? err : 'Une erreur est survenue';
      });
    };
  }).controller('FormCtrl', function ($scope) {

    $scope.files         = [];
    $scope.totalSize     = 0;
    $scope.progress      = 0;
    $scope.progressStyle = { width: '0%' };
    $scope.showHelp      = false;

    $scope.proxyTypes = [
      'EZproxy',
      'Apache',
      'Squid'
    ];

    $scope.encodings = [
      'UTF-8',
      'ISO-8859-1'
    ];

    $scope.resultFormats = [
      { type: 'CSV', mime: 'text/csv' },
      { type: 'TSV', mime: 'text/tab-separated-values' },
      { type: 'JSON', mime: 'application/json' }
    ];

    $scope.tracesLevels = [
      { level: 'error', desc: 'Erreurs uniquement' },
      { level: 'warn', desc: 'Warnings sans conséquences' },
      { level: 'info', desc: 'Informations générales' },
      { level: 'verbose', desc: '-- vraiment nécessaire? --' },
      { level: 'silly', desc: 'Détails du traitement' }
    ];

    var defaultSettings = {
      tracesLevel: 'info',
      resultFormat: 'text/csv',
      outputEncoding: 'UTF-8',
      inputEncoding: 'UTF-8'
    };

    $scope.loadDefault = function () {
      $scope.settings = {};
      for (var setting in defaultSettings) {
        $scope.settings[setting] = defaultSettings[setting];
      }
    };
    $scope.loadDefault();

    $scope.toggleHelp = function () {
      $scope.showHelp = !$scope.showHelp;
    };

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