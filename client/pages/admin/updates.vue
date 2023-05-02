<template>
  <v-card>
    <v-toolbar class="secondary" dense dark flat>
      <v-toolbar-title>
        {{ $t('ui.pages.admin.updates.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <div class="headline" v-text="$t('ui.pages.admin.updates.resources')" />
      <p v-text="$t('ui.pages.admin.updates.predefinedParameters')" />

      <v-alert
        :value="resources.hasLocalChanges"
        type="error"
        v-text="$t('ui.pages.admin.updates.repoLocalChanges', { repo: 'resources' })"
      />

      <v-layout align-center :column="$vuetify.breakpoint.smAndDown">
        <div class="subheading">
          {{ $t('ui.currentVersion') }} :

          <v-chip
            v-if="resources.current"
            :color="resources.isOutdated ? 'error' : 'success'"
            dark
            small
          >
            <v-avatar left>
              <v-icon small>
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
      <div class="headline" v-text="$t('ui.pages.admin.updates.middlewares')" />
      <p v-text="$t('ui.pages.admin.updates.middlewaresInfo')" />

      <v-alert
        :value="middlewares.hasLocalChanges"
        type="error"
        v-text="$t('ui.pages.admin.updates.repoLocalChanges', { repo: 'middlewares' })"
      />

      <v-layout align-center :column="$vuetify.breakpoint.smAndDown">
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

    <v-card-text v-if="!ezpaarse.isGitRepo">
      <div class="headline" v-text="$t('ui.pages.admin.updates.software')" />
      <div class="subheading">
        {{ $t('ui.currentVersion') }} :
        <v-chip small v-text="$t('ui.pages.admin.updates.unversioned')" />
      </div>
      <p v-text="$t('ui.pages.admin.updates.cannotUpdate')" />
    </v-card-text>

    <v-card-text v-else>
      <div class="headline" v-text="$t('ui.pages.admin.updates.software')" />

      <v-alert
        :value="ezpaarse.hasLocalChanges"
        type="error"
      >
        <div v-text="$t('ui.pages.admin.updates.softLocalChanges')" />
        <div v-text="$t('ui.pages.admin.updates.contactDeploymentService')" />
      </v-alert>

      <v-layout align-center :column="$vuetify.breakpoint.smAndDown">
        <div class="subheading">
          {{ $t('ui.currentVersion') }} :

          <v-chip
            v-if="ezpaarse.current"
            :color="ezpaarse.isOutdated ? 'error' : 'success'"
            dark
            small
          >
            <v-avatar left>
              <v-icon small>
                {{ ezpaarse.isOutdated ? 'mdi-alert-circle' : 'mdi-check-circle' }}
              </v-icon>
            </v-avatar>
            {{ ezpaarse.current }}
          </v-chip>

          <v-chip
            v-if="ezpaarse.isBeta"
            color="info"
            dark
            small
            label
            class="text-uppercase"
            v-text="$t('ui.pages.admin.updates.beta')"
          />
        </div>

        <v-spacer />

        <v-btn
          class="mr-5"
          small
          :disabled="ezpaarse.tag === ezpaarse.head"
          :loading="inUpdate.ezpaarse"
          @click="updateApp(ezpaarse.isBeta ? 'stable' : 'latest')"
        >
          <v-icon left>
            mdi-sync
          </v-icon>
          <span v-if="ezpaarse.isBeta" v-text="$t('ui.pages.admin.updates.switchToStable')" />
          <span v-else v-text="$t('ui.pages.admin.updates.switchToBeta')" />
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

      <div class="my-2">
        {{ $t('ui.pages.admin.updates.latestVersions') }}
        <ul>
          <li class="py-1">
            {{ $t('ui.pages.admin.updates.stable') }}
            <v-chip small v-text="ezpaarse.tag" />
          </li>
          <li class="py-1">
            {{ $t('ui.pages.admin.updates.beta') }}
            <v-chip small v-text="ezpaarse.head" />
          </li>
        </ul>
      </div>

      <p v-text="$t('ui.pages.admin.updates.updateDuration')" />

      <Logs v-if="updateLogs" :logs="fullUpdateLogs" max-height="500" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="red white--text" @click.stop="setRestartDialogVisible(true)">
        {{ $t('ui.pages.admin.restart.button') }}
        <v-icon color="white">
          mdi-restart
        </v-icon>
      </v-btn>
    </v-card-actions>

    <RestartDialog
      v-model="restartDialogVisible"
      @closed="setRestartDialogVisible(false)"
    />

    <v-dialog v-model="refreshDialog" max-width="400px">
      <v-card>
        <v-card-title>
          <div class="title" v-text="$t('ui.pages.admin.updates.updateCompleted')" />
        </v-card-title>
        <v-card-text
          class="text-xs-justify"
          v-text="$t('ui.pages.admin.updates.pleaseRefreshPage')"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn class="body-2" text @click="refreshDialog = false" v-text="$t('ui.close')" />
          <v-btn
            class="body-2"
            color="primary"
            @click="reloadPage(); refreshDialog = false"
            v-text="$t('ui.refresh')"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import Logs from '~/components/Logs.vue';
import RestartDialog from '~/components/Admin/RestartDialog.vue';

export default {
  auth: true,
  middleware: ['admin'],
  components: {
    Logs,
    RestartDialog
  },
  data () {
    return {
      restartDialogVisible: false,
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
        hasLocalChanges: !!(ezpaarse['local-commits'] || ezpaarse['local-changes']),
        isOutdated: ezpaarse[ezpaarse.isBeta ? 'from-head' : 'from-tag'] === 'outdated',
        isGitRepo: ezpaarse['is-git-repo'] !== false,
        ...ezpaarse
      };
    },
    resources () {
      const { resources } = this.$store.state;
      return {
        hasLocalChanges: !!(resources['local-commits'] || resources['local-changes']),
        isOutdated: resources['from-head'] === 'outdated',
        ...resources
      };
    },
    middlewares () {
      const { middlewares } = this.$store.state;
      return {
        hasLocalChanges: !!(middlewares['local-commits'] || middlewares['local-changes']),
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
    },
    setRestartDialogVisible (value) {
      this.restartDialogVisible = value;
    }
  }
};
</script>
