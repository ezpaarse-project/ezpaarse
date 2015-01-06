'use strict';

/* Services */

angular.module('ezPAARSE.services', [])
  .service('userService', function () {
    this.user = { logged: false };

    this.login = function (name, group) {
      this.user.name   = name;
      this.user.group  = group;
      this.user.logged = true;
    };

    this.logout = function () {
      this.user.logged = false;
    };

    this.hasAccess = function () {
      if (!this.user || !this.user.group || arguments.length === 0) {
        return false;
      }

      return (Array.prototype.indexOf.call(arguments, this.user.group) !== -1);
    };

    this.isAuthenticated = function () {
      return this.user.logged;
    };
  }).factory('requestService', function ($rootScope, socket) {
    function requestService() {
      var self  = this;
      this.history  = [];
      this.baseData = {
        state: 'idle',
        progress: 0,
        logs: [],
        report: {},
        rejects: [
          { cat: 'general', key: 'nb-denied-ecs',            percent: 0, title: 'rejects+denied_ecs' },
          { cat: 'rejets',  key: 'nb-lines-duplicate-ecs',   percent: 0, title: 'rejects+duplicates' },
          { cat: 'rejets',  key: 'nb-lines-unordered-ecs',   percent: 0, title: 'rejects+chrono_anomalies' },
          { cat: 'rejets',  key: 'nb-lines-ignored-domains', percent: 0, title: 'rejects+ignored_domains' },
          { cat: 'rejets',  key: 'nb-lines-unknown-domains', percent: 0, title: 'rejects+unknown_domains' },
          { cat: 'rejets',  key: 'nb-lines-unknown-formats', percent: 0, title: 'rejects+unknown_formats' },
          { cat: 'rejets',  key: 'nb-lines-unqualified-ecs', percent: 0, title: 'rejects+unqualified_ecs' },
          { cat: 'rejets',  key: 'nb-lines-pkb-miss-ecs',    percent: 0, title: 'rejects+missing_pkbs' }
        ]
      };
      this.data = angular.copy(this.baseData);

      /**
       * Give socket ID to the request service
       */
      socket.on('connected', function (socketID) {
        self.socketID = socketID;
      });

      this.loggingListener = function (log) {
        self.data.logs.push(log);
      };

      this.reportListener = function (report) {
        // Do nothing if it's not the good report
        if (report.general['Job-ID'] !== self.data.jobID) { return; }
        self.data.report = report;

        self.data.nbLines = report.general['nb-lines-input'] - report.rejets['nb-lines-ignored'];
        if (!self.data.nbLines) { self.data.nbLines = 0; return; }

        self.data.rejects.forEach(function (reject) {
          reject.number  = report[reject.cat][reject.key];
          reject.percent = (reject.number / self.data.nbLines) * 100;

          if (reject.number === 0) {
            report[reject.cat][reject.key.replace(/^nb(?:-lines)?/, 'url')] = '';
          }
        });
      };
    };

    requestService.prototype.cleanHistory = function () {
      this.history = [];
    };

    /**
     * Set state to idle, clean current request data and stop listening to socket events
     */
    requestService.prototype.reset = function () {
      socket.removeListener('report', this.reportListener);
      socket.removeListener('logging', this.loggingListener);

      for (var i in this.data) {
        delete this.data[i];
      }
      angular.extend(this.data, this.baseData);
    };

    requestService.prototype.isLoading = function () {
      return (this.data.state == 'loading' || this.data.state == 'finalisation');
    };

    requestService.prototype.abort = function (callback) {
      callback = callback || function () {};
      var self = this;

      if (this.xhr) {
        // Workaround : call function out of angular context
        setTimeout(function () {
          self.xhr.abort();
          callback();
        });
      }
    };

    requestService.prototype.send = function (input, headers) {
      if (this.data.state == 'loading') { return false; }

      this.reset();
      var self               = this;
      this.data.jobID        = uuid.v1();
      this.data.state        = 'loading';
      this.data.errorMessage = '';
      this.data.files        = [];

      var formData;

      if (typeof input == 'string') {
        formData = input;
      } else if (angular.isArray(input)) {
        formData = new FormData();
        input.forEach(function (file) {
          formData.append("files[]", file);
          self.data.files.push(file);
        });
      } else {
        return;
      }

      headers = headers || {};
      headers['Socket-ID'] = this.socketID;

      var currentJob = {
        id: this.data.jobID,
        date: new Date()
      };

      socket.on('logging', this.loggingListener);
      socket.on('report', this.reportListener);

      this.xhr = $.ajax({
        headers:     headers || {},
        type:        'POST',
        url:         '/' + this.data.jobID + '?_method=PUT',
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
                self.data.state    = 'finalisation';
              });
            });
          }
          return myXhr;
        },
        complete: function () {
          self.xhr = null;
          $rootScope.$apply(function () {
            self.history.push(currentJob);
          });
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
  .service('inputService', function ($http) {
    this.files    = [];
    this.text     = '';
    this.autoSort = true;

    this.clear = function () {
      this.files = [];
      this.text  = '';
    };

    this.has = function (type) {
      switch (type) {
      case 'text':
        return (this.text.length > 0);
      case 'files':
        return (this.files.length > 0);
      default:
        return false;
      }
    };

    this.clearFiles = function () {
      this.files = [];
    };

    this.updateTotalSize = function () {
      this.totalSize = 0;
      for (var i = this.files.length - 1; i >= 0; i--) {
        this.totalSize += this.files[i].size;
      }
    };

    this.sortFiles = function (file) {
      if (this.autoSort) {
        this.files.sort(function (f1, f2) {
          return (f1.name.toLowerCase() > f2.name.toLowerCase() ? 1 : -1);
        });
      }
    };

    this.addFile = function (file) {
      if (file) {
        this.files.push(file);
        this.updateTotalSize();
        this.sortFiles();
      }
    };

    this.removeFile = function (filename) {
      for (var i = this.files.length - 1; i >= 0; i--) {
        if (this.files[i].name == filename) {
          this.files.splice(i, 1);
          this.updateTotalSize();
          return;
        }
      }
    };
  })
  .factory('settingService', function (ipCookie, $http) {
    function settingService() {
      var self = this;

      this.selections = {
        proxyTypes: {
          'ezproxy': "EZproxy",
          'apache': "Apache",
          'squid': "Squid"
        },
        resultFormats: [
          { type: 'CSV',  mime: 'text/csv' },
          { type: 'TSV',  mime: 'text/tab-separated-values' },
          { type: 'JSON', mime: 'application/json' }
        ],
        tracesLevels: [
          { level: 'error',   desc: 'Erreurs uniquement' },
          { level: 'warn',    desc: 'Warnings sans conséquences' },
          { level: 'info',    desc: 'Informations générales' }
        ],
        headers: [
          { category: 'encoding',       name: 'Content-Encoding' },
          { category: 'encoding',       name: 'Accept-Encoding' },
          { category: 'encoding',       name: 'Request-Charset' },
          { category: 'encoding',       name: 'Response-Charset' },
          { category: 'format',         name: 'Accept' },
          { category: 'format',         name: 'Log-Format-xxx' },
          { category: 'format',         name: 'Date-Format' },
          { category: 'format',         name: 'Output-Fields' },
          { category: 'field-splitter', name: 'User-field[n]-src' },
          { category: 'field-splitter', name: 'User-field[n]-sep' },
          { category: 'field-splitter', name: 'User-field[n]-residual' },
          { category: 'field-splitter', name: 'User-field[n]-dest-xxx' },
          { category: 'counter',        name: 'COUNTER-Reports' },
          { category: 'counter',        name: 'COUNTER-Format' },
          { category: 'counter',        name: 'COUNTER-Customer' },
          { category: 'counter',        name: 'COUNTER-Vendor' },
          { category: 'deduplication',  name: 'Double-Click-Removal' },
          { category: 'deduplication',  name: 'Double-Click-HTML' },
          { category: 'deduplication',  name: 'Double-Click-PDF' },
          { category: 'deduplication',  name: 'Double-Click-MISC' },
          { category: 'deduplication',  name: 'Double-Click-Strategy' },
          { category: 'deduplication',  name: 'Double-Click-C-Field' },
          { category: 'deduplication',  name: 'Double-Click-L-Field' },
          { category: 'deduplication',  name: 'Double-Click-I-Field' },
          { category: 'anonymization',  name: 'Anonymize-host' },
          { category: 'anonymization',  name: 'Anonymize-login' },
          { category: 'other',          name: 'Traces-Level' },
          { category: 'other',          name: 'Reject-Files' },
          { category: 'other',          name: 'Clean-Only' },
          { category: 'other',          name: 'Relative-Domain' },
          { category: 'other',          name: 'Geoip' },
          { category: 'other',          name: 'ezPAARSE-Job-Notifications' },
          { category: 'other',          name: 'ezPAARSE-Enrich' },
          { category: 'other',          name: 'ezPAARSE-Predefined-Settings' },
          { category: 'other',          name: 'ezPAARSE-Filter-Redirects' }
        ]
      };

      this.remember = true;
      this.defaults = {
        counter: { jr1: false },
        outputFields: { plus: [], minus: [] },
        customHeaders: [],
        notificationMails: "",
        headers: {
          'Accept':          'text/csv',
          'Traces-Level':    'info',
          'Date-Format':     '',
          'Relative-Domain': ''
        }
      };

      this.settings = angular.copy(this.defaults);
      this._control = angular.copy(this.defaults);
      this.loadSavedSettings();

      $http.get('/info/predefined-settings')
        .success(function (data) {
          self.predefined = data;

          if (data[self.settingsType]) {
            var settings = self.getSettingsFrom(self.settingsType);
            if (settings) {
              self._control = settings;
              self.control();
            }
          }
        })
        .error(function () {
          self.predefined = {};
        });
    };

    /**
     * Check that current settings match the control object
     */
    settingService.prototype.control = function () {
      this.custom = !angular.equals(this.settings, this._control);
    };

    /**
     * Returns settings as a list of headers for a request
     */
    settingService.prototype.getHeaders = function () {
      var settings = this.settings;
      var headers  = angular.copy(settings.headers);

      if (this.settingsType && !this.custom) {
        return { 'ezPAARSE-Predefined-Settings': this.settingsType };
      }

      if (settings.proxyType && settings.logFormat) {
        headers['Log-Format-' + settings.proxyType] = settings.logFormat;
      }

      // Create COUNTER reports header
      if (settings.counter) {
        var reports = '';
        for (var name in settings.counter) {
          if (settings.counter[name]) {
            reports += name + ',';
          }
        }
        if (reports) {
          headers['COUNTER-Reports'] = reports.replace(/,$/, '');
          headers['COUNTER-Format']  = 'tsv';
        }
      }

      // Create notification header
      if (settings.notificationMails) {
        var notifications = '';
        settings.notificationMails.split(',').forEach(function (mail) {
          notifications += 'mail<' + mail.trim() + '>,';
        });
        headers['ezPAARSE-Job-Notifications'] = notifications.replace(/,$/, '');
      }

      // Create Output-Fields headers
      if (settings.outputFields) {
        var outputFields = '';

        if (settings.outputFields.plus && settings.outputFields.plus.length) {
          settings.outputFields.plus.forEach(function (field) {
            outputFields += '+' + field + ',';
          });
        }

        if (settings.outputFields.minus && settings.outputFields.minus.length) {
          settings.outputFields.minus.forEach(function (field) {
            outputFields += '-' + field + ',';
          });
        }

        headers['Output-Fields'] = outputFields.substr(0, outputFields.length - 1);
      }

      if (settings.customHeaders && settings.customHeaders.length) {
        settings.customHeaders.forEach(function (header) {
          if (header.name && header.value) {
            // Look case-insensitively for a header with the same name
            for (var n in headers) {
              if (n.toLowerCase() == header.name.toLowerCase()) {
                headers[n] = header.value;
                return;
              }
            }
            headers[header.name] = header.value;
          }
        });
      }

      return headers;
    };

    /**
     * Add an output field
     * @param {String} name name of the field
     * @param {String} type plus or minus
     */
    settingService.prototype.addOutputField = function (name, type) {
      if (type == 'plus' || type == 'minus') {
        this.settings.outputFields[type].push(name);
      }
    };
    /**
     * Remove an output field
     * @param  {Integer} index index in the array
     */
    settingService.prototype.removeOutputField = function (name, type) {
      if (type == 'plus' || type == 'minus') {
        var index = this.settings.outputFields[type].indexOf(name);
        if (index !== -1) {
          this.settings.outputFields[type].splice(index, 1);
        }
      }
    };

    /**
     * Add a custom header
     * @param {String} name  header name
     * @param {String} value header value
     */
    settingService.prototype.addCustomHeader = function (name, value) {
      if (!this.settings.customHeaders) {
        this.settings.customHeaders = [];
      }
      this.settings.customHeaders.push({ name: name, value: value });
    };
    /**
     * Remove a custom header
     * @param {Integer} index index in the array
     */
    settingService.prototype.removeCustomHeader = function (index) {
      this.settings.customHeaders.splice(index, 1);
    };

    /**
     * Reset settings to default
     */
    settingService.prototype.loadDefault = function () {
      this.settings     = angular.copy(this.defaults);
      this._control     = angular.copy(this.defaults);
      this.custom       = false;
      this.settingsType = undefined;
      this.saveSettings();
    };

    /**
     * Get settings from a predefined object
     * @param  {String} type predefined setting key
     * @return {Object}      settings
     */
    settingService.prototype.getSettingsFrom = function (type) {
      var setting = this.predefined[type];
      if (!setting || !setting.headers) { return; }

      var settings = angular.copy(this.defaults);
      var headers  = angular.copy(setting.headers);

      if (headers['Output-Fields']) {
        var fields = headers['Output-Fields'].split(',');
        fields.forEach(function (field) {
          field = field.trim();

          if (field) {
            var type = field.charAt(0) == '+' ? 'plus' : 'minus';
            settings.outputFields[type].push(field.substr(1));
          }
        });

        delete headers['Output-Fields'];
      }

      for (var name in headers) {
        if (this.defaults.headers[name] !== undefined) {
          settings.headers[name] = headers[name];

        } else if (/^Log-Format-[a-z]+$/i.test(name)) {
          settings.logFormat = headers[name];
          settings.proxyType = name.substr(11).toLowerCase();

        } else {
          settings.customHeaders.push({ name: name, value: headers[name] });
        }
      }

      return settings;
    };

    /**
     * Load settings from a predefined object
     * @param  {String} type predefined setting key
     */
    settingService.prototype.defineSettings = function (type) {
      this.settings = angular.copy(this.defaults);
      if (!type) {
        this.settingsType = undefined;
      }
      var settings = this.getSettingsFrom(type);

      if (settings) {
        this.settings     = settings;
        this.settingsType = type;
      }

      this._control = angular.copy(settings || this.defaults);
    };

    /**
     * Load ookies and overwrite current settings
     */
    settingService.prototype.loadSavedSettings = function () {

      this.remember     = ipCookie('remember');
      this.settingsType = ipCookie('settingsType');
      var settings      = ipCookie('settings');
      if (!settings) { return; }

      for (var opt in settings) {
        this.settings[opt] = settings[opt];
      }
    };

    /**
     * Save current remember setting to cookies and save or reset settings
     */
    settingService.prototype.saveRemember = function () {
      ipCookie('remember', this.remember, { expires: 180 });
      this.saveSettings();
    };

    /**
     * Save or reset settings depending to remember boolean
     */
    settingService.prototype.saveSettings = function () {
      if (this.remember && this.settings) {
        ipCookie('settings', this.settings, { expires: 180 });
      } else {
        ipCookie.remove('settings');
      }

      if (this.remember && this.settingsType) {
        ipCookie('settingsType', this.settingsType, { expires: 180 });
      } else {
        ipCookie.remove('settingsType');
      }
    };

    return new settingService();
  })
  .factory('socket', function (socketFactory) {
    return socketFactory();
  });