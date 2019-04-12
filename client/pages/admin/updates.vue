<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dense
      dark
      card
    >
      <v-toolbar-title>
        {{ $t('ui.pages.admin.updates.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <div class="headline">
        {{ $t('ui.pages.admin.updates.resources') }}
      </div>
      <p>
        {{ $t('ui.pages.admin.updates.predefinedParameters') }}
      </p>

      <v-alert
        :value="resources.hasLocalChanges"
        type="error"
        v-text="$t('ui.pages.admin.updates.repoLocalChanges', { repo: 'resources' })"
      />

      <v-layout align-center :column="this.$vuetify.breakpoint.smAndDown">
        <div class="subheading">
          {{ $t('ui.currentVersion') }} :

          <v-chip
            v-if="resources.current"
            :color="resources.isOutdated ? 'error' : 'success'"
            dark
            small
          >
            <v-avatar>
              <v-icon>
                {{ resources.isOutdated ? 'mdi-alert-circle' : 'mdi-check-circle' }}
              </v-icon>
            </v-avatar>
            {{ resources.current }}
          </v-chip>
        </div>

        <v-spacer />

        <v-btn
          v-if="resources.isOutdated"
          color="accent"
          :loading="inUpdate.resources"
          @click="update('resources')"
        >
          <v-icon left>
            mdi-download
          </v-icon>
          {{ $t('ui.update') }}
        </v-btn>
      </v-layout>
    </v-card-text>

    <v-divider />

    <v-card-text>
      <div class="headline">
        {{ $t('ui.pages.admin.updates.middlewares') }}
      </div>
      <p>
        {{ $t('ui.pages.admin.updates.middlewaresInfo') }}
      </p>

      <v-alert
        :value="middlewares.hasLocalChanges"
        type="error"
        v-text="$t('ui.pages.admin.updates.repoLocalChanges', { repo: 'middlewares' })"
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
            <v-avatar>
              <v-icon>
                {{ middlewares.isOutdated ? 'mdi-alert-circle' : 'mdi-check-circle' }}
              </v-icon>
            </v-avatar>
            {{ middlewares.current }}
          </v-chip>
        </div>

        <v-spacer />

        <v-btn
          v-if="middlewares.isOutdated"
          color="accent"
          :loading="inUpdate.middlewares"
          @click="update('middlewares')"
        >
          <v-icon left>
            mdi-download
          </v-icon>
          {{ $t('ui.update') }}
        </v-btn>
      </v-layout>
    </v-card-text>

    <v-divider />

    <v-card-text>
      <div class="headline">
        {{ $t('ui.pages.admin.updates.software') }}
      </div>

      <v-alert
        :value="ezpaarse.hasLocalChanges"
        type="error"
      >
        <div>{{ $t('ui.pages.admin.updates.softLocalChanges') }}</div>
        <div>{{ $t('ui.pages.admin.updates.contactDeploymentService') }}</div>
      </v-alert>

      <v-layout align-center :column="this.$vuetify.breakpoint.smAndDown">
        <div>
          <div class="subheading">
            {{ $t('ui.currentVersion') }} :

            <v-chip
              v-if="ezpaarse.current"
              :color="ezpaarse.isOutdated ? 'error' : 'success'"
              dark
              small
            >
              <v-avatar>
                <v-icon>
                  {{ ezpaarse.isOutdated ? 'mdi-alert-circle' : 'mdi-check-circle' }}
                </v-icon>
              </v-avatar>
              {{ ezpaarse.current }}
            </v-chip>
          </div>
        </div>

        <v-spacer />

        <v-btn
          v-if="ezpaarse.isOutdated"
          color="accent"
          :loading="inUpdate.ezpaarse"
          @click="updateApp"
        >
          <v-icon left>
            mdi-download
          </v-icon>
          {{ $t('ui.update') }}
        </v-btn>
      </v-layout>

      <div>
        <a @click="updateApp(ezpaarse.isBeta ? 'stable' : 'latest')">
          <span v-if="ezpaarse.isBeta">
            {{ $t('ui.pages.admin.updates.returnToStableVersion') }}
          </span>
          <span v-else>
            {{ $t('ui.pages.admin.updates.returnToBetaVersion') }}
          </span>
        </a>
      </div>

      <p>{{ $t('ui.pages.admin.updates.updateDuration') }}</p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  auth: true,
  middleware: ['admin'],
  data () {
    return {
      inUpdate: {
        resources: false,
        middlewares: false,
        ezpaarse: false
      }
    };
  },
  computed: {
    ezpaarse () {
      const { ezpaarse } = this.$store.state;
      return {
        hasLocalChanges: ezpaarse['local-commits'] || ezpaarse['local-changes'],
        isOutdated: ezpaarse['from-head'] === 'outdated',
        ...ezpaarse
      };
    },
    resources () {
      const { resources } = this.$store.state;
      return {
        hasLocalChanges: resources['local-commits'] || resources['local-changes'],
        isOutdated: resources['from-head'] === 'outdated',
        ...resources
      };
    },
    middlewares () {
      const { middlewares } = this.$store.state;
      return {
        hasLocalChanges: middlewares['local-commits'] || middlewares['local-changes'],
        isOutdated: middlewares['from-head'] === 'outdated',
        ...middlewares
      };
    }
  },
  methods: {
    async update (repo) {
      if (!Object.prototype.hasOwnProperty.call(this.inUpdate, repo)) { return; }
      this.inUpdate[repo] = true;

      try {
        await this.$store.dispatch('UPDATE_REPO', repo);
      } catch (e) {
        this.$store.dispatch('snacks/error', `E${e.response.status} - ${this.$t('ui.errors.impossibleToUpdate')}`);
      }

      try {
        await this.$store.dispatch('LOAD_STATUS');
      } catch (e) {
        this.$store.dispatch('snacks/error', `E${e.response.status} - ${this.$t('ui.errors.cannotLoadStatus')}`);
      }

      this.inUpdate[repo] = false;
    },
    async updateApp (target) {
      this.inUpdate.ezpaarse = true;

      const version = target || (this.ezpaarse.isBeta ? 'latest' : 'stable');

      try {
        await this.$store.dispatch('UPDATE_APP', version);
      } catch (e) {
        this.$store.dispatch('snacks/error', `E${e.response.status} - ${this.$t('ui.errors.impossibleToUpdate')}`);
      }

      try {
        await this.$store.dispatch('LOAD_STATUS');
      } catch (e) {
        this.$store.dispatch('snacks/error', `E${e.response.status} - ${this.$t('ui.errors.cannotLoadStatus')}`);
      }

      this.inUpdate.ezpaarse = false;
    }
  }
};
</script>
