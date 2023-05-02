let axios = null;

const api = {};

api.setInstance = (instance) => {
  if (!axios) {
    axios = instance;
  }
  return axios;
};

api.register = (data) => axios.post('/api/admin/register', data).then(res => res.data);

api.restart = (data) => axios.post('/api/admin/restart', data).then(res => res.data);

api.sendFeedback = (data) => axios.post('/api/feedback', data).then(res => res.data);

api.feedbackStatus = () => axios.get('/api/feedback/status').then(res => res.data);

api.getAppStatus = () => axios.get('/api/admin/app/status').then(res => res.data);

api.getPlatformsStatus = () => axios.get('/api/admin/platforms/status').then(res => res.data);

api.getResourcesStatus = () => axios.get('/api/admin/resources/status').then(res => res.data);

api.getMiddlewaresStatus = () => axios.get('/api/admin/middlewares/status').then(res => res.data);

api.updateRepo = (repo) => axios.put(`/api/admin/${repo}/status`, repo).then(res => res.data);

api.updateApp = (version, socketId) => axios.put(`/api/admin/app/status?version=${version}&socket=${socketId}`).then(res => res.data);

api.getPlatforms = () => axios.get('/api/info/platforms').then(res => res.data);

api.getPlatformsChanged = () => axios.get('/api/info/platforms/changed').then(res => res.data);

api.getMiddlewaresChanged = () => axios.get('/api/info/middlewares/changed').then(res => res.data);

api.getUsersList = () => axios.get('/api/admin/users').then(res => res.data);

api.addUser = (data) => axios.post('/api/admin/users', data).then(res => res.data);

api.removeUser = (userid) => axios.delete(`/api/admin/users/${userid}`).then(res => res.data);

api.editUser = (data) => axios.post(`/api/admin/users/${data.userid}`, data).then(res => res.data);

api.resetPassword = (data) => axios.post('/api/admin/passwords', data).then(res => res.data);

api.sendNewPassword = (data) => axios.put('/api/admin/passwords', data).then(res => res.data);

api.notifiate = (data) => axios.post('/api/admin/profile', data).then(res => res.data);

api.updatePassword = (data) => axios.post('/api/admin/profile', data).then(res => res.data);

api.getUserNumber = () => axios.get('/api/admin/usersnumber').then(res => res.data);

api.getJobs = (socketId) => axios.get(`/api/admin/jobs?socket=${socketId}`).then(res => res.data);

api.freshInstall = (data) => axios.post('/api/feedback/freshinstall', data).then(res => res.data);

api.loadPkbs = () => axios.get('/castor/status').then(res => res.data);

api.getPredefinedSettings = () => axios.get('/api/info/predefined-settings').then(res => res.data);

api.getCountries = () => axios.get('/api/info/countries.json').then(res => res.data);

api.getAppInfos = () => axios.get('/api/info/app').then(res => res.data);

api.getReport = (uuid) => axios.get(`/api/logs/${uuid}/job-report.json`).then(res => res.data);

api.getLogging = (uuid) => axios.get(`/api/logs/${uuid}/job-traces.log`).then(res => res.data);

api.getLogParser = (data) => axios.put('/api/format/logparser', data).then(res => res.data);

api.saveCustomSettings = (data) => axios.post('/api/info/predefined-settings/custom', { settings: data }).then(res => res.data);

api.updateCustomSettings = (settings) => axios.put(`api/info/predefined-settings/custom/${settings.id}`, { settings }).then(res => res.data);

api.getCustomSettings = () => axios.get('/api/info/predefined-settings/custom').then(res => res.data);

api.removeCustomSettings = (id) => axios.delete(`/api/info/predefined-settings/custom/${id}`).then(res => res.data);

api.getTreatmentsByUser = (userId) => axios.get(`/api/jobs/${userId}`).then(res => res.data);

api.getTreatments = () => axios.get('/api/jobs').then(res => res.data);

api.uploadToEzMesure = (jobId, data) => axios.post(`/api/ezmesure/${jobId}`, data).then(res => res.data);

export default api;
