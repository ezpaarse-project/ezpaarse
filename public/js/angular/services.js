'use strict';

/* Services */

angular.module('ezPAARSE.services', [])
  .service('userService', function () {
    function userService() {
      this.user = { logged: false };
    };

    userService.prototype.login = function (name, group) {
      this.user.name   = name;
      this.user.group  = group;
      this.user.logged = true;
    };

    userService.prototype.logout = function () {
      this.user.logged = false;
    };

    userService.prototype.hasAccess = function () {
      if (!this.user || !this.user.group || arguments.length === 0) {
        return false;
      }

      return (Array.prototype.indexOf.call(arguments, this.user.group) !== -1);
    };

    userService.prototype.isAuthenticated = function () {
      return this.user.logged;
    };

    return new userService();
  }).service('requestService', function ($rootScope) {
    function requestService() {
      this.data = {
        state: 'idle',
        progress: 0
      };
    };

    requestService.prototype.abort = function (callback) {
      var self = this;

      if (this.xhr) {
        // Workaround : call function out of angular context
        setTimeout(function () {
          self.xhr.abort();
          callback();
        }, 1);
      }
    };

    requestService.prototype.send = function (formData, headers) {
      if (this.data.state == 'loading') { return false; }

      var self               = this;
      var jobID              = uuid.v1();
      this.data.state        = 'loading';
      this.data.errorMessage = '';

      headers = headers || {};
      headers['Socket-ID'] = this.data.socketID;

      this.xhr = $.ajax({
        headers:     headers || {},
        type:        'PUT',
        url:         '/' + jobID,
        // dataType:    'html',
        data:        formData,
        cache:       false,
        contentType: false,
        processData: false,
        xhr: function () {
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
        complete: function () {
          self.xhr = null;
        },
        success: function (data) {
          $rootScope.$apply(function () {
            self.data.state = 'success';
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $rootScope.$apply(function () {
            if (textStatus == 'abort') {
              self.data.state = 'aborted';
              return;
            }

            var errorCode    = jqXHR.getResponseHeader("ezPAARSE-Status");
            var errorMessage = jqXHR.getResponseHeader("ezPAARSE-Status-Message");

            if (errorCode && errorMessage) {
              self.data.errorMessage = errorCode + ' : ' + errorMessage;
            } else {
              self.data.errorMessage = 'Une erreur est survenue';
            }

            self.data.state = 'error';
          });
        }
      });

      return true;
    };

    return new requestService();
  })
  .service('settingService', function ($cookieStore) {
    function settingService() {

      this.selections = {
        proxyTypes: [
          'EZproxy',
          'Apache',
          'Squid'
        ],
        encodings: [
          'UTF-8',
          'ISO-8859-1'
        ],
        resultFormats: [
          { type: 'CSV',  mime: 'text/csv' },
          { type: 'TSV',  mime: 'text/tab-separated-values' },
          { type: 'JSON', mime: 'application/json' }
        ],
        tracesLevels: [
          { level: 'error',   desc: 'Erreurs uniquement' },
          { level: 'warn',    desc: 'Warnings sans conséquences' },
          { level: 'info',    desc: 'Informations générales' },
          { level: 'verbose', desc: '-- vraiment nécessaire? --' },
          { level: 'silly',   desc: 'Détails du traitement' }
        ]
      };

      this.defaults = {
        remember: true,
        outputFields: [],
        headers: {
          'Accept':           'text/csv',
          'Traces-Level':     'info',
          'Response-Charset': 'UTF-8',
          'Request-Charset':  'UTF-8'
        }
      };

      this.settings = angular.copy(this.defaults);
    };

    settingService.prototype.addOutputField = function (name, type) {
      this.settings.outputFields.push({ name: name, type: type });
    };
    settingService.prototype.removeOutputField = function (index) {
      this.settings.outputFields.splice(index, 1);
    };

    settingService.prototype.addCustomHeader = function () {
      if (!this.settings.customHeaders) { this.settings.customHeaders = []; }
      this.settings.customHeaders.push({ name: '', value: '' });
    };
    settingService.prototype.removeCustomHeader = function (index) {
      this.settings.customHeaders.splice(index, 1);
    };

    var empty = function (obj) { for (var i in obj) { delete obj[i]; } }
    settingService.prototype.loadDefault = function () {
      empty(this.settings);
      var defaults = angular.copy(this.defaults);

      for (var opt in defaults) {
        this.settings[opt] = defaults[opt];
      }
    };

    settingService.prototype.loadSavedSettings = function () {
      this.loadDefault();

      var settings = $cookieStore.get('settings');
      if (!settings) { return; }

      for (var opt in settings) {
        this.settings[opt] = settings[opt];
      }
    };

    settingService.prototype.saveSettings = function () {
      if (this.settings.remember) {
        $cookieStore.put('settings', this.settings);
      } else {
        $cookieStore.put('settings', { remember: false });
      }
    };


    return new settingService();
  })
  .factory('socket', function (socketFactory) {
    return socketFactory();
  });