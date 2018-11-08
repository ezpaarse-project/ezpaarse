/* eslint no-console: 0 */

import axios from 'axios'

const api = {}

api.login = function (data) {
  return axios.post(`/api/auth/login`, data).then(res => res.data)
}

api.session = function (data) {
  return axios.get(`/api/auth/session`).then(res => res.data)
}

api.logout = function (data) {
  return axios.get(`/api/auth/logout`)
}

api.register = function (data) {
  return axios.post(`/api/admin/register`, data).then(res => res.data)
}

export default api
