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

      <div class="elevation-1" v-if="treatments.length > 0">
        <div class="v-table__overflow">
          <table class="v-datatable v-table theme--light">
            <thead>
              <tr>
                <th
                  class="column text-xs-left"
                  role="columnheader"
                  scope="col"
                  :aria-label="`${$t('ui.pages.admin.jobs.process.userId')} : No Sorted`"
                  aria-sort="none"
                >
                  {{ $t('ui.pages.admin.jobs.process.userId') }}
                </th>
                <th
                  class="column text-xs-left"
                  role="columnheader"
                  scope="col"
                  :aria-label="`${$t('ui.pages.admin.jobs.process.jobId')} : No Sorted`"
                  aria-sort="none"
                >
                  {{ $t('ui.pages.admin.jobs.process.jobId') }}
                </th>
                <th
                  class="column text-xs-left"
                  role="columnheader"
                  scope="col"
                  :aria-label="`${$t('ui.pages.admin.jobs.process.createdAt')} : No Sorted`"
                  aria-sort="none"
                >
                  {{ $t('ui.pages.admin.jobs.process.createdAt') }}
                </th>
                <th
                  class="column text-xs-left"
                  role="columnheader"
                  scope="col"
                  :aria-label="`${$t('ui.pages.admin.jobs.process.state')} : No Sorted`"
                  aria-sort="none"
                >
                  {{ $t('ui.pages.admin.jobs.process.state') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(treatment, index) in treatments"
                :key="index"
              >
                <td class="text-xs-left">
                  {{ treatment.userId }}
                </td>
                <td class="text-xs-left">
                  <router-link :to="{ path: `/report/${treatment.jobId}` }" target="_blank">
                    {{ treatment.jobId }}
                  </router-link>
                </td>
                <td class="text-xs-left">
                  {{ createdAt(treatment.createdAt) }}
                </td>
                <td class="text-xs-left">
                  <v-chip label :color="inProcess(treatment.jobId) ? 'teal' : 'green'" text-color="white">
                    {{ inProcess(treatment.jobId) === true ? $t('ui.pages.admin.jobs.process.inProcess') : $t('ui.pages.admin.jobs.process.completed') }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment';

export default {
  auth: true,
  middleware: ['admin'],
  async fetch ({ store, app }) {
    try {
      await store.dispatch('socket/GET_JOBS', app.socket.id);
      app.socket.on('jobs', (data) => {
        store.dispatch('socket/SET_JOBS', data);
      });

      await store.dispatch('process/GET_TREATMENTS');
    } catch (e) {
      await store.dispatch('snacks/error', `E${e.response.status} - ${this.$t('ui.errors.cannotGetJobs')}`);
    }
  },
  watch: {
    jobs: {
      handler () {
        try {
          this.$store.dispatch('process/GET_TREATMENTS');
        } catch (e) {
          this.$store.dispatch('snacks/error', `E${e.response.status} - ${this.$t('ui.errors.cannotGetJobs')}`);
        }
      },
      deep: true
    }
  },
  computed: {
    jobs: {
      get () { return this.$store.state.socket.jobs; }
    },
    treatments: {
      get () { return this.$store.state.process.treatments; }
    }
  },
  methods: {
    createdAt (date) {
      return moment(date).format(this.$i18n.locale === 'fr' ? 'DD MMM YYYY - HH:mm:ss' : 'YYYY MMM DD - HH:mm:ss');
    },
    inProcess (jobId) {
      const job = this.jobs.find(j => j === jobId);
      return job ? true : false;
    }
  }
};
</script>
