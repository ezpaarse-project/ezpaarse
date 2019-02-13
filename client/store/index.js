import Vue from 'vue';
import Vuex from 'vuex';
import process from './process';
import socket from './socket';
import snacks from './snacks';
import api from './api';

const store = () => new Vuex.Store({
  modules: {
    process,
    socket,
    snacks
  },
  state: {
    appVersion: '0.0.0',
    ezpaarse: [],
    platforms: [],
    platformsItems: [],
    platformsChanged: [],
    resources: [],
    middlewares: [],
    drawer: true,
    feedback: null,
    users: [],
    userNumber: -1,
    pkbs: null
  },
  actions: {
    SET_DRAWER ({ commit }, value) {
      commit('SET_DRAWER', value);
    },
    REGISTER ({ commit }, credentials) {
      return api.register(this.$axios, credentials);
    },
    SEND_FEEDBACK ({ commit }, data) {
      return api.sendFeedback(this.$axios, data);
    },
    LOAD_STATUS ({ commit }) {
      return api.getAppStatus(this.$axios).then(res => {
        res.isBeta = !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(res.current)
        commit('SET_APP_STATUS', res);

        return api.getPlatformsStatus(this.$axios).then(platformsStatus => {
          commit('SET_PLATFORMS_STATUS', platformsStatus);

          return api.getResourcesStatus(this.$axios).then(resourcesStatus => {
            commit('SET_RESOURCES_STATUS', resourcesStatus);

            return api.getMiddlewaresStatus(this.$axios).then(middlewaresStatus => {
              commit('SET_MIDDLEWARES_STATUS', middlewaresStatus);

              return api.feedbackStatus(this.$axios).then(feedback => commit('SET_FEEDBACK_STATUS', feedback.recipients));
            });
          });
        });
      });
    },
    UPDATE_REPO ({ commit }, repo) {
      return api.updateRepo(this.$axios, repo);
    },
    UPDATE_APP ({ commit }, version) {
      return api.updateApp(this.$axios, version);
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
    ADD_USER ({ commit }, data) {
      return api.addUser(this.$axios, data);
    },
    REMOVE_USER ({ commit }, userid) {
      return api.removeUser(this.$axios, userid);
    },
    EDIT_USER ({ commit }, data) {
      return api.editUser(this.$axios, data);
    },
    RESET_PASSWORD ({ commit }, userid) {
      return api.resetPassword(this.$axios, userid);
    },
    NOTIFIATE ({ commit }, data) {
      return api.notifiate(this.$axios, data);
    },
    UPDATE_PASSWORD ({ commit }, data) {
      return api.updatePassword(this.$axios, data);
    },
    GET_USER_NUMBER ({ commit }) {
      return api.getUserNumber(this.$axios).then(res => commit('SET_USER_NUMBER', res));
    },
    FRESHINSTALL ({ commit }, data) {
      return api.freshInstall(this.$axios, data);
    },
    LOAD_PKBS ({ commit }) {
      return api.loadPkbs(this.$axios).then(res => { commit('SET_PKBS', res); });
    },
    SET_PKBS ({ commit }, data) {
      commit('SET_PKBS', data);
    },
    GET_APP_VERSION ({ commit }) {
      return api.getAppVersion(this.$axios).then(res => { commit('SET_APP_VERSION', res); });
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
    SET_APP_VERSION (state, data) {
      Vue.set(state, 'appVersion', data);
    }
  }
});

export default store;
