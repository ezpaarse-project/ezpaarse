'use strict';

/* Controllers for auth */

angular.module('ezPAARSE.main-controllers', [])
  .controller('AppCtrl', function ($scope, $state, userService, $http, requestService, inputService, socket) {

    $scope.emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
    $scope.contact = {
      facebook: 'https://www.facebook.com/Ezpaarse',
      googleplus: 'https://plus.google.com/113684662646843807159',
      twitter: 'https://twitter.com/ezpaarse',
      mail: 'ezpaarse@gmail.com'
    };

    $scope.user = userService.user;

    $scope.hasAccess = function () {
      return userService.hasAccess('admin');
    };

    $scope.logout = function () {
      var cb = function () {
        userService.logout();
        $state.transitionTo('login');
      };
      requestService.abort();
      inputService.clear();
      $http.get('/logout').then(cb, cb);
    };

    /**
     * Give socket ID to the request service
     */
    socket.on('connected', function (socketID) {
      requestService.data.socketID = socketID;
    });

    /**
     * Get app version
     */
    $http.get('/info/version')
      .success(function (version)    { $scope.ezVersion = version; })
      .error(function (data, status) { $scope.ezVersion = '...'; });

  }).controller('LoginCtrl', function ($scope, $state, $http, userService, $element) {
    $scope.credentials = {};
    $scope.error       = null;

    $element.find('form').on('reset', function () {
      $scope.$apply(function () {
        $scope.error = null;
      });
    });

    $scope.login = function (valid) {
      if (!valid) { return; }
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

    $scope.register = function (valid) {
      if (!valid) { return; }
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