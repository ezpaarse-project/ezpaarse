<template>
  <v-card>
    <v-toolbar class="secondary" dense dark flat>
      <v-toolbar-title v-text="$t('ui.pages.admin.middlewares.title')" />
    </v-toolbar>

    <v-card-text>
      <v-alert
        :value="middlewares.hasLocalChanges"
        type="error"
        v-text="$t('ui.pages.admin.updates.middlewaresLocalChanges', {
          middlewares: 'middlewares'
        })"
      />

      <v-layout align-center :column="this.$vuetify.breakpoint.smAndDown">
        <div class="subheading">
          {{ $t('ui.currentVersion') }} :

          <v-chip
            v-if="middlewares.current"
            :color="middlewares.isOutdated ? 'error' : 'success'"
            dark
            small
          >
            <v-avatar left>
              <v-icon small>
                {{ middlewares.isOutdated ? 'mdi-alert-circle' : 'mdi-check-circle' }}
              </v-icon>
            </v-avatar>
            {{ middlewares.current }}
          </v-chip>
        </div>

        <v-spacer />

        <v-btn
          small
          :disabled="!middlewares.isOutdated"
          color="accent"
          :loading="updating"
          @click="updateMiddlewares"
        >
          <v-icon left>
            mdi-download
          </v-icon>
          {{ $t('ui.update') }}
        </v-btn>
      </v-layout>
    </v-card-text>

    <v-card-text>
      <v-container>
        <v-layout row wrap>
          <v-flex sx12 sm12 md12>
            <v-text-field
              v-model="search"
              class="mx-1"
              append-icon="mdi-magnify"
              :label="$t('ui.search')"
              solo
              hide-details
              clearable
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>

    <v-data-table
      :headers="headers"
      :items="middlewaresItems"
      :no-data-text="$t('ui.pages.admin.middlewares.noMiddlewares')"
      :no-results-text="$t('ui.pages.admin.middlewares.noMiddlewareFound')"
      :footer-props="footerProps"
      :items-per-page="itemsPerPage"
    >
      <template v-slot:item.name="{ item }">
        {{ item }}
      </template>

      <template v-slot:item.update="{ item }">
        <v-icon v-if="middlewaresChanged[item]" color="info">
          mdi-arrow-up-bold-circle
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  auth: true,
  middleware: ['admin'],
  data () {
    return {
      updating: false,
      onlyOutdated: false,
      search: '',
      itemsPerPage: 10
    };
  },
  async fetch ({ store }) {
    try {
      await store.dispatch('GET_MIDDLEWARES');
    } catch (e) {
      await store.dispatch('snacks/error', 'ui.errors.cannotGetMiddlewares');
    }

    try {
      await store.dispatch('GET_MIDDLEWARES_CHANGED');
    } catch (e) {
      await store.dispatch('snacks/error', 'ui.errors.cannotGetMiddlewaresChanged');
    }
  },
  computed: {
    middlewares () {
      const { middlewares } = this.$store.state;

      return {
        hasLocalChanges: middlewares['local-commits'] || middlewares['local-changes'],
        isOutdated: middlewares['from-head'] === 'outdated',
        ...middlewares
      };
    },
    middlewaresChanged () {
      return this.$store.state.middlewaresChanged;
    },
    middlewaresItems () {
      return this.$store.state.middlewaresItems.filter((middleware) => {
        if (this.onlyOutdated && !this.middlewaresChanged[middleware]) {
          return false;
        }

        if (!middleware.includes(this.search)) {
          return false;
        }

        return true;
      }).sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1));
    },
    headers () {
      return [
        {
          text: this.$t('ui.pages.admin.middlewares.middleware'),
          align: 'left',
          sortable: false,
          value: 'name',
          width: 300
        },
        {
          text: this.$t('ui.pages.admin.middlewares.update'),
          align: 'center',
          sortable: false,
          value: 'update',
          width: 10
        }
      ];
    },
    footerProps () {
      return {
        itemsPerPageText: this.$t('ui.pages.admin.middlewares.middlewaresPerPage'),
        itemsPerPageOptions: [this.itemsPerPage, 30, 50, -1]
      };
    },
    rowsPerPage () {
      return [10, 30, 50, {
        text: this.$t('ui.pages.admin.middlewares.allMiddlewaresPerPage'),
        value: -1
      }];
    }
  },
  methods: {
    async updateMiddlewares () {
      this.updating = true;

      try {
        await this.$store.dispatch('UPDATE_REPO', 'middlewares');
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.impossibleToUpdate');
        this.updating = false;
        return;
      }

      try {
        await this.$store.dispatch('GET_MIDDLEWARES');
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.cannotGetMiddlewares');
        this.updating = false;
        return;
      }

      try {
        await this.$store.dispatch('LOAD_STATUS');
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.cannotLoadStatus');
        this.updating = false;
        return;
      }

      this.updating = false;
    }
  }
};
</script>
