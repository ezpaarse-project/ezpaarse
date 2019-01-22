import api from './api'

export default {
  namespaced: true,
  state: {
    inProgress: false,
    predefinedSettings: [],
    currentPredefinedSettings: null,
    processProgress: 0,
    logsFiles: [],
    logsFilesSize: '0 B',
    totalFileSize: 0,
    countLogsFile: 0
  },
  mutations: {
    SET_PREDEFINED_SETTINGS (state, data) {
      state.predefinedSettings = data
    },
    SET_CURRENT_PREDEFINED_SETTINGS (state, data) {
      state.currentPredefinedSettings = data
    },
    SET_PROCESS_PROGRESS (state, data) {
      state.processProgress = data
    },
    SET_IN_PROGRESS (state, data) {
      state.inProgress = data
    },
    SET_LOGS_FILES (state, data) {
      state.logsFiles = data
    },
    SET_COUNT_LOGS_FILES (state, data) {
      state.countLogsFile = data
    },
    SET_LOGS_FILES_SIZE (state, data) {
      state.logsFilesSize = data
    },
    SET_TOTAL_FILES_SIZE (state, data) {
      state.totalFileSize = data
    },
    REMOVE_ALL_LOGS_FILES (state) {
      state.logsFiles = []
    }
  },
  actions: {
    GET_PREDEFINED_SETTINGS ({ commit }) {
      return api.getPredefinedSettings(this.$axios).then(res => {
        const data = Object.values(res)

        const currentSettings = {
          fullName: 'Default',
          country: 'Worldwide',
          headers: {
            'Crypted-Fields': ['host', 'login'],
            'COUNTER-Format': 'csv',
            'Date-Format': null,
            'Log-Format': {
              format: null,
              value: null
            },
            'ezPAARSE-Job-Notifications': [],
            'Trace-Level': 'info',
            'Output-Fields': {
              plus: [],
              minus: []
            },
            'Force-Parser': null,
            advancedHeaders: []
          }
        }

        data.forEach(setting => {

          if (setting.headers) {
            setting.headers['Crypted-Fields'] = (!setting.headers['Crypted-Fields'] || setting.headers['Crypted-Fields'] === 'none'  ? null : setting.headers['Crypted-Fields'].toString().split(','))
              
            if (setting.headers['Output-Fields']) {
              let tmpOutputFields = setting.headers['Output-Fields'].toString()

              setting.headers['Output-Fields'] = {
                plus: [],
                minus: []
              }

              tmpOutputFields.split(',').map(of => {
                if (of.charAt(0) === '+') setting.headers['Output-Fields'].plus.push(of.slice(1))
                if (of.charAt(0) === '-') setting.headers['Output-Fields'].minus.push(of.slice(1))
              })
            } else {
              setting.headers['Output-Fields'] = {
                plus: [],
                minus: []
              }
            }

            setting.headers['Trace-Level'] = 'info'
            if (!setting.headers['COUNTER-Format']) setting.headers['COUNTER-Format'] = 'csv'
            if (setting.headers['COUNTER-Reports']) setting.headers['COUNTER-Format'] = 'tsv'

            if (!setting.headers['Log-Format-ezproxy'] || !setting.headers['Log-Format-apache'] || !setting.headers['Log-Format-squid']) {
              setting.headers['Log-Format'] = {
                format: null,
                value: null
              }
            }

            const headers = ['advancedHeaders', 'COUNTER-Format', 'COUNTER-Reports', 'Output-Fields', 'Crypted-Fields', 'Trace-Level', 'Date-Format', 'Log-Format', 'ezPAARSE-Job-Notifications', 'Force-Parser']
            setting.headers.advancedHeaders = []
            Object.keys(setting.headers).forEach(h => {
              let match
              if ((match = /^Log-Format-([a-z]+)$/i.exec(h)) !== null) {
                let logFormatValue = setting.headers[`Log-Format-${match[1]}`]
                setting.headers['Log-Format'] = {
                  format: match[1],
                  value: logFormatValue
                }
              } else {
                if (!headers.includes(h)) {
                  let tmpValue = setting.headers[h]
                  setting.headers.advancedHeaders.push({
                    header: h,
                    value: tmpValue
                  })
                }
              }
            })
          }
        })
        data.unshift(currentSettings)

        commit('SET_PREDEFINED_SETTINGS', data)
        commit('SET_CURRENT_PREDEFINED_SETTINGS', currentSettings)
      }).catch(err => {})
    },
    SET_CURRENT_PREDEFINED_SETTINGS ({ commit }, data) {
      commit('SET_CURRENT_PREDEFINED_SETTINGS', data)
    },
    PROCESS_WITH_FILES ({ commit }, data) {
      commit('SET_IN_PROGRESS', true)
      return this.$axios.put(`/${data.jobID}`, data.formData, {
        onUploadProgress: progressEvent => {
          let percent = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          if (percent <= 100) commit('SET_PROCESS_PROGRESS', percent)
        },
        headers: data.headers
      })
      .then(res => { })
      .catch(err => { })
    },
    PROCESS ({ commit }, data) {
      commit('SET_IN_PROGRESS', true)
    },
    SET_LOGS_FILES ({ commit }, data) {
      commit('SET_LOGS_FILES', data)
    },
    SET_COUNT_LOGS_FILES ({ commit }, data) {
      commit('SET_COUNT_LOGS_FILES', data)
    },
    SET_LOGS_FILES_SIZE ({ commit }, data) {
      commit('SET_LOGS_FILES_SIZE', data)
    },
    SET_TOTAL_FILES_SIZE ({ commit }, data) {
      commit('SET_TOTAL_FILES_SIZE', data)
    },
    RESET ({ commit }) {
      commit('REMOVE_ALL_LOGS_FILES')
      commit('SET_LOGS_FILES_SIZE', '0 B')
      commit('SET_TOTAL_FILES_SIZE', 0)
      commit('SET_IN_PROGRESS', false)
    }
  }
}
