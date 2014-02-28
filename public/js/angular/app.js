'use strict';

angular.module('ezPAARSE', [
  'ui.router',
  'ezPAARSE.services',
  'ezPAARSE.controllers'
  // 'ezPAARSE.directives'
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

})
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
.run(function ($rootScope, $state, userService) {

  // Redirect to login if not connected on state change
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.name != 'login' && !userService.isAuthenticated()) {
      event.preventDefault();
      $state.transitionTo('login');
    }
  });
});
