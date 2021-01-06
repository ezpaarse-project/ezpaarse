// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import isEqual from 'lodash.isequal';
import api from './api';

const defaultSettings = {
  fullName: '',
  country: '',
  headers: [],
  cryptedFields: ['host', 'login'],
  dateFormat: '',
  logType: '',
  logFormat: '',
  forceParser: '',
  outputFormat: 'text/csv',
  tracesLevel: 'info',
  counterReports: [],
  notificationMails: [],
  addedFields: [],
  removedFields: [],
  additionalsMiddlewares: []
};

/**
 * Get settings from a predefined object
 * @param  {String} setting predefined setting
 * @return {Object}         settings
 */
function parseSettings (predefined) {
  if (!predefined || !predefined.headers) { return null; }

  const settings = JSON.parse(JSON.stringify(defaultSettings));

  settings.fullName = predefined.fullName;
  settings.country = predefined.country;
  settings.predefined = predefined.predefined;
  settings.id = predefined.id;

  // Index headers by lowercased name
  const headers = {};
  Object.entries(predefined.headers).forEach(([name, value]) => {
    headers[name.toLowerCase()] = { name, value };
  });

  if (headers['ezpaarse-middlewares']) {
    const { value: mwString } = headers['ezpaarse-middlewares'];

    if (!/^\(\s*(before|after|only)\s*(.*?)\s*\)(.+)$/i.test(mwString)) {
      settings.additionalsMiddlewares = mwString.split(',').map(mw => mw.trim()).filter(mw => mw);
      delete headers['ezpaarse-middlewares'];
    }
  }

  if (headers['date-format']) {
    settings.dateFormat = headers['date-format'].value;
    delete headers['date-format'];
  }
  if (headers['force-parser']) {
    settings.forceParser = headers['force-parser'].value;
    delete headers['force-parser'];
  }
  if (headers['traces-level']) {
    settings.tracesLevel = headers['traces-level'].value;
    delete headers['traces-level'];
  }

  if (headers['accept']) {
    const { value } = headers['accept'];
    if (['application/json', 'text/csv', 'text/tab-separated-values'].indexOf(value) !== -1) {
      settings.outputFormat = value;
      delete headers['accept'];
    }
  }

  if (headers['output-fields']) {
    const outputFields = headers['output-fields'].value.split(',').map(f => f.trim()).filter(f => f);
    outputFields.forEach(field => {
      if (field.charAt(0) === '-') {
        settings.removedFields.push(field.substr(1));
      } else {
        settings.addedFields.push(field.substr(1));
      }
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


  if (headers['filter-platforms']) {
    const filterPlatforms = headers['filter-platforms'].value;

    if (filterPlatforms) {
      settings.filterPlatforms = filterPlatforms.split(',').map(f => f.trim()).filter(f => f);
    }

    delete headers['filter-platforms'];
  }

  if (headers['counter-reports']) {
    settings.counterReports = headers['counter-reports'].value.split(',').map(r => r.trim());
    delete headers['counter-reports'];
  }

  if (headers['ezpaarse-job-notifications']) {
    const { value } = headers['ezpaarse-job-notifications'];
    const reg = /mail<(.+?)>/g;

    settings.notificationMails = [];
    let match = reg.exec(value);

    while (match) {
      settings.notificationMails.push(match[1]);
      match = reg.exec(value);
    }

    delete headers['ezpaarse-job-notifications'];
  }

  Object.values(headers).forEach(({ name, value }) => {
    if (/^Log-Format-[a-z]+$/i.test(name)) {
      settings.logFormat = value;
      settings.logType = name.substr(11).toLowerCase();
    } else if (name.toLowerCase() === 'ezpaarse-middlewares') {
      settings.headers.push({
        name,
        value: value.split(',').map(r => r.trim())
      });
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
  if (settings.tracesLevel) { headers['Traces-Level'] = settings.tracesLevel; }

  if (settings.logType && settings.logFormat) {
    headers[`Log-Format-${settings.logType}`] = settings.logFormat;
  }

  // Create COUNTER reports header
  if (Array.isArray(settings.counterReports) && settings.counterReports.length > 0) {
    headers['COUNTER-Reports'] = settings.counterReports.join(',');
    headers['COUNTER-Format'] = 'tsv';
  }

  // Create notification header
  if (Array.isArray(settings.notificationMails) && settings.notificationMails.length > 0) {
    headers['ezPAARSE-Job-Notifications'] = settings.notificationMails.map(mail => `mail<${mail.trim()}>`).join(',');
  }

  if (settings.cryptedFields && settings.cryptedFields.length > 0) {
    headers['Crypted-Fields'] = settings.cryptedFields.join(',');
  } else {
    headers['Crypted-Fields'] = 'none';
  }

  if (settings.filterPlatforms && settings.filterPlatforms.length > 0) {
    headers['filter-platforms'] = settings.filterPlatforms.join(',');
  }

  // Create Output-Fields headers
  if (settings.addedFields || settings.removedFields) {
    const plus = (settings.addedFields || []).map(f => `+${f}`);
    const minus = (settings.removedFields || []).map(f => `-${f}`);

    if ((plus.length + minus.length) > 0) {
      headers['Output-Fields'] = plus.concat(minus).join(',');
    }
  }

  const middlewares = settings.additionalsMiddlewares;

  if (Array.isArray(middlewares) && middlewares.length > 0) {
    headers['ezPAARSE-Middlewares'] = middlewares.join(',');
  }

  if (Array.isArray(settings.headers)) {
    settings.headers.forEach(({ name, value }) => {
      let headerValue = value;
      if (!name || !value) { return; }

      // Look case-insensitively for a header with the same name
      const headerNames = Object.keys(headers);
      const existingHeader = headerNames.find(h => h.toLowerCase() === name.toLowerCase());

      if (name.toLowerCase() === 'ezpaarse-middlewares') {
        if (Array.isArray(headerValue)) {
          headerValue = headerValue.join(',');
        }
      }

      if (existingHeader) {
        headers[existingHeader] = headerValue;
      } else {
        headers[name] = headerValue;
      }
    });
  }

  return headers;
}

export default {
  state: () => ({
    predefinedSettings: [],
    customSettings: [],
    countries: [],
    treatments: [],
    settings: JSON.parse(JSON.stringify(defaultSettings))
  }),
  getters: {
    allSettings (state) {
      return state.predefinedSettings.concat(state.customSettings);
    },
    hasBeenModified (state) {
      if (!state.settings || !state.settings.id) {
        return !isEqual(state.settings, defaultSettings);
      }

      const allSettings = state.predefinedSettings.concat(state.customSettings);
      const selectedSetting = allSettings.find(s => s.id === state.settings.id);
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
    SET_COUNTRIES (state, data) {
      Vue.set(state, 'countries', data);
    },
    SET_SETTINGS (state, settings) {
      Vue.set(state, 'settings', settings);
    },
    SET_FIELD (state, { name, value }) {
      Vue.set(state.settings, name, value);
    },
    ADD_HEADER (state, name, value) {
      state.settings.headers.push({ name: name || '', value: value || '' });
    },
    REMOVE_HEADER (state, index) {
      state.settings.headers.splice(index, 1);
    },
    SET_HEADER_NAME (state, { index, value }) {
      const header = state.settings.headers[index];
      if (header) {
        header.name = value;
      }
    },
    SET_HEADER_VALUE (state, { index, value }) {
      const header = state.settings.headers[index];
      if (header) {
        header.value = value;
      }
    }
  },
  actions: {
    async GET_PREDEFINED_SETTINGS ({ commit }) {
      const data = await api.getPredefinedSettings();
      // Change object into an array with key as ID
      const settings = Object.entries(data).map(([id, setting]) => ({
        id,
        ...setting,
        predefined: true
      }));

      commit('SET_PREDEFINED_SETTINGS', settings);
      commit('SET_CUSTOM_SETTINGS', await api.getCustomSettings());
    },
    async GET_CUSTOM_PREDEFINED_SETTINGS ({ commit }) {
      const data = await api.getCustomSettings();
      commit('SET_CUSTOM_SETTINGS', data.map(d => parseSettings(d)));
    },
    APPLY_PREDEFINED_SETTINGS ({ commit, getters, dispatch }, key) {
      const settings = getters.allSettings.find(s => s.id === key);

      if (settings) {
        commit('SET_SETTINGS', parseSettings(settings));
      } else {
        dispatch('RESET_SETTINGS');
      }
    },
    SET_FIELD ({ commit }, { name, value }) {
      if (name) {
        commit('SET_FIELD', { name, value });
      }
    },
    ADD_HEADER ({ commit }, name, value) {
      commit('ADD_HEADER', name, value);
    },
    REMOVE_HEADER ({ commit }, index) {
      commit('REMOVE_HEADER', index);
    },
    SET_HEADER_NAME ({ commit }, { index, value }) {
      commit('SET_HEADER_NAME', { index, value });
    },
    SET_HEADER_VALUE ({ commit }, { index, value }) {
      commit('SET_HEADER_VALUE', { index, value });
    },
    GET_HEADERS ({ state }) {
      return getHeaders(state.settings);
    },
    RESET_SETTINGS ({ commit }) {
      commit('SET_SETTINGS', JSON.parse(JSON.stringify(defaultSettings)));
    },
    SAVE_CUSTOM_PREDEFINED_SETTINGS (ctx, settings) {
      const { id, fullName, country } = settings;
      return api.saveCustomSettings({
        id,
        fullName,
        country,
        headers: getHeaders(settings)
      });
    },
    UPDATE_CUSTOM_PREDEFINED_SETTINGS (ctx, settings) {
      const { id, fullName, country } = settings;
      return api.updateCustomSettings({
        id,
        fullName,
        country,
        headers: getHeaders(settings)
      });
    },
    async GET_COUNTRIES ({ commit }) {
      commit('SET_COUNTRIES', await api.getCountries());
    },
    async REMOVE_CUSTOM_PREDEFINED_SETTINGS ({ commit, dispatch, state }, id) {
      await api.removeCustomSettings(id);
      commit('SET_CUSTOM_SETTINGS', state.customSettings.filter(s => s.id !== id));
      dispatch('RESET_SETTINGS');
    },
    uploadFile ({ commit }, setting) {
      commit('SET_SETTINGS', parseSettings(setting));
    }
  }
};
