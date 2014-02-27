'use strict';

/* Services */

angular.module('ezPAARSE.services', [])
  .service('userService', function () {
    function userService() {
      this.user = null;
    };

    userService.prototype.login = function (name, group) {
      this.user = {
        name: name,
        group: group
      };
    };

    userService.prototype.logout = function () {
      this.user = null;
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

    return new userService();
  });