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
    ressources: [],
    middlewares: [],
    drawer: true,
    feedback: null,
    user: null,
    users: []
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
            commit('SET_RESSOURCES_STATUS', res)

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
    }
  },
  mutations: {
    SET_DRAWER (state, value) {
      state.drawer = value
    },
    LOGOUT (state) {
      state.user = null
    },
    SET_USER (state, user) {
      state.user = user
    },
    SET_FEEDBACK_STATUS (state, feedback) {
      state.feedback = feedback
    },
    SET_APP_STATUS (state, data) {
      state.ezpaarse = data
    },
    SET_PLATFORMS_STATUS (state, data) {
      state.platforms = data
    },
    SET_RESSOURCES_STATUS (state, data) {
      state.ressources = data
    },
    SET_MIDDLEWARES_STATUS (state, data) {
      state.middlewares = data
    },
    SET_PLATFORMS (state, platforms) {
      state.platformsItems = platforms
    },
    SET_PLATFORMS_CHANGED (state, platforms) {
      state.platformsChanged = platforms
    },
    SET_USERS_LIST (state, users) {
      state.users = users
    }
  }
})

export default store
