import api from './api'

export default {
  namespaced: true,
  state: {
    predefinedSettings: []
  },
  mutations: {
    SET_PREDEFINED_SETTINGS (state, data) {
      Vue.set(state, 'predefinedSettings', data)
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
      }).catch(err => {})
    },
    PROCESS_WITH_FILE ({ commit }, data) {
      return api.processWithFile(this.$axios, data.jobID, data.formData, data.headers).catch(err => {})
    }
  }
}
