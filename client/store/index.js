import Vue from 'vue'
import Vuex from 'vuex'
import socket from './socket'
import snacks from './snacks'
import api from './api'

const store = () => new Vuex.Store({
  modules: {
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
    pkbs: null,
    predefinedSettings: []
  },
  actions: {
    SET_DRAWER ({ commit }, value) {
      commit('SET_DRAWER', value)
    },
    REGISTER ({ commit }, credentials) {
      return api.register(this.$axios, credentials)
    },
    SEND_FEEDBACK ({ commit }, data) {
      return api.sendFeedback(this.$axios, data)
    },
    LOAD_STATUS ({ commit }, data) {
      return api.getAppStatus(this.$axios).then(res => {
        commit('SET_APP_STATUS', res)

        return api.getPlatformsStatus(this.$axios).then(res => {
          commit('SET_PLATFORMS_STATUS', res)

          return api.getResourcesStatus(this.$axios).then(res => {
            commit('SET_RESOURCES_STATUS', res)

            return api.getMiddlewaresStatus(this.$axios).then(res => {
              commit('SET_MIDDLEWARES_STATUS', res)

              return api.feedbackStatus(this.$axios).then(res => commit('SET_FEEDBACK_STATUS', res.recipients))
            })
          })
        })
      })
    },
    UPDATE_REPO ({ commit }, repo) {
      return api.updateRepo(this.$axios, repo)
    },
    GET_PLATFORMS ({ commit }) {
      return api.getPlatforms(this.$axios).then(res => commit('SET_PLATFORMS', res))
    },
    GET_PLATFORMS_CHANGED ({ commit }) {
      return api.getPlatformsChanged(this.$axios).then(res => commit('SET_PLATFORMS_CHANGED', res))
    },
    GET_USERS_LIST ({ commit }) {
      return api.getUsersList(this.$axios).then(res => commit('SET_USERS_LIST', res))
    },
    ADD_USER ({ commit }, data) {
      return api.addUser(this.$axios, data)
    },
    REMOVE_USER ({ commit }, userid) {
      return api.removeUser(this.$axios, userid)
    },
    EDIT_USER ({ commit }, data) {
      return api.editUser(this.$axios, data)
    },
    RESET_PASSWORD ({ commit }, userid) {
      return api.resetPassword(this.$axios, userid)
    },
    NOTIFIATE ({ commit }, data) {
      return api.notifiate(this.$axios, data)
    },
    UPDATE_PASSWORD ({ commit }, data) {
      return api.updatePassword(this.$axios, data)
    },
    GET_USER_NUMBER ({ commit }) {
      return api.getUserNumber(this.$axios).then(res => commit('SET_USER_NUMBER', res))
    },
    FRESHINSTALL ({ commit }, data) {
      return api.freshInstall(this.$axios, data).catch(err => {})
    },
    LOAD_PKBS ({ commit }, data) {
      return api.loadPkbs(this.$axios)
      .then(res => {
        commit('SET_PKBS', res)
      })
      .catch(err => {})
    },
    SET_PKBS ({ commit }, data) {
      commit('SET_PKBS', data)
    },
    GET_PREDEFINED_SETTINGS ({ commit }, data) {
      return api.getPredefinedSettings(this.$axios).then(res => {
        commit('SET_PREDEFINED_SETTINGS', res)
      }).catch(err => {})
    },
    GET_APP_VERSION ({ commit }, data) {
      return api.getAppVersion(this.$axios).then(res => {
        commit('SET_APP_VERSION', res)
      }).catch(err => {})
    }
  },
  mutations: {
    SET_DRAWER (state, value) {
      Vue.set(state, 'drawer', value)
    },
    SET_FEEDBACK_STATUS (state, feedback) {
      Vue.set(state, 'feedback', feedback)
    },
    SET_APP_STATUS (state, data) {
      Vue.set(state, 'ezpaarse', data)
    },
    SET_PLATFORMS_STATUS (state, data) {
      Vue.set(state, 'platforms', data)
    },
    SET_RESOURCES_STATUS (state, data) {
      Vue.set(state, 'resources', data)
    },
    SET_MIDDLEWARES_STATUS (state, data) {
      Vue.set(state, 'middlewares', data)
    },
    SET_PLATFORMS (state, platforms) {
      Vue.set(state, 'platformsItems', platforms)
    },
    SET_PLATFORMS_CHANGED (state, platforms) {
      Vue.set(state, 'platformsChanged', platforms)
    },
    SET_USERS_LIST (state, users) {
      Vue.set(state, 'users', users)
    },
    SET_USER_NUMBER (state, userNumber) {
      Vue.set(state, 'userNumber', userNumber)
    },
    SET_PKBS (state, data) {
      Vue.set(state, 'pkbs', data)
    },
    SET_PREDEFINED_SETTINGS (state, data) {
      Vue.set(state, 'predefinedSettings', data)
    },
    SET_APP_VERSION (state, data) {
      Vue.set(state, 'appVersion', data)
    }
  }
})

export default store
