'use strict';

angular.module('ezPAARSE', [
  'ezPAARSE.controllers',
  'ui.router'
  // 'ezPAARSE.filters',
  // 'ezPAARSE.services',
  // 'ezPAARSE.directives'
]).config(function ($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  var login = {
    name: 'login',
    url: '/login',
    templateUrl: 'partials/login'
  };
  var home = {
    name: 'home',
    url: '/',
    templateUrl: 'partials/index',
    abstract: true
  };
  var process = {
    name: 'process',
    url: 'process',
    parent: home,
    templateUrl: 'partials/process'
  };

  $stateProvider.state(login);
  $stateProvider.state(home);
  $stateProvider.state(process);
});