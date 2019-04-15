<template>
  <Report :report="report" :download="download" :logging="logging" />
</template>

<script>
import Report from '~/components/Report';

export default {
  components: {
    Report
  },
  data () {
    return {
      download: true
    };
  },
  async fetch ({ store, params, app }) {
    try {
      await store.dispatch('process/GET_REPORT', params.uuid);
    } catch (e) {
      store.dispatch('snacks/error', `E${e.response.status} - ${app.i18n.t('ui.errors.cannotGetReport')}`);
    }

    try {
      await store.dispatch('process/GET_LOGGING', params.uuid);
    } catch (e) {
      store.dispatch('snacks/error', `E${e.response.status} - ${app.i18n.t('ui.errors.cannotGetLogging')}`);
    }
  },
  computed: {
    report () {
      return this.$store.state.process.report;
    },
    logging () {
      return this.$store.state.process.logging;
    }
  }
};
</script>
