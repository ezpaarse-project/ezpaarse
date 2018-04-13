'use strict';

/* Controllers for auth */

angular.module('ezPAARSE.main-controllers', [])
  .controller('AppCtrl', function ($scope, $state, userService, $http, $translate, $location, ipCookie, requestService, inputService, socket) {

    $scope.request     = requestService.data;
    $scope.emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
    $scope.contact     = {
      facebook: 'https://www.facebook.com/Ezpaarse',
      googleplus: 'https://plus.google.com/113684662646843807159',
      twitter: 'https://twitter.com/ezpaarse',
      mail: 'ezpaarse@couperin.org'
    };

    $scope.links = {
      github: 'https://github.com/ezpaarse-project/ezpaarse',
      platforms: 'http://analyses.ezpaarse.org/',
      api: 'http://ezpaarse.readthedocs.io/en/master/development/routes.html',
      nodejs: 'http://nodejs.org/',
      expressjs: 'http://expressjs.com/'
    }

    $scope.useLanguage = function (lang) {
      if (!ezLanguages.hasOwnProperty(lang)) { lang = 'fr'; }

      $translate.use(lang);
      $scope.currentLanguage = lang;
      ipCookie('lang', lang, { expires: 180 });
    };

    var querylang = $location.search().lang;
    $scope.useLanguage(querylang || ipCookie('lang') || 'fr');
    $location.search('lang', null);

    $scope.auth = userService;

    $scope.logout = function () {
      var cb = function () {
        userService.logout();
        $state.transitionTo('login');
      };
      requestService.abort(function () {
        requestService.reset();
        requestService.cleanHistory();
      });
      inputService.clear();
      $http.get('/logout').then(cb, cb);
    };

    socket.on('disconnect', function () {
      $scope.disconnected = true;
    });
    socket.on('reconnect', function () {
      $scope.disconnected = false;
    });


    $scope.feedbackLoading = true;
    $http.get('/feedback/status')
      .success(function (data) {
        $scope.feedbackLoading    = false;
        $scope.feedbackAvailable  = true;
        $scope.feedbackRecipients = data;
      })
      .error(function ()   {
        $scope.feedbackLoading   = false;
        $scope.feedbackAvailable = false;
      });

    $scope.castor = { loading: true };
    $http.get('/castor/status')
      .success(function (data) {
        $scope.castor = angular.isObject(data) ? data : { state: 'error' };
      })
      .error(function () {
        $scope.castor = { state: 'error' };
      });

    socket.on('castor:update', function (data) {
      $scope.castor = angular.isObject(data) ? data : { state: 'error' };
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
      mail: userService.user ? userService.user.username : undefined
    };
    $scope.sendBrowser = true;
    $scope.request     = requestService.data;
    $scope.jobsHistory = requestService.history;

    $scope.$watch('jobsHistory.length', function (newVal, oldVal) {
      if (newVal == oldVal || newVal < 1) { return; }
      $scope.fb.jobID = $scope.jobsHistory[newVal - 1].id;
    });

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
        $scope.error   = true;
      });
    }
  })
  .controller('LoginPageCtrl', function ($scope, $http, $rootScope) {
    $rootScope.noUsers = undefined;

    $http.get('/usersnumber')
    .success(function (data) {
      var number = parseInt(data);
      $rootScope.noUsers = isNaN(number) || number === 0;
    })
    .error(function () {
      $rootScope.noUsers = false;
    });
  })
  .controller('PasswordResetCtrl', function ($scope, $state, $http, userService, $element) {
    $scope.error = null;

    $element.find('form').on('reset', function () {
      $scope.$apply(function () {
        $scope.resetForm.$setPristine();
        $scope.error   = null;
        $scope.success = null;
      });
    });


    $scope.resetPassword = function (valid) {
      if (!valid || !$scope.userid) { return; }
      $scope.loading = true;

      $http.post('/passwords/' + $scope.userid)
      .success(function (user) {

        $scope.resetForm.$setPristine();
        $scope.loading = false;
        $scope.success = true;
        $scope.userid  = '';
        $scope.error   = null;
      })
      .error(function (data, status) {
        $scope.loading = false;
        $scope.success = false;
        $scope.error   = status || true;
      });
    };
  })
  .controller('LoginCtrl', function ($scope, $state, $http, userService, $element) {
    $scope.credentials = {};
    $scope.error       = null;

    $element.find('form').on('reset', function () {
      $scope.$apply(function () {
        $scope.loginForm.$setPristine();
        $scope.error = null;
      });
    });

    $scope.login = function (valid) {
      // Workaround to trigger models update when form is auto-completed
      $element.find('input').each(function () { $(this).trigger('input'); });

      if ($scope.loginForm.$invalid) { return; }
      $scope.loading = true;

      $http.post('/login', $scope.credentials)
      .success(function (user) {
        userService.login(user);

        $scope.loginForm.$setPristine();
        $scope.loading     = false;
        $scope.credentials = {};
        $scope.error       = null;

        $state.transitionTo('form');
        $element.modal('hide');
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
    $scope.formData = { informTeam: true };
    $scope.error    = null;

    $element.find('form').on('reset', function () {
      $scope.$apply(function () {
        $scope.registerForm.$setPristine();
        $scope.error = null;
      });
    });

    $scope.cancelForm = function () {
      $element.modal('hide');
      $scope.formData = { informTeam: true };
    };

    $scope.register = function (valid) {
      if (!valid) { return; }
      $scope.loading = true;

      $http.post('/register', $scope.formData)
      .success(function (user) {
        userService.login(user);

        if ($scope.feedbackAvailable && $scope.formData.informTeam && $scope.noUsers === true) {
          $http.post('/feedback/freshinstall', { mail: user.username });
        }

        $scope.registerForm.$setPristine();
        $scope.loading  = false;
        $scope.formData = {};
        $scope.error    = null;

        $element.modal('hide');
        $state.transitionTo('form');
      })
      .error(function (data, status, headers) {
        $scope.loading = false;
        var err        = headers('ezPAARSE-Status-Message');
        $scope.error   = err ? 'login+' + err : 'login+an_error_occurred';
      });
    };
  });
