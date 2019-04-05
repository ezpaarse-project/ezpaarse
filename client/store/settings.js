import isEqual from 'lodash.isequal';
import Vue from 'vue';
import api from './api';

const defaultSettings = {
  fullName: '',
  headers: [],
  cryptedFields: ['host', 'login'],
  dateFormat: '',
  logType: '',
  logFormat: '',
  forceParser: '',
  outputFormat: 'text/csv',
  tracesLevel: 'info',
  counterReports: [],
  notifications: [],
  outputFields: {
    plus: [],
    minus: []
  }
};

/**
 * Get settings from a predefined object
 * @param  {String} setting predefined setting
 * @return {Object}         settings
 */
function parseSettings (predefined) {
  if (!predefined || !predefined.headers) { return null; }

  const settings = JSON.parse(JSON.stringify(defaultSettings));

  // Lowercase headers
  const headers = {};
  Object.entries(predefined.headers).forEach(([name, value]) => {
    headers[name.toLowerCase()] = { name, value };
  });

  if (headers['output-fields']) {
    const outputFields = headers['output-fields'].value.split(',').map(f => f.trim()).filter(f => f);
    outputFields.forEach(field => {
      const type = field.charAt(0) === '-' ? 'minus' : 'plus';
      settings.outputFields[type].push(field.substr(1));
    });

    delete headers['output-fields'];
  }

  if (headers['crypted-fields']) {
    const cryptedFields = headers['crypted-fields'].value;

    if (cryptedFields.toLowerCase() === 'none') {
      settings.cryptedFields = [];
    } else {
      settings.cryptedFields = cryptedFields.split(',').map(f => f.trim()).filter(f => f);
    }

    delete headers['crypted-fields'];
  }

  Object.values(headers).forEach(({ name, value }) => {
    if (/^Log-Format-[a-z]+$/i.test(name)) {
      settings.logFormat = value;
      settings.logType = name.substr(11).toLowerCase();
    } else {
      settings.headers.push({ name, value });
    }
  });

  return settings;
}

/**
 * Returns settings as a list of headers for a request
 */
function getHeaders (settings) {
  if (!settings) { return {}; }
  const headers = {};

  if (settings.outputFormat) { headers['Accept'] = settings.outputFormat; }
  if (settings.forceParser) { headers['Force-Parser'] = settings.forceParser; }
  if (settings.dateFormat) { headers['Date-Format'] = settings.dateFormat; }

  if (settings.logType && settings.logFormat) {
    headers[`Log-Format-${settings.logType}`] = settings.logFormat;
  }

  // Create COUNTER reports header
  if (Array.isArray(settings.counterReports) && settings.counterReports.length > 0) {
    headers['COUNTER-Reports'] = settings.counterReports.join(',');
    headers['COUNTER-Format'] = 'tsv';
  }

  // Create notification header
  if (settings.notificationMails) {
    headers['ezPAARSE-Job-Notifications'] = settings.notifications.map(mail => `mail<${mail.trim()}>`).join(',');
  }

  if (settings.cryptedFields && settings.cryptedFields.length > 0) {
    headers['Crypted-Fields'] = settings.cryptedFields.join(',');
  } else {
    headers['Crypted-Fields'] = 'none';
  }

  // Create Output-Fields headers
  if (settings.outputFields) {
    let { plus, minus } = settings.outputFields;
    plus = (plus || []).map(f => `+${f}`);
    minus = (minus || []).map(f => `-${f}`);

    if ((plus.length + minus.length) > 0) {
      headers['Output-Fields'] = plus.concat(minus).join(',');
    }
  }

  if (Array.isArray(settings.headers)) {
    settings.headers.forEach(({ name, value }) => {
      if (!name || !value) { return; }

      // Look case-insensitively for a header with the same name
      const headerNames = Object.keys(headers);
      const existingHeader = headerNames.find(h => h.toLowerCase() === name.toLowerCase());

      if (existingHeader) {
        headers[existingHeader] = value;
      } else {
        headers[name] = value;
      }
    });
  }

  return headers;
}

export default {
  namespaced: true,
  state: {
    predefinedSettings: [],
    customSettings: [],
    settingsIsModified: false,
    selectedSetting: null,
    countries: [],
    treatments: [],
    settings: JSON.parse(JSON.stringify(defaultSettings))
  },
  getters: {
    allSettings (state) {
      return state.predefinedSettings.concat(state.customSettings);
    },
    hasBeenModified (state) {
      if (!state.selectedSetting) {
        return !isEqual(state.settings, defaultSettings);
      }

      const allSettings = state.predefinedSettings.concat(state.customSettings);
      const selectedSetting = allSettings.find(s => s.id === state.selectedSetting);
      return !isEqual(state.settings, parseSettings(selectedSetting));
    }
  },
  mutations: {
    SET_PREDEFINED_SETTINGS (state, data) {
      Vue.set(state, 'predefinedSettings', data);
    },
    SET_CUSTOM_SETTINGS (state, data) {
      Vue.set(state, 'customSettings', data);
    },
    SET_SETTINGS_IS_MODIFIED (state, data) {
      Vue.set(state, 'settingsIsModified', data);
    },
    SET_COUNTRIES (state, data) {
      Vue.set(state, 'countries', data);
    },
    SET_SETTINGS (state, settings) {
      Vue.set(state, 'settings', settings);
    },
    SET_SELECTED_SETTING (state, key) {
      Vue.set(state, 'selectedSetting', key);
    }
  },
  actions: {
    async GET_PREDEFINED_SETTINGS ({ commit }) {
      const data = await api.getPredefinedSettings(this.$axios);
      // Change object into an array with key as ID
      const settings = Object.entries(data).map(([id, setting]) => ({ ...setting, id }));

      commit('SET_PREDEFINED_SETTINGS', settings);
      commit('SET_CUSTOM_SETTINGS', await api.getcustomSettings(this.$axios));
    },
    APPLY_PREDEFINED_SETTINGS ({ commit, getters }, key) {
      const settings = getters.allSettings.find(s => s.id === key);

      if (settings) {
        commit('SET_SETTINGS', parseSettings(settings));
        commit('SET_SELECTED_SETTING', key);
      }
    },
    GET_HEADERS ({ state }) {
      return getHeaders(state.settings);
    },
    RESET_SETTINGS ({ commit }) {
      commit('SET_SETTINGS', JSON.parse(JSON.stringify(defaultSettings)));
      commit('SET_SELECTED_SETTING', null);
    },
    SAVE_CUSTOM_PREDEFINED_SETTINGS (ctx, data) {
      return api.savecustomSettings(this.$axios, data);
    },
    UPDATE_CUSTOM_PREDEFINED_SETTINGS (ctx, data) {
      return api.updatecustomSettings(this.$axios, data);
    },
    GET_CUSTOM_PREDEFINED_SETTINGS ({ commit }) {
      return api.getcustomSettings(this.$axios).then(res => {
        const customSettings = res.map(setting => {
          /* eslint-disable-next-line */
          setting.settings.id = setting._id;
          return setting.settings;
        });
        commit('SET_CUSTOM_SETTINGS', customSettings);
      });
    },
    GET_COUNTRIES ({ commit }) {
      return api.getCountries(this.$axios).then(res => {
        commit('SET_COUNTRIES', res);
      });
    },
    REMOVE_CUSTOM_PREDEFINED_SETTINGS (ctx, data) {
      return api.removecustomSettings(this.$axios, data);
    },
    SET_SETTINGS_IS_MODIFIED ({ commit }, data) {
      commit('SET_SETTINGS_IS_MODIFIED', data);
    }
  }
};
