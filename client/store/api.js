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

api.sendFeedback = function (data) {
  return axios.post(`/api/feedback`, data).then(res => res.data)
}

api.feedbackStatus = function () {
  return axios.get(`/api/feedback`).then(res => res.data)
}

api.getAppStatus = function () {
  return axios.get(`/api/admin/app/status`).then(res => res.data)
}

api.getPlatformsStatus = function () {
  return axios.get(`/api/admin/platforms/status`).then(res => res.data)
}

api.getResourcesStatus = function () {
  return axios.get(`/api/admin/resources/status`).then(res => res.data)
}

api.getMiddlewaresStatus = function () {
  return axios.get(`/api/admin/middlewares/status`).then(res => res.data)
}

api.updateRepo = function (repo) {
  return axios.put(`/api/admin/${repo}/status`, { repo }).then(res => res.data)
}

api.getPlatforms = function () {
  return axios.get(`/api/info/platforms`).then(res => res.data)
}

api.getPlatformsChanged = function () {
  return axios.get(`/api/info/platforms/changed`).then(res => res.data)
}

api.getUsersList = function () {
  return axios.get(`/api/admin/users`).then(res => res.data)
}

api.addUser = function (data) {
  return axios.post(`/api/admin/users`, data).then(res => res.data)
}

api.removeUser = function (userid) {
  return axios.delete(`/api/admin/users/${userid}`).then(res => res.data)
}

api.editUser = function (data) {
  return axios.post(`/api/admin/users/${data.userid}`, data).then(res => res.data)
}

api.resetPassword = function (userid) {
  return axios.post(`/api/admin/passwords/${userid}`).then(res => res.data)
}

api.notifiate = function (data) {
  return axios.post(`/api/admin/profile`, data).then(res => res.data)
}

api.updatePassword = function (data) {
  return axios.post(`/api/admin/profile`, data).then(res => res.data)
}

api.getUserNumber = function () {
  return axios.get(`/api/admin/usersnumber`).then(res => res.data)
}

api.freshInstall = function (data) {
  return axios.post(`/api/feedback/freshinstall`, data).then(res => res.data)
}

export default api
