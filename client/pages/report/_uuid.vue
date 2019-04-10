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
  async fetch ({ store, params }) {
    try {
      if (params.uuid) await store.dispatch('process/GET_REPORT', params.uuid);
    } catch (e) {
      await store.dispatch('snacks/error', `E${e.response.status} - ${this.$t('ui.errors.cannotGetReport')}`);
    }

    try {
      if (params.uuid) await store.dispatch('process/GET_LOGGING', params.uuid);
    } catch (e) {
      await store.dispatch('snacks/error', `E${e.response.status} - ${this.$t('ui.errors.cannotGetLogging')}`);
    }
  },
  computed: {
    report () {
      return this.$store.state.process.report;
    },
    logging () {
      const lines = this.$store.state.process.logging.split('\n').map(e => {
        const match = /^([a-z0-9:.-]+)\s+([a-z]+):(.*)$/i.exec(e);

        if (!match) { return null; }

        return {
          date: match[1],
          level: match[2],
          message: match[3]
        };
      });
      return lines.filter(l => l);
    }
  }
};
</script>
