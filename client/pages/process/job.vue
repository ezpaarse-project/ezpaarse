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

    <Treatment @consultReport="consultReport" v-if="!fullReport" />
    <ReportView v-else />
    
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
