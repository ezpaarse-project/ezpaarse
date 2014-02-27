'use strict';

/* Controllers */

angular.module('ezPAARSE.controllers', []).
  controller('AppCtrl', function ($scope, $state, userService) {

    $scope.login = { group: 'user' };
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
      userService.logout();
      $scope.user = null;
      $state.transitionTo('login');
    }
  });