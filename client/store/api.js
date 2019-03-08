/* eslint no-console: 0 */

const api = {};

api.register = (axios, data) => axios.post('/api/admin/register', data).then(res => res.data);

api.sendFeedback = (axios, data) => axios.post('/api/feedback', data).then(res => res.data);

api.feedbackStatus = (axios) => axios.get('/api/feedback').then(res => res.data);

api.getAppStatus = (axios) => axios.get('/api/admin/app/status').then(res => res.data);

api.getPlatformsStatus = (axios) => axios.get('/api/admin/platforms/status').then(res => res.data);

api.getResourcesStatus = (axios) => axios.get('/api/admin/resources/status').then(res => res.data);

api.getMiddlewaresStatus = (axios) => axios.get('/api/admin/middlewares/status').then(res => res.data);

api.updateRepo = (axios, repo) => axios.put(`/api/admin/${repo}/status`, repo).then(res => res.data);

api.updateApp = (axios, version) => axios.put(`/api/admin/app/status?version=${version}`).then(res => res.data);

api.getPlatforms = (axios) => axios.get('/api/info/platforms').then(res => res.data);

api.getPlatformsChanged = (axios) => axios.get('/api/info/platforms/changed').then(res => res.data);

api.getUsersList = (axios) => axios.get('/api/admin/users').then(res => res.data);

api.addUser = (axios, data) => axios.post('/api/admin/users', data).then(res => res.data);

api.removeUser = (axios, userid) => axios.delete(`/api/admin/users/${userid}`).then(res => res.data);

api.editUser = (axios, data) => axios.post(`/api/admin/users/${data.userid}`, data).then(res => res.data);

api.resetPassword = (axios, data) => axios.post('/api/admin/passwords', data).then(res => res.data);

api.sendNewPassword = (axios, data) => axios.put('/api/admin/passwords', data).then(res => res.data);

api.notifiate = (axios, data) => axios.post('/api/admin/profile', data).then(res => res.data);

api.updatePassword = (axios, data) => axios.post('/api/admin/profile', data).then(res => res.data);

api.getUserNumber = (axios) => axios.get('/api/admin/usersnumber').then(res => res.data);

api.getJobs = (axios, socketId) => axios.get(`/api/admin/jobs?socket=${socketId}`).then(res => res.data);

api.freshInstall = (axios, data) => axios.post('/api/feedback/freshinstall', data).then(res => res.data);

api.loadPkbs = (axios) => axios.get('/castor/status').then(res => res.data);

api.getPredefinedSettings = (axios) => axios.get('/api/info/predefined-settings').then(res => res.data);

api.getAppVersion = (axios) => axios.get('/api/info/version').then(res => res.data);

api.getReport = (axios, uuid) => axios.get(`/api/logs/${uuid}/job-report.json`).then(res => res.data);

api.getLogParser = (axios, data) => axios.put('/api/format/logparser', data).then(res => res.data);

api.saveCustomPredefinedSettings = (axios, data) => axios.post('/api/info/predefined-settings/custom', { settings: data }).then(res => res.data);

api.updateCustomPredefinedSettings = (axios, data) => axios.put(`api/info/predefined-settings/custom/${data._id}`, { settings: data }).then(res => res.data);

api.getCustomPredefinedSettings = (axios) => axios.get('/api/info/predefined-settings/custom').then(res => res.data);

api.removeCustomPredefinedSettings = (axios, data) => axios.delete(`/api/info/predefined-settings/custom/${data.id}`).then(res => res.data);

export default api;
