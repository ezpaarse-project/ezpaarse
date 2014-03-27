'use strict';

/* Controllers for auth */

angular.module('ezPAARSE.auth-controllers', [])
  .controller('AppCtrl', function ($scope, $state, userService, $http) {

    $scope.user = userService.user;

    $scope.hasAccess = function () {
      return userService.hasAccess('admin');
    };

    $scope.logout = function () {
      var cb = function () {
        userService.logout();
        $state.transitionTo('login');
      };

      $http.get('/logout').then(cb, cb);
    };

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
  });