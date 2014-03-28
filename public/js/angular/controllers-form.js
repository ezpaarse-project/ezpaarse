'use strict';

/* Controllers of the form page */

angular.module('ezPAARSE.form-controllers', [])
  .controller('FormCtrl', function ($scope, $location, settingService, requestService) {
    if (requestService.data.state == 'loading') {
      $location.path('/process');
    }

    $scope.files       = [];
    $scope.totalSize   = 0;
    $scope.showHelp    = false;
    $scope.inputType   = 'files';
    $scope.selections  = settingService.selections;
    $scope.settings    = settingService.settings;

    $scope.loadDefault = function () {
      settingService.loadDefault();
    }
    settingService.loadSavedSettings();

    $scope.$watch('settings', function () {
      settingService.saveSettings();
    }, true);

    $scope.selectTab  = function (type) { $scope.inputType = type; };
    $scope.toggleHelp = function ()     { $scope.showHelp  = !$scope.showHelp; };

    $scope.addOutputField = function (type) {
      var input = (type == 'plus') ? 'plusField' : 'minusField';

      if ($scope[input]) {
        settingService.addOutputField($scope[input], type);
        $scope[input] = '';
      }
    };
    $scope.removeOutputField = function (index, evt) {
      evt.stopPropagation();
      settingService.removeOutputField(index);
    };

    $scope.addCustomHeader = settingService.addCustomHeader;
    $scope.removeCustomHeader = function (index, evt) {
      evt.stopPropagation();
      settingService.removeCustomHeader();
    };

    var updateTotalSize = function () {
      $scope.totalSize = 0;
      for (var i = 0, l = $scope.files.length; i < l; i++) {
        $scope.totalSize += $scope.files[i].size;
      }
    };

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

    $scope.start = function () {
      var formData;
      if ($scope.inputType == 'text') {
        if (!$scope.directInput) { return; }
        formData = $scope.directInput;
      } else {
        if (!$scope.files.length) { return; }
        formData = new FormData();
        $scope.files.forEach(function (file) {
          formData.append("files[]", file);
        });
      }

      var settings = $scope.settings;
      var headers  = angular.copy(settings.headers);

      if (settings.proxyType && settings.logFormat) {
        headers['Log-Format-' + settings.proxyType] = settings.logFormat;
      }

      // Create Output-Fields
      if (settings.outputFields && settings.outputFields.length) {
        var outputFields = '';
        settings.outputFields.forEach(function (field) {
          outputFields += field.type == 'plus' ? '+' : '-';
          outputFields += field.name + ',';
        });
        headers['Output-Fields'] = outputFields.substr(0, outputFields.length - 1);
      }

      if (settings.customHeaders && settings.customHeaders.length) {
        settings.customHeaders.forEach(function (header) {
          if (header.name && header.value) { headers[header.name] = header.value; }
        });
      }

      requestService.send(formData, headers);

      $location.path('/process');
    };
  });