const api = {};

api.register = (axios, data) => axios.post('/api/admin/register', data).then(res => res.data);

api.sendFeedback = (axios, data) => axios.post('/api/feedback', data).then(res => res.data);

api.feedbackStatus = (axios) => axios.get('/api/feedback/status').then(res => res.data);

api.getAppStatus = (axios) => axios.get('/api/admin/app/status').then(res => res.data);

api.getPlatformsStatus = (axios) => axios.get('/api/admin/platforms/status').then(res => res.data);

api.getResourcesStatus = (axios) => axios.get('/api/admin/resources/status').then(res => res.data);

api.getMiddlewaresStatus = (axios) => axios.get('/api/admin/middlewares/status').then(res => res.data);

api.updateRepo = (axios, repo) => axios.put(`/api/admin/${repo}/status`, repo).then(res => res.data);

api.updateApp = (axios, version, socketId) => axios.put(`/api/admin/app/status?version=${version}&socket=${socketId}`).then(res => res.data);

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

api.getCountries = (axios) => axios.get('/api/info/countries').then(res => res.data);

api.getAppInfos = (axios) => axios.get('/api/info/app').then(res => res.data);

api.getReport = (axios, uuid) => axios.get(`/api/logs/${uuid}/job-report.json`).then(res => res.data);

api.getLogging = (axios, uuid) => axios.get(`/api/logs/${uuid}/job-traces.log`).then(res => res.data);

api.getLogParser = (axios, data) => axios.put('/api/format/logparser', data).then(res => res.data);

api.saveCustomSettings = (axios, data) => axios.post('/api/info/predefined-settings/custom', { settings: data }).then(res => res.data);

api.updateCustomSettings = (axios, settings) => axios.put(`api/info/predefined-settings/custom/${settings.id}`, { settings }).then(res => res.data);

api.getCustomSettings = (axios) => axios.get('/api/info/predefined-settings/custom').then(res => res.data);

api.removeCustomSettings = (axios, id) => axios.delete(`/api/info/predefined-settings/custom/${id}`).then(res => res.data);

api.getTreatmentsByUser = (axios, userId) => axios.get(`/api/jobs/${userId}`).then(res => res.data);

api.getTreatments = (axios) => axios.get('/api/jobs').then(res => res.data);

export default api;
