'use strict';

/* Controllers of the form page */

angular.module('ezPAARSE.form-controllers', ['ngCookies'])
  .controller('FormCtrl', function ($scope, $cookieStore) {

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
      remember: true,
      tracesLevel: 'info',
      resultFormat: 'text/csv',
      outputEncoding: 'UTF-8',
      inputEncoding: 'UTF-8',
      outputFields: []
    };

    $scope.loadDefault = function () {
      $scope.settings = angular.copy(defaultSettings);
    };

    $scope.loadCookie = function () {
      $scope.loadDefault();

      var settings = $cookieStore.get('settings');
      if (!settings) { return; }

      for (var opt in settings) {
        $scope.settings[opt] = settings[opt];
      }
    };

    $scope.loadCookie();

    $scope.$watch('settings', function saveCookie() {
      if ($scope.settings.remember) {
        $cookieStore.put('settings', $scope.settings);
      } else {
        $cookieStore.put('settings', { remember: $scope.settings.remember });
      }
    }, true);

    $scope.toggleHelp = function () {
      $scope.showHelp = !$scope.showHelp;
    };

    $scope.addField = function (type) {
      var input = (type == 'plus') ? 'plusField' : 'minusField';

      if ($scope[input]) {
        $scope.settings.outputFields.push({ name: $scope[input], type: type });
        $scope[input] = '';
      }
    };

    $scope.removeField = function (index, evt) {
      evt.stopPropagation();
      $scope.settings.outputFields.splice(index, 1);
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