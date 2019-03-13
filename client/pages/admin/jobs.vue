<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dense
      dark
      card
    >
      <v-toolbar-title>
        {{ $t('ui.pages.admin.jobs.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <p v-html="$t('ui.pages.admin.jobs.currentProcess', { process: jobs.length })" />
      <p
        v-for="(job, key) in jobs"
        :key="key"
      >
        <a :href="`/report/${job}`">
          {{ job }}
        </a>
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  auth: true,
  middleware: ['admin'],
  async fetch ({ store, app }) {
    try {
      await store.dispatch('socket/GET_JOBS', app.socket.id);
      app.socket.on('jobs', (data) => {
        store.dispatch('socket/SET_JOBS', data);
      });
      return true;
    } catch (e) {
      await store.dispatch('snack/error', app.i18n.t('ui.errors.error'));
      return false;
    }
  },
  computed: {
    jobs: {
      get () { return this.$store.state.socket.jobs; }
    }
  }
};
</script>
