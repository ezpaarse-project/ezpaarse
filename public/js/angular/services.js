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
      this.data = {
        state: 'idle',
        progress: 0
      }
    };

    requestService.prototype.send = function (formData, headers) {
      if (this.data.state == 'loading') { return false; }

      var self        = this;
      var jobID       = uuid.v1();
      this.data.state = 'loading';

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
                $rootScope.$apply(function () {
                  self.data.progress = ((e.loaded * 100) / e.total).toFixed(1);
                });
              }
            });
            myXhr.upload.addEventListener('load', function (e) {
              $rootScope.$apply(function () {
                self.data.progress = 100;
              });
            });
          }
          return myXhr;
        },
        success: function(data) {
          $rootScope.$apply(function () {
            self.data.state = 'success';
          });
        },
        error: function(jqXHR, textStatus, errorThrown) {
          $rootScope.$apply(function () {
            if (textStatus == 'abort') {
              self.data.state = 'aborted';
              return;
            }

            self.data.errorCode    = jqXHR.getResponseHeader("ezPAARSE-Status");
            self.data.errorMessage = jqXHR.getResponseHeader("ezPAARSE-Status-Message");
            self.data.state   = 'error';
          });
        }
      });

      return true;
    };

    return new requestService();
  });