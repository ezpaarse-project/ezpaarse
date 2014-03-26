'use strict';

/* Services */

angular.module('ezPAARSE.services', [])
  .service('userService', function () {
    function userService() {
      this.user = null;
      this.loginListeners  = [];
      this.logoutListeners = [];
    };

    userService.prototype.login = function (name, group) {
      var self = this;
      this.user = {
        name: name,
        group: group
      };
      this.loginListeners.forEach(function (fn) { fn(self.user); });
    };

    userService.prototype.logout = function () {
      this.user = null;
      this.logoutListeners.forEach(function (fn) { fn(); });
    };

    userService.prototype.hasAccess = function () {
      if (!this.user || !this.user.group || arguments.length === 0) {
        return false;
      }

      return (Array.prototype.indexOf.call(arguments, this.user.group) !== -1);
    };

    userService.prototype.isAuthenticated = function () {
      return this.user ? true : false;
    };

    userService.prototype.onLogin = function (fn) {
      this.loginListeners.push(fn);
    };
    userService.prototype.onLogout = function (fn) {
      this.logoutListeners.push(fn);
    };

    return new userService();
  }).service('requestService', function ($rootScope) {
    function requestService() {
      this.processing = false;
    };

    requestService.prototype.send = function (formData, headers) {
      if (this.processing) { return false; }

      var self        = this;
      this.processing = true;
      var jobID       = uuid.v1();
      $rootScope.$broadcast('process:start', jobID);

      $.ajax({
        headers:     headers || {},
        type:        'PUT',
        url:         '/' + jobID,
        // dataType:    'html',
        data:        formData,
        cache:       false,
        contentType: false,
        processData: false,
        xhr: function() {
          var myXhr = $.ajaxSettings.xhr();
          if (myXhr.upload) {
            myXhr.upload.addEventListener('progress', function (e) {
              if (e.lengthComputable) {
                var percentComplete = ( e.loaded * 100 ) / e.total;
                $rootScope.$broadcast('process:progress', percentComplete);
              }
            });
            myXhr.upload.addEventListener('load', function (e) {
              $rootScope.$broadcast('process:complete', 100);
            });
          }
          return myXhr;
        },
        complete: function () {
          self.processing = false;
        },
        success: function(data) {
          $rootScope.$broadcast('process:success');
        },
        error: function(jqXHR, textStatus, errorThrown) {
          var error = '';
          if (textStatus != 'abort') {
            var status  = jqXHR.getResponseHeader("ezPAARSE-Status");
            var message = jqXHR.getResponseHeader("ezPAARSE-Status-Message");
            error = 'Error ' + status + ' : ' + message;
          }
          $rootScope.$broadcast('process:error', error);
        }
      });

      return true;
    };

    return new requestService();
  });