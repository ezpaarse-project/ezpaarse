'use strict';

/* Controllers of the admin page */

angular.module('ezPAARSE.profile-controllers', [])
  .controller('ProfileCtrl', function ($scope, $http) {
    var prf = $scope.prf = {};

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