<template>
  <v-card>
    <v-toolbar class="secondary" dense dark card>
      <v-toolbar-title>{{ $t('ui.pages.admin.jobs.title') }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text >
      <p v-html="$t('ui.pages.admin.jobs.currentProcess', { process: jobs.length })" />
      <v-layout row wrap fill-height>
        <v-flex xs12 sm6>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('ui.search')"
            single-line
          />
        </v-flex>

        <v-spacer />

        <v-flex xs12 sm2 ml-2 pr-2>
          <v-menu
            v-model="datePicker.startDateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :value="datePicker.startDate, $i18n.locale | formatDate"
                :label="$t('ui.pages.admin.jobs.startDate')"
                prepend-icon="mdi-calendar"
                readonly
                clearable
                @click:clear="datePicker.startDate = null"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="datePicker.startDate" :locale="$i18n.locale" @input="datePicker.startDateMenu = false"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 sm2>
          <v-menu
            v-model="datePicker.endDateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :value="datePicker.endDate, $i18n.locale | formatDate"
                :label="$t('ui.pages.admin.jobs.endDate')"
                prepend-icon="mdi-calendar"
                readonly
                clearable
                @click:clear="datePicker.endDate = null"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="datePicker.endDate" :locale="$i18n.locale" @input="datePicker.endDateMenu = false"></v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>

      <v-data-table
        :items="treatments"
        :no-data-text="$t('ui.pages.admin.jobs.noJobs')"
        :rows-per-page-text="$t('ui.pages.admin.jobs.jobsPerPage')"
        :pagination.sync="pagination"
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
            {{ props.item.createdAt, $i18n.locale | formatDate }}
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
  filters: {
    formatDate (...args) {
      if (args && !args[0]) return null;
      return moment(args[0]).format(args && args[1] === 'fr' ? 'DD MMM YYYY' : 'YYYY MMM DD');
    }
  },
  data () {
    return {
      search: '',
      datePicker: {
        startDateMenu: false,
        startDate: null,
        endDateMenu: false,
        endDate: null
      },
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: 10,
        sortBy: 'createdAt',
        totalItems: 0
      }
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
          sortable: true,
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
        if (!this.datePicker.startDate) {
           return this.$store.state.process.treatments;
        }

        const currentDate = new Date().toISOString().substr(0, 10);
        return this.$store.state.process.treatments.filter(entry => {
          const createdAt = moment(entry.createdAt).format('L');
          const startDate = moment(this.datePicker.startDate).format('L');
          const endDate = moment(this.datePicker.endDate || currentDate).format('L');

          return createdAt >= startDate && createdAt <= endDate;
        });
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
    clearDate (date) {
      if (date === 'start') {
        this.datePicker.startDate = null;
      }
      if (date === 'end') {
        this.datePicker.endDate = null;
      }
    }
  }
};
</script>
