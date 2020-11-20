// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import api from './api';

export default {
  state: () => ({
    appInfos: {
      version: '0.0.0',
      uptime: '0d 0h 0m 0s',
      demo: false
    },
    ezpaarse: {},
    platforms: {},
    platformsItems: [],
    platformsChanged: [],
    middlewares: {},
    middlewaresChanged: [],
    resources: {},
    drawer: false,
    feedback: '',
    users: [],
    userNumber: -1,
    pkbs: {}
  }),
  getters: {
    hasPlatformsUpdates (state) {
      return state.platforms['from-head'] === 'outdated';
    },
    hasMiddlewaresUpdates (state) {
      return state.middlewares['from-head'] === 'outdated';
    },
    hasGeneralUpdates (state) {
      if (state.middlewares['from-head'] === 'outdated') { return true; }
      if (state.resources['from-head'] === 'outdated') { return true; }
      if (state.ezpaarse[state.ezpaarse.isBeta ? 'from-head' : 'from-tag'] === 'outdated') { return true; }
      return false;
    }
  },
  actions: {
    SET_DRAWER ({ commit }, value) {
      commit('SET_DRAWER', value);
    },
    REGISTER (ctx, credentials) {
      return api.register(credentials);
    },
    SEND_FEEDBACK (ctx, data) {
      return api.sendFeedback(data);
    },
    LOAD_STATUS ({ commit }) {
      return Promise.all([
        api.getAppStatus().then(res => {
          res.isBeta = !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(res.current);
          commit('SET_APP_STATUS', res);
        }),
        api.getPlatformsStatus().then(res => commit('SET_PLATFORMS_STATUS', res)),
        api.getResourcesStatus().then(res => commit('SET_RESOURCES_STATUS', res)),
        api.getMiddlewaresStatus().then(res => commit('SET_MIDDLEWARES_STATUS', res)),
        api.feedbackStatus().then(res => commit('SET_FEEDBACK_STATUS', res))
      ]);
    },
    UPDATE_REPO (ctx, repo) {
      return api.updateRepo(repo);
    },
    UPDATE_APP (ctx, { version, socketId }) {
      return api.updateApp(version, socketId);
    },
    GET_PLATFORMS ({ commit }) {
      return api.getPlatforms().then(res => commit('SET_PLATFORMS', res));
    },
    GET_PLATFORMS_CHANGED ({ commit }) {
      return api.getPlatformsChanged().then(res => commit('SET_PLATFORMS_CHANGED', res));
    },
    GET_MIDDLEWARES_CHANGED ({ commit }) {
      return api.getMiddlewaresChanged().then(res => commit('SET_MIDDLEWARES_CHANGED', res));
    },
    GET_USERS_LIST ({ commit }) {
      return api.getUsersList().then(res => commit('SET_USERS_LIST', res));
    },
    ADD_USER (ctx, data) {
      return api.addUser(data);
    },
    REMOVE_USER (ctx, userid) {
      return api.removeUser(userid);
    },
    EDIT_USER (ctx, data) {
      return api.editUser(data);
    },
    RESET_PASSWORD (ctx, data) {
      return api.resetPassword(data);
    },
    SEND_NEW_PASSWORD (ctx, data) {
      return api.sendNewPassword(data);
    },
    NOTIFIATE (ctx, data) {
      return api.notifiate(data);
    },
    UPDATE_PASSWORD (ctx, data) {
      return api.updatePassword(data);
    },
    async GET_USER_NUMBER ({ commit }) {
      commit('SET_USER_NUMBER', await api.getUserNumber());
    },
    FRESHINSTALL (ctx, data) {
      return api.freshInstall(data);
    },
    async LOAD_PKBS ({ commit }) {
      commit('SET_PKBS', await api.loadPkbs());
    },
    SET_PKBS ({ commit }, data) {
      commit('SET_PKBS', data);
    },
    GET_APP_INFOS ({ commit }) {
      return api.getAppInfos().then(res => { commit('SET_APP_INFOS', res); });
    },
    GET_FEEDBACK_STATUS ({ commit }) {
      return api.feedbackStatus().then(res => commit('SET_FEEDBACK_STATUS', res));
    }
  },
  mutations: {
    SET_DRAWER (state, value) {
      Vue.set(state, 'drawer', value);
    },
    SET_FEEDBACK_STATUS (state, feedback) {
      Vue.set(state, 'feedback', feedback);
    },
    SET_APP_STATUS (state, data) {
      Vue.set(state, 'ezpaarse', data);
    },
    SET_PLATFORMS_STATUS (state, data) {
      Vue.set(state, 'platforms', data);
    },
    SET_RESOURCES_STATUS (state, data) {
      Vue.set(state, 'resources', data);
    },
    SET_MIDDLEWARES_STATUS (state, data) {
      Vue.set(state, 'middlewares', data);
    },
    SET_PLATFORMS (state, platforms) {
      Vue.set(state, 'platformsItems', platforms);
    },
    SET_PLATFORMS_CHANGED (state, platforms) {
      Vue.set(state, 'platformsChanged', platforms);
    },
    SET_MIDDLEWARES_CHANGED (state, middlewares) {
      Vue.set(state, 'middlewaresChanged', middlewares);
    },
    SET_USERS_LIST (state, users) {
      Vue.set(state, 'users', users);
    },
    SET_USER_NUMBER (state, userNumber) {
      Vue.set(state, 'userNumber', userNumber);
    },
    SET_PKBS (state, data) {
      Vue.set(state, 'pkbs', data);
    },
    SET_APP_INFOS (state, data) {
      Vue.set(state, 'appInfos', data);
    }
  }
};
