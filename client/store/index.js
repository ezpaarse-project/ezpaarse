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
    drawer: true,
    user: null
  },
  actions: {
    SET_DRAWER ({ commit }, value) {
      commit('SET_DRAWER', value)
    },
    LOGOUT ({ commit }) {
      return api.logout().then(res => commit('SET_USER', null))
    },
    SIGNIN ({ commit }, credentials) {
      return api.login(credentials).then(res => commit('SET_USER', res))
    },
    GET_USER ({ commit }) {
      return api.session().then(res => commit('SET_USER', res))
    },
    REGISTER ({ commit }, credentials) {
      return api.register(credentials).then(res => {
        if (res.status === 201) commit('SET_USER', res)
      })
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
    }
  }
})

export default store
