'use strict';

angular.module('ezPAARSE', [
  'ui.router',
  'ezPAARSE.services',
  'ezPAARSE.controllers',
  'ezPAARSE.directives'
  // 'ezPAARSE.filters'
]).config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/process');

  var login = {
    name: 'login',
    url: '/login',
    templateUrl: 'partials/login'
  };
  var home = {
    name: 'home',
    url: '/',
    templateUrl: 'partials/index',
    abstract: true,
    resolve: {
      /**
       * When accessing any page, check that a user is authenticated.
       * If not, request the session from the server.
       * Redirect to login in case of failure.
       */
      userSession: function (userService, $state, $http) {
        if (userService.isAuthenticated()) { return; }

        return $http.get('/session').success(function (user) {
          if (!user) {
            $state.go('login');
            return;
          }

          userService.login(user.username, user.group);
          return;
        }).error(function () {
          $state.go('login');
        });
      }
    }
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
// .factory('loginInterceptor', function ($q, $injector) {
//   // Redirect to login page if a request gets a 401
//   return {
//     responseError: function(rejection) {
//       if (rejection.status === 401) {
//         $injector.get('$state').transitionTo('login');
//       }
//       return $q.reject(rejection);
//      }
//    };
// }).config(function ($httpProvider) {
//   $httpProvider.interceptors.push('loginInterceptor');
// })