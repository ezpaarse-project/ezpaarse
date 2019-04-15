import Vue from 'vue';
import Vuex from 'vuex';
import settings from './settings';
import process from './process';
import socket from './socket';
import snacks from './snacks';
import api from './api';

const store = () => new Vuex.Store({
  modules: {
    settings,
    process,
    socket,
    snacks
  },
  state: {
    appInfos: {
      version: '0.0.0',
      uptime: '0d 0h 0m 0s',
      demo: false
    },
    ezpaarse: {},
    platforms: {},
    platformsItems: [],
    platformsChanged: [],
    resources: {},
    middlewares: {},
    drawer: true,
    feedback: null,
    users: [],
    userNumber: -1,
    pkbs: {}
  },
  actions: {
    SET_DRAWER ({ commit }, value) {
      commit('SET_DRAWER', value);
    },
    REGISTER (ctx, credentials) {
      return api.register(this.$axios, credentials);
    },
    SEND_FEEDBACK (ctx, data) {
      return api.sendFeedback(this.$axios, data);
    },
    LOAD_STATUS ({ commit }) {
      return Promise.all([
        api.getAppStatus(this.$axios).then(res => {
          res.isBeta = !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(res.current);
          commit('SET_APP_STATUS', res);
        }),
        api.getPlatformsStatus(this.$axios).then(res => commit('SET_PLATFORMS_STATUS', res)),
        api.getResourcesStatus(this.$axios).then(res => commit('SET_RESOURCES_STATUS', res)),
        api.getMiddlewaresStatus(this.$axios).then(res => commit('SET_MIDDLEWARES_STATUS', res)),
        api.feedbackStatus(this.$axios).then(res => commit('SET_FEEDBACK_STATUS', res))
      ]);
    },
    UPDATE_REPO (ctx, repo) {
      return api.updateRepo(this.$axios, repo);
    },
    UPDATE_APP (ctx, { version, socketId }) {
      return api.updateApp(this.$axios, version, socketId);
    },
    GET_PLATFORMS ({ commit }) {
      return api.getPlatforms(this.$axios).then(res => commit('SET_PLATFORMS', res));
    },
    GET_PLATFORMS_CHANGED ({ commit }) {
      return api.getPlatformsChanged(this.$axios).then(res => commit('SET_PLATFORMS_CHANGED', res));
    },
    GET_USERS_LIST ({ commit }) {
      return api.getUsersList(this.$axios).then(res => commit('SET_USERS_LIST', res));
    },
    ADD_USER (ctx, data) {
      return api.addUser(this.$axios, data);
    },
    REMOVE_USER (ctx, userid) {
      return api.removeUser(this.$axios, userid);
    },
    EDIT_USER (ctx, data) {
      return api.editUser(this.$axios, data);
    },
    RESET_PASSWORD (ctx, data) {
      return api.resetPassword(this.$axios, data);
    },
    SEND_NEW_PASSWORD (ctx, data) {
      return api.sendNewPassword(this.$axios, data);
    },
    NOTIFIATE (ctx, data) {
      return api.notifiate(this.$axios, data);
    },
    UPDATE_PASSWORD (ctx, data) {
      return api.updatePassword(this.$axios, data);
    },
    async GET_USER_NUMBER ({ commit }) {
      commit('SET_USER_NUMBER', await api.getUserNumber(this.$axios));
    },
    FRESHINSTALL (ctx, data) {
      return api.freshInstall(this.$axios, data);
    },
    async LOAD_PKBS ({ commit }) {
      commit('SET_PKBS', await api.loadPkbs(this.$axios));
    },
    SET_PKBS ({ commit }, data) {
      commit('SET_PKBS', data);
    },
    GET_APP_INFOS ({ commit }) {
      return api.getAppInfos(this.$axios).then(res => { commit('SET_APP_INFOS', res); });
    },
    GET_FEEDBACK_STATUS ({ commit }) {
      return api.feedbackStatus(this.$axios).then(res => commit('SET_FEEDBACK_STATUS', res));
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
});

export default store;
