<template>
  <v-card>
    <v-toolbar class="secondary" dense dark card>
      <v-toolbar-title>{{ $t('ui.pages.admin.jobs.title') }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <p v-html="$t('ui.pages.admin.jobs.currentProcess', { process: jobs.length })"/>

      <v-flex v-if="treatments.length > 0" xs12>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('ui.search')"
          single-line
        />
      </v-flex>
      <v-data-table
        v-if="treatments.length > 0"
        :items="treatments"
        hide-actions
        :headers="headers"
        :search="search"
        class="elevation-1"
        item-key="id"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">
            {{ props.item.userId }}
          </td>
          <td class="text-xs-left">
            <router-link
              :to="{ path: `/report/${props.item.jobId}` }"
              target="_blank"
            >
              {{ props.item.jobId }}
            </router-link>
          </td>
          <td class="text-xs-left">
            {{ createdAt(props.item.createdAt) }}
          </td>
          <td class="text-xs-left">
            <v-chip
              v-if="props.item.status === 'completed'"
              label
              color="green"
              text-color="white"
            >
              {{ $t('ui.pages.admin.jobs.process.completed') }}
            </v-chip>
            <v-chip
              v-else-if="props.item.status === 'abort'"
              label
              color="blue-grey darken-4"
              text-color="white"
            >
              {{ $t('ui.pages.admin.jobs.process.abort') }}
            </v-chip>
            <v-chip
              v-else-if="props.item.status === 'error'"
              label
              color="red"
              text-color="white"
            >
              {{ $t('ui.pages.admin.jobs.process.error') }}
            </v-chip>
            <v-chip
              v-else-if="props.item.status === 'started'"
              label
              color="teal"
              text-color="white"
            >
              {{ $t('ui.pages.admin.jobs.process.started') }}
            </v-chip>
            <v-chip
              v-else
              label
              color="primary"
              text-color="white"
            >
              {{ props.item.status }}
            </v-chip>
          </td>
        </template>
        <v-alert
          slot="no-results"
          :value="true"
          color="info"
          icon="mdi-alert-circle"
        >
          {{ $t('ui.pages.admin.jobs.noDataFoundWith', { search }) }}
        </v-alert>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment';

export default {
  auth: true,
  middleware: ['admin'],
  data () {
    return {
      search: ''
    };
  },
  async fetch ({ store, app }) {
    try {
      await store.dispatch('socket/GET_JOBS');
      app.socket.on('jobs', data => {
        store.dispatch('socket/SET_JOBS', data);
      });

      await store.dispatch('process/GET_TREATMENTS');
    } catch (e) {
      await store.dispatch(
        'snacks/error',
        `E${e.response.status} - ${this.$t('ui.errors.cannotGetJobs')}`
      );
    }
  },
  computed: {
    headers () {
      return [
        {
          text: this.$t('ui.pages.admin.jobs.process.userId'),
          align: 'left',
          sortable: true,
          value: 'userId'
        },
        {
          text: this.$t('ui.pages.admin.jobs.process.jobId'),
          align: 'left',
          sortable: false,
          value: 'jobId'
        },
        {
          text: this.$t('ui.pages.admin.jobs.process.createdAt'),
          align: 'left',
          sortable: true,
          value: 'createdAt'
        },
        {
          text: this.$t('ui.pages.admin.jobs.process.state'),
          align: 'left',
          sortable: true,
          value: 'status'
        }
      ];
    },
    jobs: {
      get () {
        return this.$store.state.socket.jobs;
      }
    },
    treatments: {
      get () {
        return this.$store.state.process.treatments;
      }
    }
  },
  watch: {
    jobs: {
      handler () {
        try {
          this.$store.dispatch('process/GET_TREATMENTS');
        } catch (e) {
          this.$store.dispatch(
            'snacks/error',
            `E${e.response.status} - ${this.$t('ui.errors.cannotGetJobs')}`
          );
        }
      },
      deep: true
    }
  },
  methods: {
    createdAt (date) {
      return moment(date).format('DD MMM YYYY - HH:mm:ss');
    }
  }
};
</script>
