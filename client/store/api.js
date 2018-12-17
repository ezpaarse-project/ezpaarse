/* eslint no-console: 0 */

const api = {}

api.register = function (axios, data) {
  return axios.post(`/api/admin/register`, data).then(res => res.data)
}

api.sendFeedback = function (axios, data) {
  return axios.post(`/api/feedback`, data).then(res => res.data)
}

api.feedbackStatus = function (axios) {
  return axios.get(`/api/feedback`).then(res => res.data)
}

api.getAppStatus = function (axios) {
  return axios.get(`/api/admin/app/status`).then(res => res.data)
}

api.getPlatformsStatus = function (axios) {
  return axios.get(`/api/admin/platforms/status`).then(res => res.data)
}

api.getResourcesStatus = function (axios) {
  return axios.get(`/api/admin/resources/status`).then(res => res.data)
}

api.getMiddlewaresStatus = function (axios) {
  return axios.get(`/api/admin/middlewares/status`).then(res => res.data)
}

api.updateRepo = function (axios, repo) {
  return axios.put(`/api/admin/${repo}/status`, repo).then(res => res.data)
}

api.getPlatforms = function (axios) {
  return axios.get(`/api/info/platforms`).then(res => res.data)
}

api.getPlatformsChanged = function (axios) {
  return axios.get(`/api/info/platforms/changed`).then(res => res.data)
}

api.getUsersList = function (axios) {
  return axios.get(`/api/admin/users`).then(res => res.data)
}

api.addUser = function (axios, data) {
  return axios.post(`/api/admin/users`, data).then(res => res.data)
}

api.removeUser = function (axios, userid) {
  return axios.delete(`/api/admin/users/${userid}`).then(res => res.data)
}

api.editUser = function (axios, data) {
  return axios.post(`/api/admin/users/${data.userid}`, data).then(res => res.data)
}

api.resetPassword = function (axios, userid) {
  return axios.post(`/api/admin/passwords/${userid}`).then(res => res.data)
}

api.notifiate = function (axios, data) {
  return axios.post(`/api/admin/profile`, data).then(res => res.data)
}

api.updatePassword = function (axios, data) {
  return axios.post(`/api/admin/profile`, data).then(res => res.data)
}

api.getUserNumber = function (axios) {
  return axios.get(`/api/admin/usersnumber`).then(res => res.data)
}

api.freshInstall = function (axios, data) {
  return axios.post(`/api/feedback/freshinstall`, data).then(res => res.data)
}

api.loadPkbs = function (axios) {
  return axios.get(`/castor/status`).then(res => res.data)
}

export default api
