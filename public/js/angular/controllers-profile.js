'use strict';

/* Controllers of the admin page */

angular.module('ezPAARSE.profile-controllers', [])
  .controller('ProfileCtrl', function ($scope, $http, userService, $timeout) {
    var user = userService.user || {};
    var prf = $scope.prf = {
      notifiate: { val: user.notifiate }
    };

    prf.submitNotifications = function () {
      prf.notifiate.error   = false;
      prf.notifiate.success = false;
      prf.notifiate.saving  = true;

      $http.post('/profile', {
        section: 'notifications',
        notifiate: prf.notifiate.val
      })
      .success(function (data) {
        prf.notifiate.saving  = false;
        prf.notifiate.success = true;
        user.notifiate        = prf.notifiate.val;

        $timeout(function() {
          prf.notifiate.success = false;
        }, 1000);
      })
      .error(function (data, status, headers) {
        prf.notifiate.saving  = false;

        var error = headers('ezpaarse-status-message');
        prf.notifiate.error = error ? 'profile+' + error : 'profile+an_error_occurred';
      });
    };

    prf.submitPassword = function (valid) {
      $scope.passwordForm.oldPassword.$pristine = false;
      $scope.passwordForm.newPassword.$pristine = false;
      $scope.passwordForm.confirm.$pristine     = false;
      if (!valid) { return; }

      prf.password.error   = false;
      prf.password.success = false;
      prf.password.saving  = true;

      $http.post('/profile', {
        section: 'password',
        oldPassword: prf.password.oldPassword,
        newPassword: prf.password.newPassword,
        confirm: prf.password.confirm
      })
      .success(function (data) {
        prf.password.saving  = false;
        prf.password.success = true;
      })
      .error(function (data, status, headers) {
        prf.password.saving  = false;

        var error = headers('ezpaarse-status-message');
        prf.password.error = error ? 'profile+' + error : 'profile+an_error_occurred';
      });
    };
  });