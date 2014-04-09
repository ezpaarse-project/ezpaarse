'use strict';

/* Controllers of the form page */

angular.module('ezPAARSE.form-controllers', [])
  .controller('FormCtrl', function ($scope, $location, settingService, requestService, inputService) {
    if (requestService.data.state == 'loading') {
      $location.path('/process');
    }

    $scope.files     = [];
    $scope.totalSize = 0;
    $scope.showHelp  = false;
    $scope.inputType = 'files';
    $scope.ss        = settingService;
    $scope.inputs    = inputService;

    $scope.$watch('ss.settings', function () {
      settingService.saveSettings();
      settingService.control();
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
    $scope.removeOutputField = function (name, type) {
      settingService.removeOutputField(name, type);
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
          inputService.addFile(files[i]);
        }
      });
    };

    $scope.selectFiles = function (fileInput) {
      var input = $(fileInput);
      var files = input.prop('files') || [];
      $scope.addFiles(files);
      input.val('');
    };

    $scope.getHeaders = function () {
      var settings = settingService.settings;
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

      return headers;
    };

    $scope.start = function () {
      var formData;

      if ($scope.inputType == 'text') {
        if (!inputService.text) { return; }
        formData = inputService.text;
      } else if (inputService.files.length > 0) {
        formData = new FormData();
        inputService.files.forEach(function (file) {
          formData.append("files[]", file);
        });
      } else {
        return;
      }

      requestService.send(formData, $scope.getHeaders());

      $location.path('/process');
    };
  });