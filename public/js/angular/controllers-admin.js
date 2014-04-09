'use strict';

/* Controllers of the admin page */

angular.module('ezPAARSE.admin-controllers', [])
  .controller('AdminCtrl', function ($scope, $http) {
    $scope.credentials = {};
    $scope.repos = {
      pkb: 'refresh',
      parsers: 'refresh'
    };

    $http.get('/pkb/status')
      .success(function (data) { $scope.repos.pkb = data.trim(); })
      .error(function ()       { $scope.repos.pkb = 'error'; });
    $http.get('/parsers/status')
      .success(function (data) { $scope.repos.parsers = data.trim(); })
      .error(function ()       { $scope.repos.parsers = 'error'; });
    $http.get('/users/')
      .success(function (users) { $scope.users = users; })
      .error(function () { $scope.getUsersError = true; });

    $scope.updatePkb = function () {
      $scope.repos.pkb = 'refresh';
      $http.put('/pkb/status', 'uptodate')
        .success(function () { $scope.repos.pkb = 'uptodate'; })
        .error(function ()   { $scope.repos.pkb = 'error'; });
    };
    $scope.updateParsers = function () {
      $scope.repos.parsers = 'refresh';
      $http.put('/parsers/status', 'uptodate')
        .success(function () { $scope.repos.parsers = 'uptodate'; })
        .error(function ()   { $scope.repos.parsers = 'error'; });
    };

    $scope.deleteUser = function (userid) {
      $scope.postUserError = undefined;

      $http.delete('/users/' + userid)
        .success(function () {
          var index = $scope.users.indexOf(userid);
          $scope.users.splice(index, 1);
        })
        .error(function (data, status, headers) {
          var errorMessage    = headers('ezpaarse-status-message');
          $scope.postUserError = errorMessage || 'An error occured';
        });
    };

    $scope.createUser = function () {
      $scope.postUserError       = undefined;
      $scope.credentials.confirm = $scope.credentials.password;

      $http.post('/users/', $scope.credentials)
        .success(function (user) {
          $scope.users.push(user);
        })
        .error(function (data, status, headers) {
          var errorMessage     = headers('ezpaarse-status-message');
          $scope.postUserError = errorMessage || 'An error occured';
        });
    };

  });