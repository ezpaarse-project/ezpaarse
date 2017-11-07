'use strict';

/* Services */

angular.module('ezPAARSE.services', [])
  .service('userService', function () {
    this.user = null;

    this.login = function (user) {
      this.user = user;
    };

    this.logout = function () {
      this.user = null;
    };

    this.hasAccess = function () {
      if (!this.user || !this.user.group || arguments.length === 0) {
        return false;
      }

      return (Array.prototype.indexOf.call(arguments, this.user.group) !== -1);
    };

    this.isAuthenticated = function () {
      return (this.user !== null);
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
          { cat: 'rejets',  key: 'nb-lines-pkb-miss-ecs',    percent: 0, title: 'rejects+missing_pkbs' },
          { cat: 'rejets',  key: 'nb-lines-ignored-hosts',   percent: 0, title: 'rejects+ignored_hosts' },
          { cat: 'rejets',  key: 'nb-lines-robots-ecs',      percent: 0, title: 'rejects+robots_ecs' }
        ]
      };
      this.data = angular.copy(this.baseData);

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

      angular.copy(this.baseData, this.data);
    };

    requestService.prototype.isLoading = function () {
      return (this.data.state == 'loading' || this.data.state == 'finalisation');
    };

    requestService.prototype.abort = function (callback) {
      callback = callback || function () {};
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
          formData.append('files[]', file);
          self.data.files.push(file);
        });
      } else {
        return;
      }

      headers = headers || {};
      headers['Socket-ID'] = socket._id;

      var currentJob = {
        id: this.data.jobID,
        date: new Date()
      };

      socket.on('logging', this.loggingListener);
      socket.on('report', this.reportListener);

      this.xhr = $.ajax({
        headers:     headers || {},
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

            var errorCode    = jqXHR.getResponseHeader('ezPAARSE-Status');
            var errorMessage = jqXHR.getResponseHeader('ezPAARSE-Status-Message');

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
          'ezproxy': 'EZproxy',
          'apache': 'Apache',
          'squid': 'Squid'
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
          { category: 'encoding',       name: 'Response-Encoding',            anchor: 'response-encoding' },
          { category: 'encoding',       name: 'Accept-Encoding',              anchor: 'accept-encoding' },
          { category: 'encoding',       name: 'Request-Charset',              anchor: 'request-charset' },
          { category: 'encoding',       name: 'Response-Charset',             anchor: 'response-charset' },
          { category: 'format',         name: 'Accept',                       anchor: 'accept' },
          { category: 'format',         name: 'Log-Format-xxx',               anchor: 'log-format-xxx' },
          { category: 'format',         name: 'Date-Format',                  anchor: 'date-format' },
          { category: 'format',         name: 'Output-Fields',                anchor: 'output-fields' },
          { category: 'format',         name: 'Max-Parse-Attempts',           anchor: 'max-parse-attempts' },
          { category: 'extraction',     name: 'Extract',                      anchor: 'extract' },
          { category: 'counter',        name: 'COUNTER-Reports',              anchor: 'counter-reports' },
          { category: 'counter',        name: 'COUNTER-Format',               anchor: 'counter-format' },
          { category: 'counter',        name: 'COUNTER-Customer',             anchor: 'counter-customer' },
          { category: 'counter',        name: 'COUNTER-Vendor',               anchor: 'counter-vendor' },
          { category: 'deduplication',  name: 'Double-Click-Removal',         anchor: 'double-click-xxx' },
          { category: 'deduplication',  name: 'Double-Click-HTML',            anchor: 'double-click-xxx' },
          { category: 'deduplication',  name: 'Double-Click-PDF',             anchor: 'double-click-xxx' },
          { category: 'deduplication',  name: 'Double-Click-MISC',            anchor: 'double-click-xxx' },
          { category: 'deduplication',  name: 'Double-Click-MIXED',           anchor: 'double-click-xxx' },
          { category: 'deduplication',  name: 'Double-Click-Strategy',        anchor: 'double-click-xxx' },
          { category: 'deduplication',  name: 'Double-Click-C-Field',         anchor: 'double-click-xxx' },
          { category: 'deduplication',  name: 'Double-Click-L-Field',         anchor: 'double-click-xxx' },
          { category: 'deduplication',  name: 'Double-Click-I-Field',         anchor: 'double-click-xxx' },
          { category: 'anonymization',  name: 'Crypted-Fields',               anchor: 'crypted-fields' },
          { category: 'other',          name: 'Traces-Level',                 anchor: 'traces-level' },
          { category: 'other',          name: 'Reject-Files',                 anchor: 'reject-files' },
          { category: 'other',          name: 'Clean-Only',                   anchor: 'clean-only' },
          { category: 'other',          name: 'Force-Parser',                 anchor: 'force-parser' },
          { category: 'other',          name: 'Geoip',                        anchor: 'geoip' },
          { category: 'other',          name: 'ezPAARSE-Job-Notifications',   anchor: 'ezpaarse-job-notifications' },
          { category: 'other',          name: 'ezPAARSE-Enrich',              anchor: 'ezpaarse-enrich' },
          { category: 'other',          name: 'ezPAARSE-Predefined-Settings', anchor: 'ezpaarse-predefined-settings' },
          { category: 'other',          name: 'ezPAARSE-Filter-Redirects',    anchor: 'ezpaarse-filter-redirects' },
          { category: 'other',          name: 'Disable-Filters',              anchor: 'disable-filters' },
          { category: 'other',          name: 'Force-ECField-Publisher',      anchor: 'force-ecfield-publisher' },
          { category: 'other',          name: 'Extract',                      anchor: 'extract' },
          { category: 'other',          name: 'ezPAARSE-Middlewares',         anchor: 'ezpaarse-middlewares' },
          { category: 'metadata-enrichment',	name: 'Crossref-enrich',      anchor: 'crossref' },
          { category: 'metadata-enrichment',	name: 'Crossref-ttl',         anchor: 'crossref' },
          { category: 'metadata-enrichment',	name: 'Crossref-throttle',    anchor: 'crossref' },
          { category: 'metadata-enrichment',	name: 'Crossref-paquet-size', anchor: 'crossref' },
          { category: 'metadata-enrichment',	name: 'Crossref-buffer-size', anchor: 'crossref' },
          { category: 'metadata-enrichment',	name: 'Sudoc-enrich',         anchor: 'sudoc' },
          { category: 'metadata-enrichment',	name: 'Sudoc-ttl',            anchor: 'sudoc' },
          { category: 'metadata-enrichment',	name: 'Sudoc-throttle',       anchor: 'sudoc' },
          { category: 'metadata-enrichment',	name: 'Hal-enrich',           anchor: 'hal' },
          { category: 'metadata-enrichment',	name: 'Hal-ttl',              anchor: 'hal' },
          { category: 'metadata-enrichment',	name: 'Hal-throttle',         anchor: 'hal' },
          { category: 'metadata-enrichment',	name: 'Istex-enrich',         anchor: 'istex' },
          { category: 'metadata-enrichment',	name: 'Istex-ttl',            anchor: 'istex' },
          { category: 'metadata-enrichment',	name: 'Istex-throttle',       anchor: 'istex' }
        ]
      };

      this.remember = true;
      this.defaults = {
        counter: { jr1: false },
        outputFields: { plus: [], minus: [] },
        cryptedFields: ['host', 'login'],
        customHeaders: [],
        notificationMails: '',
        headers: {
          'Accept':       'text/csv',
          'Traces-Level': 'info',
          'Date-Format':  '',
          'Force-Parser': ''
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

      if (settings.cryptedFields) {
        if (settings.cryptedFields.length) {
          headers['Crypted-Fields'] = settings.cryptedFields.join(',');
        } else {
          headers['Crypted-Fields'] = 'none';
        }
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
     * Add a crypted field
     * @param {String} name name of the field
     */
    settingService.prototype.addCryptedField = function (name) {
      this.settings.cryptedFields.push(name);
    };
    /**
     * Remove an output field
     * @param  {Integer} index index in the array
     */
    settingService.prototype.removeCryptedField = function (name) {
      var index = this.settings.cryptedFields.indexOf(name);
      if (index !== -1) {
        this.settings.cryptedFields.splice(index, 1);
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
        var outputFields = headers['Output-Fields'].split(',');
        outputFields.forEach(function (field) {
          field = field.trim();

          if (field) {
            var type = field.charAt(0) == '+' ? 'plus' : 'minus';
            settings.outputFields[type].push(field.substr(1));
          }
        });

        delete headers['Output-Fields'];
      }

      if (headers['Crypted-Fields']) {
        var cryptedFields = headers['Crypted-Fields'];

        if (cryptedFields.toLowerCase() === 'none') {
          settings.cryptedFields = [];
        } else {
          settings.cryptedFields = cryptedFields.split(',').map(function (f) { return f.trim(); });
        }

        delete headers['Crypted-Fields'];
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
    var socket = socketFactory();

    socket.on('connected', function (socketID) {
      socket._id = socketID;
    });

    return socket;
  });
