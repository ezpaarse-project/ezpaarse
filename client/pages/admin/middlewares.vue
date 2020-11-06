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

    <Middlewares
      :middlewares="middlewaresList"
      @watchDefaultsMiddlewares="watchDefaultsMiddlewares"
      @removeDefaultMiddlewares="removeDefaultMiddlewares"
    />
  </v-card>
</template>

<script>
import Middlewares from '~/components/Middlewares.vue';

export default {
  auth: true,
  middleware: ['admin'],
  components: {
    Middlewares
  },
  async asyncData ({ app }) {
    const middlewaresList = await app.$axios.$get('/api/info/middlewares');

    return {
      updating: false,
      onlyOutdated: false,
      middlewaresList
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
        const { defaults } = await this.$axios.$get('/api/info/middlewares');
        this.defaultsMiddlewares = defaults;
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
    async watchDefaultsMiddlewares (event, defaults) {
      try {
        await this.$axios.post('/api/middlewares', {
          // eslint-disable-next-line max-len
          middlewares: defaults ? this.middlewaresList.defaultsConfig : this.middlewaresList.defaults
        });
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.impossibleToUpdate');
      }

      try {
        const { data } = await this.$axios.get('/api/info/middlewares');
        this.middlewaresList = data;
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.impossibleToUpdate');
      }

      this.$store.dispatch('snacks/success', 'ui.pages.admin.middlewares.updated');
    },
    async removeDefaultMiddlewares (id) {
      this.middlewaresList.availables.push(this.middlewaresList.defaults[id]);
      this.middlewaresList.defaults.splice(id, 1);
      await this.watchDefaultsMiddlewares();
    }
  }
};
</script>
