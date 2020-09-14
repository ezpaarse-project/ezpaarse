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
      <v-container fluid>
        <v-layout align-start justify-center>
          <v-flex xs4 class="elevation-1 mx-3">
            <v-list subheader>
              <v-subheader>
                {{ $t('ui.pages.admin.middlewares.defaultsMiddlewares') }}
                <v-spacer />
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      fab
                      icon
                      small
                      :loading="loading"
                      v-on="on"
                      @click="resetMiddlewares"
                    >
                      <v-icon dark>
                        mdi-reload
                      </v-icon>
                    </v-btn>
                  </template>
                  <span v-text="$t('ui.pages.admin.middlewares.default')" />
                </v-tooltip>
              </v-subheader>
              <vuedraggable
                v-model="defaultsMiddlewares"
                :options="{ group: 'middlewares' }"
                @change="watchDefaultsMiddlewares"
              >
                <v-list-item
                  v-for="(middleware, key) in defaultsMiddlewares"
                  :key="key"
                  @click.stop
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="middleware" />
                  </v-list-item-content>
                </v-list-item>
              </vuedraggable>
            </v-list>
          </v-flex>
          <v-flex xs4 class="elevation-1 mx-3">
            <v-list subheader>
              <v-subheader v-text="$t('ui.pages.admin.middlewares.middlewares')" />
              <vuedraggable
                v-model="othersMiddlewares"
                :options="{ group: 'middlewares' }"
              >
                <v-list-item v-for="(middleware, key) in othersMiddlewares" :key="key" @click.stop>
                  <v-list-item-content>
                    <v-list-item-title v-text="middleware" />
                  </v-list-item-content>
                </v-list-item>
              </vuedraggable>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import vuedraggable from 'vuedraggable';

export default {
  auth: true,
  middleware: ['admin'],
  components: {
    vuedraggable
  },
  async asyncData ({ app }) {
    const { defaults, others } = await app.$axios.$get('/api/info/middlewares');

    return {
      updating: false,
      onlyOutdated: false,
      defaultsMiddlewares: defaults,
      othersMiddlewares: others,
      loading: false
    };
  },
  async fetch ({ store }) {
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
        hasLocalChanges: !!(middlewares['local-commits'] || middlewares['local-changes']),
        isOutdated: middlewares['from-head'] === 'outdated',
        ...middlewares
      };
    },
    middlewaresChanged () {
      return this.$store.state.middlewaresChanged;
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
        const { defaults, others } = await this.$axios.$get('/api/info/middlewares');
        this.defaultsMiddlewares = defaults;
        this.othersMiddlewares = others;
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
    },
    async watchDefaultsMiddlewares (event) {
      if (event.added || event.moved || event.removed) {
        try {
          const { data } = await this.$axios.post('/api/middlewares', { middlewares: this.defaultsMiddlewares });
          this.defaultsMiddlewares = data.data;
        } catch (e) {
          this.$store.dispatch('snacks/error', 'ui.errors.impossibleToUpdate');
        }
      }
    },
    async resetMiddlewares () {
      this.loading = true;
      try {
        await this.$axios.get('/api/middlewares/reset');
        const { defaults, others } = await this.$axios.$get('/api/info/middlewares');
        this.defaultsMiddlewares = defaults;
        this.othersMiddlewares = others;

        this.loading = false;
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.impossibleToUpdate');
        this.loading = false;
      }
    }
  }
};
</script>
