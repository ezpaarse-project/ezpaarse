/* eslint no-console: 0 */

const api = {}

api.register = (axios, data) => {
  return axios.post(`/api/admin/register`, data).then(res => res.data)
}

api.sendFeedback = (axios, data) => {
  return axios.post(`/api/feedback`, data).then(res => res.data)
}

api.feedbackStatus = (axios) => {
  return axios.get(`/api/feedback`).then(res => res.data)
}

api.getAppStatus = (axios) => {
  return axios.get(`/api/admin/app/status`).then(res => res.data)
}

api.getPlatformsStatus = (axios) => {
  return axios.get(`/api/admin/platforms/status`).then(res => res.data)
}

api.getResourcesStatus = (axios) => {
  return axios.get(`/api/admin/resources/status`).then(res => res.data)
}

api.getMiddlewaresStatus = (axios) => {
  return axios.get(`/api/admin/middlewares/status`).then(res => res.data)
}

api.updateRepo = (axios, repo) => {
  return axios.put(`/api/admin/${repo}/status`, repo).then(res => res.data)
}

api.getPlatforms = (axios) => {
  return axios.get(`/api/info/platforms`).then(res => res.data)
}

api.getPlatformsChanged = (axios) => {
  return axios.get(`/api/info/platforms/changed`).then(res => res.data)
}

api.getUsersList = (axios) => {
  return axios.get(`/api/admin/users`).then(res => res.data)
}

api.addUser = (axios, data) => {
  return axios.post(`/api/admin/users`, data).then(res => res.data)
}

api.removeUser = (axios, userid) => {
  return axios.delete(`/api/admin/users/${userid}`).then(res => res.data)
}

api.editUser = (axios, data) => {
  return axios.post(`/api/admin/users/${data.userid}`, data).then(res => res.data)
}

api.resetPassword = (axios, userid) => {
  return axios.post(`/api/admin/passwords/${userid}`).then(res => res.data)
}

api.notifiate = (axios, data) => {
  return axios.post(`/api/admin/profile`, data).then(res => res.data)
}

api.updatePassword = (axios, data) => {
  return axios.post(`/api/admin/profile`, data).then(res => res.data)
}

api.getUserNumber = (axios) => {
  return axios.get(`/api/admin/usersnumber`).then(res => res.data)
}

api.getJobs = (axios, socketId) => {
  return axios.get(`/api/admin/jobs?socket=${socketId}`).then(res => res.data)
}

api.freshInstall = (axios, data) => {
  return axios.post(`/api/feedback/freshinstall`, data).then(res => res.data)
}

api.loadPkbs = (axios) => {
  return axios.get(`/castor/status`).then(res => res.data)
}

api.getPredefinedSettings = (axios) => {
  return axios.get(`/api/info/predefined-settings`).then(res => res.data)
}

api.getAppVersion = (axios) => {
  return axios.get(`/api/info/version`).then(res => res.data)
}

api.getReport = (axios, uuid) => {
  return axios.get(`/api/logs/${uuid}/job-report.json`).then(res => res.data)
}

api.getLogParser = (axios, data) => {
  return axios.put(`/api/format/logparser`, data).then(res => res.data)
}

export default api
