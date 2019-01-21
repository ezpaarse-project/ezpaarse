<template>
  <v-card>
    <v-toolbar class="secondary" dense dark card>
      <v-toolbar-title v-if="!fullReport">
        {{ $t('ui.pages.process.job.title') }}
      </v-toolbar-title>
      <v-toolbar-title v-else>
        {{ $t('ui.pages.process.report.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <Treatment :report="report" :logging="logging" :processProgress="processProgress" @consultReport="consultReport" v-if="!fullReport" />
    <ReportView :report="report" v-else />
    
  </v-card>
</template>

<script>
import Treatment from '~/components/Process/Treatment'
import ReportView from '~/components/Process/Report'

export default {
  auth: true,
  components: {
    Treatment,
    ReportView
  },
  data () {
    return {
      fullReport: false,
    }
  },
  fetch ({ store, redirect }) {
    if (!store.state.process.inProgress) {
      return redirect('/process')
    }
  },
  computed: {
    report () {
      return this.$store.state.socket.report
    },
    logging () {
      return this.$store.state.socket.logging
    },
    processProgress () {
      return this.$store.state.process.processProgress
    }
  },
  sockets: {
    report: function (data) {
      this.$store.dispatch('socket/SOCKET_REPORT', data)
    },
    logging: function (data)  {
      this.$store.dispatch('socket/SOCKET_LOGGING', data)
    }
  },
  methods: {
    consultReport () {
      this.fullReport = true
    }
  }
}
</script>
