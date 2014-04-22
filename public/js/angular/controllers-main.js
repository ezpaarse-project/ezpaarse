'use strict';

/* Controllers for auth */

angular.module('ezPAARSE.main-controllers', [])
  .controller('AppCtrl', function ($scope, $state, userService, $http, $translate, $location, $cookies, requestService, inputService, socket) {

    $scope.emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
    $scope.contact = {
      facebook: 'https://www.facebook.com/Ezpaarse',
      googleplus: 'https://plus.google.com/113684662646843807159',
      twitter: 'https://twitter.com/ezpaarse',
      mail: 'ezpaarse@gmail.com'
    };

    $scope.links = {
      github: 'https://github.com/ezpaarse-project/ezpaarse',
      platforms: 'http://analogist.couperin.org/platforms/',
      api: '/doc/routes.html',
      nodejs: 'http://nodejs.org/',
      expressjs: 'http://expressjs.com/'
    }

    $scope.useLanguage = function (lang) {
      if (!ezLanguages.hasOwnProperty(lang)) { lang = 'fr'; }

      $translate.use(lang);
      $scope.currentLanguage = lang;
      $cookies.lang = lang;
    };

    var querylang = $location.search().lang;
    $scope.useLanguage(querylang || $cookies.lang || 'fr');
    $location.search('lang', null);

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
      requestService.cleanHistory();
      inputService.clear();
      $http.get('/logout').then(cb, cb);
    };

    /**
     * Give socket ID to the request service
     */
    socket.on('connected', function (socketID) {
      requestService.data.socketID = socketID;
    });

    $scope.feedbackLoading = true;
    $http.get('/feedback/status')
      .success(function () {
        console.log('OK !');
        $scope.feedbackLoading   = false;
        $scope.feedbackAvailable = true;
      })
      .error(function ()   {
        console.log('KO.');
        $scope.feedbackLoading   = false;
        $scope.feedbackAvailable = false;
      });

    /**
     * Get app version
     */
    $http.get('/info/version')
      .success(function (version)    { $scope.ezVersion = version; })
      .error(function (data, status) { $scope.ezVersion = '...'; });
  })
  .controller('FeedbackCtrl', function ($scope, $http, userService, requestService) {
    $scope.fb = {
      mail: userService.user ? userService.user.name : undefined
    };
    $scope.request = requestService.data;

    $scope.sendFeedback = function (valid) {
      $scope.feedbackForm.comment.$pristine = false;
      $scope.feedbackForm.email.$pristine = false;
      if (!valid || $scope.sending) { return; }

      $scope.error   = false;
      $scope.success = false;
      $scope.sending = true;
      var data = angular.copy($scope.fb);

      if ($scope.sendBrowser) { data.browser = navigator.userAgent; };

      $http.post('/feedback', data)
      .success(function (data) {
        $scope.sending = false;
        $scope.success = true;
      })
      .error(function (data) {
        $scope.sending = false;
        $scope.error = 'Une erreur est survenue';
      });
    }
  })
  .controller('ConnectButtonsCtrl', function ($scope, $http) {
    $scope.checkingUsers = true;

    $http.get('/usersnumber')
    .success(function (data) {
      var number = parseInt(data);
      $scope.noUsers = isNaN(number) || number === 0;
    })
    .error(function () {
      $scope.noUsers = false;
    });
  })
  .controller('LoginCtrl', function ($scope, $state, $http, userService, $element) {
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
  })
  .controller('RegisterCtrl', function ($scope, $state, $http, userService, $element) {
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