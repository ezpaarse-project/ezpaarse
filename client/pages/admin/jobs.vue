<template>
  <v-card>
    <v-toolbar class="secondary" dense dark flat>
      <v-toolbar-title v-text="$t('ui.pages.admin.jobs.title')" />
    </v-toolbar>

    <v-card-text>
      <p v-html="$t('ui.pages.admin.jobs.currentProcess', { process: jobs.length })" />
      <v-container>
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
              transition="scale-transition"
              offset-y
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
                />
              </template>
              <v-date-picker
                v-model="datePicker.startDate"
                :locale="$i18n.locale"
                @input="datePicker.startDateMenu = false"
              />
            </v-menu>
          </v-flex>
          <v-flex xs12 sm2>
            <v-menu
              v-model="datePicker.endDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
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
                />
              </template>
              <v-date-picker
                v-model="datePicker.endDate"
                :locale="$i18n.locale"
                @input="datePicker.endDateMenu = false"
              />
            </v-menu>
          </v-flex>
        </v-layout>
      </v-container>

      <v-data-table
        :items="treatments"
        :no-data-text="$t('ui.pages.admin.jobs.noJobs')"
        :no-results-text="$t('ui.pages.admin.jobs.noJobFound')"
        :footer-props="footerProps"
        :sort-by="['createdAt']"
        :sort-desc="[true]"
        :headers="headers"
        :search="search"
        class="elevation-1"
        item-key="id"
      >
        <template v-slot:item.userId="{ item }">
          <span v-if="item.userId" v-text="item.userId" />
          <span v-else v-text="$t('ui.pages.admin.jobs.anonymous')" />
        </template>

        <template v-slot:item.jobId="{ item }">
          <router-link
            :to="localePath({ path: `/report/${item.jobId}` })"
            target="_blank"
            v-text="item.jobId"
          />
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt, $i18n.locale | formatDate }}
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            v-if="item.status === 'completed'"
            label
            color="green"
            text-color="white"
            v-text="$t('ui.pages.admin.jobs.process.completed')"
          />
          <v-chip
            v-else-if="item.status === 'abort'"
            label
            color="blue-grey darken-4"
            text-color="white"
            v-text="$t('ui.pages.admin.jobs.process.abort')"
          />
          <v-chip
            v-else-if="item.status === 'error'"
            label
            color="red"
            text-color="white"
            v-text="$t('ui.pages.admin.jobs.process.error')"
          />
          <v-chip
            v-else-if="item.status === 'started'"
            label
            color="teal"
            text-color="white"
            v-text="$t('ui.pages.admin.jobs.process.started')"
          />
          <v-chip
            v-else
            label
            color="primary"
            text-color="white"
            v-text="item.status"
          />
        </template>


        <template v-slot:item.action="{ item }">
          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item :href="localePath(`/${item.jobId}`)" target="_blank">
                <v-list-item-avatar>
                  <v-icon>mdi-download</v-icon>
                </v-list-item-avatar>

                <v-list-item-title v-text="$t('ui.pages.process.job.downloadResult')" />
              </v-list-item>

              <v-list-item @click="jobId = item.jobId; uploaderDialog = true">
                <v-list-item-avatar>
                  <v-icon>mdi-cloud-upload</v-icon>
                </v-list-item-avatar>

                <v-list-item-title v-text="$t('ui.ezmesure.loadIntoEzmesure')" />
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card-text>

    <EzmesureUploader :visible.sync="uploaderDialog" :job-id="jobId" />
  </v-card>
</template>

<script>
import moment from 'moment';
import EzmesureUploader from '~/components/EzmesureUploader.vue';

export default {
  auth: true,
  middleware: ['admin'],
  components: {
    EzmesureUploader
  },
  filters: {
    formatDate (...args) {
      if (args && !args[0]) return null;
      return moment(args[0]).format(args && args[1] === 'fr' ? 'DD MMM YYYY' : 'YYYY MMM DD');
    }
  },
  data () {
    return {
      search: '',
      uploaderDialog: false,
      jobId: '',
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
      },
      itemsPerPage: 10
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
          value: 'createdAt',
          width: 250
        },
        {
          text: this.$t('ui.pages.admin.jobs.process.state'),
          align: 'left',
          sortable: true,
          value: 'status',
          width: 150
        },
        {
          text: 'Actions',
          value: 'action',
          align: 'right',
          sortable: false,
          width: 100
        }
      ];
    },
    footerProps () {
      return {
        itemsPerPageText: this.$t('ui.pages.admin.jobs.jobsPerPage'),
        pagination: this.pagination,
        itemsPerPageOptions: [this.itemsPerPage, 30, 50, -1]
      };
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
