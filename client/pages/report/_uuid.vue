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
      await store.dispatch('process/GET_REPORT', params.uuid);
    } catch (e) {
      store.dispatch('snacks/error', 'ui.errors.cannotGetReport');
    }

    try {
      await store.dispatch('process/GET_LOGGING', params.uuid);
    } catch (e) {
      store.dispatch('snacks/error', 'ui.errors.cannotGetLogging');
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
