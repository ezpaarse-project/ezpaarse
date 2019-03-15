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
      <p><strong>{{ $t('ui.pages.admin.updates.resources') }}</strong></p>
      <p v-html="$t('ui.pages.admin.updates.predefinedParameters')" />
      <p>
        <v-alert
          v-if="resources['local-commits'] || resources['local-changes']"
          :value="true"
          color="red lighten-2"
          v-html="$t('ui.pages.admin.updates.repoLocalChanges', { repo: 'resources' })"
        />
        <strong>{{ $t('ui.currentVersion') }}</strong> :
        <v-tooltip
          v-if="resources['from-head'] === 'outdated'"
          right
        >
          <v-btn
            slot="activator"
            depressed
            color="red lighten-2 white--text"
            round
            @click="update('resources')"
          >
            {{ resources.current }}<v-icon class="pl-1">
              mdi-alert-circle
            </v-icon>
          </v-btn>
          <span>{{ $t('ui.updateTo', { newVersion: resources.head }) }}</span>
        </v-tooltip>
        <v-btn
          v-else
          slot="activator"
          depressed
          color="green lighten-2 white--text"
          round
        >
          {{ resources.current }}
        </v-btn>
        <v-progress-circular
          v-if="inUpdate.resources"
          indeterminate
          color="teal"
        />
      </p>
    </v-card-text>

    <v-divider />

    <v-card-text>
      <v-flex
        xs12
        sm12
      >
        <p><strong>Middlewares</strong></p>
        <p>{{ $t('ui.pages.admin.updates.middlewaresInfo') }}</p>
        <p>
          <v-alert
            v-if="middlewares['local-commits'] || middlewares['local-changes']"
            :value="true"
            color="red lighten-2"
            v-html="$t('ui.pages.admin.updates.repoLocalChanges', { repo: 'middlewares' })"
          />
          <strong>{{ $t('ui.currentVersion') }}</strong> :
          <v-tooltip
            v-if="middlewares['from-head'] === 'outdated'"
            right
          >
            <v-btn
              slot="activator"
              depressed
              color="red lighten-2 white--text"
              round
              @click="update('middlewares')"
            >
              {{ middlewares.current }}<v-icon class="pl-1">
                mdi-alert-circle
              </v-icon>
            </v-btn>
            <span>{{ $t('ui.updateTo', { newVersion: middlewares.head }) }}</span>
          </v-tooltip>
          <v-btn
            v-else
            slot="activator"
            depressed
            color="green lighten-2 white--text"
            round
          >
            {{ middlewares.current }}
          </v-btn>
          <v-progress-circular
            v-if="inUpdate.middlewares"
            indeterminate
            color="teal"
          />
        </p>
      </v-flex>
    </v-card-text>

    <v-divider />

    <v-card-text>
      <v-flex
        xs12
        sm12
      >
        <p><strong>{{ $t('ui.pages.admin.updates.software') }}</strong></p>
        <p>
          <v-alert
            v-if="ezpaarse['local-commits'] || ezpaarse['local-changes']"
            :value="true"
            color="red lighten-2"
          >
            <p>{{ $t('ui.pages.admin.updates.softLocalChanges') }}</p>
            <p>{{ $t('ui.pages.admin.updates.contactDeploymentService') }}</p>
          </v-alert>
          <strong>{{ $t('ui.currentVersion') }}</strong> :
          <v-tooltip
            v-if="ezpaarse['from-head'] === 'outdated'"
            right
          >
            <v-btn
              slot="activator"
              depressed
              color="red lighten-2 white--text"
              round
              @click="updateApp('latest')"
            >
              {{ ezpaarse.current }}<v-icon class="pl-1">
                mdi-alert-circle
              </v-icon>
            </v-btn>
            <span>{{ $t('ui.updateTo', { newVersion: ezpaarse.head }) }}</span>
          </v-tooltip>
          <v-btn
            v-else
            slot="activator"
            depressed
            color="green lighten-2 white--text"
            round
          >
            {{ ezpaarse.current }}
          </v-btn>
          <v-progress-circular
            v-if="inUpdate.ezpaarse"
            indeterminate
            color="teal"
          />
          <br>
          <span v-if="!ezpaarse.isBeta">
            <a @click="updateApp('latest')">
              {{ $t('ui.pages.admin.updates.returnToBetaVersion') }}
            </a>
          </span>
          <span v-if="ezpaarse.isBeta">
            <a @click="updateApp('stable')">
              {{ $t('ui.pages.admin.updates.returnToStableVersion') }}
            </a>
          </span>
        </p>
        <p>{{ $t('ui.pages.admin.updates.updateDuration') }}</p>
      </v-flex>
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
      return this.$store.state.ezpaarse;
    },
    resources () {
      return this.$store.state.resources;
    },
    middlewares () {
      return this.$store.state.middlewares;
    }
  },
  methods: {
    update (repo) {
      if (repo === 'resources') this.inUpdate.resources = true;
      if (repo === 'middlewares') this.inUpdate.middlewares = true;
      if (repo === 'ezpaarse') this.inUpdate.ezpaarse = true;

      this.$store.dispatch('UPDATE_REPO', repo).then(() => {
        this.$store.dispatch('LOAD_STATUS').catch(err => {
          this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotLoadStatus')}`);
        });
      }).catch(err => {
        this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.impossibleToUpdate')}`);
      });

      if (repo === 'resources') this.inUpdate.resources = false;
      if (repo === 'middlewares') this.inUpdate.middlewares = false;
      if (repo === 'ezpaarse') this.inUpdate.ezpaarse = false;
    },
    updateApp (version) {
      this.inUpdate.ezpaarse = true;

      const vers = version || (this.ezpaarse.isBeta ? 'latest' : 'stable');
      this.$store.dispatch('UPDATE_APP', vers).then(() => {
        this.$store.dispatch('LOAD_STATUS')
          .then(() => { this.inUpdate.ezpaarse = false; })
          .catch(err => {
            this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotLoadStatus')}`);
          });
      }).catch(err => {
        this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.impossibleToUpdate')}`);
      });

      this.inUpdate.ezpaarse = false;
    }
  }
};
</script>
