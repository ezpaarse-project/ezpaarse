'use strict';

angular.module('ezPAARSE', [
  'ui.router',
  'ipCookie',
  'ngSanitize',
  'btford.socket-io',
  'pascalprecht.translate',
  'localytics.directives',
  'ezPAARSE.services',
  'ezPAARSE.main-controllers',
  'ezPAARSE.form-controllers',
  'ezPAARSE.anonymous-controllers',
  'ezPAARSE.admin-controllers',
  'ezPAARSE.profile-controllers',
  'ezPAARSE.directives',
  'ezPAARSE.filters'
]).config(function ($stateProvider, $locationProvider, $urlRouterProvider, $translateProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/form');

  for (var lang in ezLanguages) {
    $translateProvider.translations(lang, ezLanguages[lang]);
  }
  $translateProvider.preferredLanguage('fr');

  var login = {
    name: 'login',
    url: '/login',
    templateUrl: '/partials/login'
  };
  var home = {
    name: 'home',
    url: '/',
    templateUrl: '/partials/index',
    abstract: true,
    resolve: {
      /**
       * When accessing any page, check that a user is authenticated.
       * If not, request the session from the server.
       * Redirect to login in case of failure.
       */
      isConnected: function (userService, $state, $http, $q) {
        if (userService.isAuthenticated()) { return true; }

        var deferred = $q.defer();
        $http.get('/session').success(function (user) {
          if (user) {
            userService.login(user.username, user.group);
          }

          deferred.resolve(user ? true : false);
        }).error(function () {
          deferred.resolve(false);
        });

        return deferred.promise;
      }
    }
  };

  var checkAuth = function (groups) {
    return function ($state, userService, isConnected) {
      if (!isConnected) { $state.go('login'); }

      if (groups && groups.split(',').indexOf(userService.user.group) == -1) {
        $state.go('form');
      }
    };
  };

  var process = {
    name: 'process',
    url: 'process',
    parent: home,
    templateUrl: '/partials/process',
    onEnter: checkAuth()
  };
  var form = {
    name: 'form',
    url: 'form',
    parent: home,
    templateUrl: '/partials/form',
    onEnter: checkAuth()
  };
  var profile = {
    name: 'profile',
    url: 'profile',
    parent: home,
    templateUrl: '/partials/profile',
    onEnter: checkAuth()
  };
  var admin = {
    name: 'admin',
    url: 'admin',
    parent: home,
    templateUrl: '/partials/admin',
    onEnter: checkAuth('admin')
  };
  var report = {
    name: 'report',
    url: 'report/:jobID',
    parent: home,
    templateUrl: '/partials/report'
  };

  $stateProvider.state(login);
  $stateProvider.state(home);
  $stateProvider.state(process);
  $stateProvider.state(form);
  $stateProvider.state(profile);
  $stateProvider.state(admin);
  $stateProvider.state(report);

});
