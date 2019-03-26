<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dense
      dark
      card
    >
      <v-toolbar-title>
        {{ $t('ui.pages.process.report.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <Report :report="report" />
  </v-card>
</template>

<script>
import Report from '~/components/Report'

export default {
  components: {
    Report
  },
  async fetch ({ store, params }) {
    try {
      if (params.uuid) await store.dispatch('process/GET_REPORT', params.uuid);
    } catch (e) {
      await store.dispatch('snacks/error', `E${e.response.status} - ${this.$t('ui.errors.cannotGetReport')}`);
    }
  },
  computed: {
    report () {
      return this.$store.state.process.report;
    }
  },
};
</script>