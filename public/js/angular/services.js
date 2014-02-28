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
  });