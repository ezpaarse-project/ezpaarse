import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'
import socket from './socket'
import snacks from './snacks'

const store = () => new Vuex.Store({
  modules: {
    socket,
    snacks
  },
  state: {
    ezpaarse: [],
    platforms: [],
    platformsItems: [],
    platformsChanged: [],
    resources: [],
    middlewares: [],
    drawer: true,
    feedback: null,
    user: null,
    users: [],
    userNumber: -1
  },
  actions: {
    SET_DRAWER ({ commit }, value) {
      commit('SET_DRAWER', value)
    },
    LOGOUT ({ commit }) {
      return api.logout().then(res => commit('SET_USER', null))
    },
    SIGNIN ({ commit }, credentials) {
      return api.login(credentials).then(res => {
        commit('SET_USER', res)
      })
    },
    GET_USER ({ commit }) {
      return api.session().then(res => commit('SET_USER', res))
    },
    REGISTER ({ commit }, credentials) {
      return api.register(credentials).then(res => {
        if (res.status === 201) commit('SET_USER', res)
      })
    },
    SEND_FEEDBACK ({ commit }, data) {
      return api.sendFeedback(data)
    },
    LOAD_STATUS ({ commit }, data) {
      return api.getAppStatus().then(res => {
        commit('SET_APP_STATUS', res)

        return api.getPlatformsStatus().then(res => {
          commit('SET_PLATFORMS_STATUS', res)

          return api.getResourcesStatus().then(res => {
            commit('SET_RESOURCES_STATUS', res)

            return api.getMiddlewaresStatus().then(res => {
              commit('SET_MIDDLEWARES_STATUS', res)

              return api.feedbackStatus().then(res => commit('SET_FEEDBACK_STATUS', res))
            })
          })
        })
      })
    },
    UPDATE_REPO ({ commit }, repo) {
      return api.updateRepo(repo)
    },
    GET_PLATFORMS ({ commit }) {
      return api.getPlatforms().then(res => commit('SET_PLATFORMS', res))
    },
    GET_PLATFORMS_CHANGED ({ commit }) {
      return api.getPlatformsChanged().then(res => commit('SET_PLATFORMS_CHANGED', res))
    },
    GET_USERS_LIST ({ commit }) {
      return api.getUsersList().then(res => commit('SET_USERS_LIST', res))
    },
    ADD_USER ({ commit }, data) {
      return api.addUser(data)
    },
    REMOVE_USER ({ commit }, userid) {
      return api.removeUser(userid)
    },
    EDIT_USER ({ commit }, data) {
      return api.editUser(data)
    },
    RESET_PASSWORD ({ commit }, userid) {
      return api.resetPassword(userid)
    },
    NOTIFIATE ({ commit }, data) {
      return api.notifiate(data)
    },
    UPDATE_PASSWORD ({ commit }, data) {
      return api.updatePassword(data)
    },
    GET_USER_NUMBER ({ commit }) {
      return api.getUserNumber().then(res => commit('SET_USER_NUMBER', res))
    },
    FRESHINSTALL ({ commit }, data) {
      return api.freshInstall(data).catch(err => {})
    }
  },
  mutations: {
    SET_DRAWER (state, value) {
      Vue.set(state, 'drawer', value)
    },
    LOGOUT (state) {
      Vue.set(state, 'user', null)
    },
    SET_USER (state, user) {
      Vue.set(state, 'user', user)
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
    SET_USERS_LIST (state, users) {x
      Vue.set(state, 'users', users)
    },
    SET_USER_NUMBER (state, userNumber) {
      Vue.set(state, 'userNumber', userNumber)
    }
  }
})

export default store
