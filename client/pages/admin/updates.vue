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
          small
          :disabled="!resources.isOutdated"
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
          small
          :disabled="!middlewares.isOutdated"
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

            <v-chip
              v-if="ezpaarse.current"
              color="info"
              dark
              small
              label
            >
              <span v-if="ezpaarse.isBeta">
                {{ $t('ui.pages.admin.updates.beta') }}
              </span>
              <span v-else>
                {{ $t('ui.pages.admin.updates.stable') }}
              </span>
            </v-chip>
          </div>
        </div>

        <v-spacer />

        <v-btn
          small
          :disabled="ezpaarse.tag === ezpaarse.head"
          :loading="inUpdate.ezpaarse"
          @click="updateApp(ezpaarse.isBeta ? 'stable' : 'latest')"
        >
          <v-icon left>
            mdi-sync
          </v-icon>
          <span v-if="ezpaarse.isBeta">
            {{ $t('ui.pages.admin.updates.switchToStable') }}
          </span>
          <span v-else>
            {{ $t('ui.pages.admin.updates.switchToBeta') }}
          </span>
        </v-btn>
        <v-btn
          small
          :disabled="!ezpaarse.isOutdated"
          color="accent"
          :loading="inUpdate.ezpaarse"
          @click="updateApp()"
        >
          <v-icon left>
            mdi-download
          </v-icon>
          {{ $t('ui.update') }}
        </v-btn>
      </v-layout>

      <p>{{ $t('ui.pages.admin.updates.updateDuration') }}</p>

      <Logs v-if="updateLogs" :logs="fullUpdateLogs" max-height="500" />
    </v-card-text>

    <v-dialog v-model="refreshDialog" max-width="400px">
      <v-card>
        <v-card-title>
          <div class="title">{{ $t('ui.pages.admin.updates.updateCompleted') }}</div>
        </v-card-title>
        <v-card-text class="text-xs-justify">
          {{ $t('ui.pages.admin.updates.pleaseRefreshPage') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat @click="refreshDialog=false">
            {{ $t('ui.close') }}
          </v-btn>
          <v-btn color="primary" @click="reloadPage(); refreshDialog=false">
            {{ $t('ui.refresh') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import Logs from '~/components/Logs';

export default {
  auth: true,
  middleware: ['admin'],
  components: {
    Logs
  },
  data () {
    return {
      updateLogs: '',
      refreshDialog: false,
      inUpdate: {
        resources: false,
        middlewares: false,
        ezpaarse: false
      }
    };
  },
  computed: {
    fullUpdateLogs () {
      return this.updateLogs.split('\n').map(message => ({ message }));
    },
    ezpaarse () {
      const { ezpaarse } = this.$store.state;
      return {
        hasLocalChanges: ezpaarse['local-commits'] || ezpaarse['local-changes'],
        isOutdated: ezpaarse[ezpaarse.isBeta ? 'from-head' : 'from-tag'] === 'outdated',
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
  mounted () {
    this.$socket.on('update-logs', data => {
      this.updateLogs += data;
    });
  },
  beforeDestroy () {
    this.$socket.off('update-logs');
  },
  methods: {
    reloadPage () {
      window.location.reload();
    },
    async update (repo) {
      if (!Object.prototype.hasOwnProperty.call(this.inUpdate, repo)) { return; }
      this.inUpdate[repo] = true;

      try {
        await this.$store.dispatch('UPDATE_REPO', repo);
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.impossibleToUpdate');
      }

      try {
        await this.$store.dispatch('LOAD_STATUS');
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.cannotLoadStatus');
      }

      this.inUpdate[repo] = false;
    },
    async updateApp (target) {
      if (this.inUpdate.ezpaarse) { return; }

      this.inUpdate.ezpaarse = true;
      this.updateLogs = '';

      const version = target || (this.ezpaarse.isBeta ? 'latest' : 'stable');

      try {
        await this.$store.dispatch('UPDATE_APP', { version, socketId: this.$socket.id });
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.impossibleToUpdate');
      }

      await new Promise(resolve => {
        this.$socket.once('connect', resolve);
      });

      try {
        await this.$store.dispatch('LOAD_STATUS');
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.cannotLoadStatus');
      }

      this.refreshDialog = true;
      this.inUpdate.ezpaarse = false;
    }
  }
};
</script>
