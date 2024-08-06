<template>
  <v-app-bar app fixed clipped-left color="primary">
    <v-app-bar-nav-icon dark @click.stop="setDrawer(!drawer)" />
    <v-toolbar-title class="white--text">
      <img class="ezPAARSELogo" :src="require('@/static/img/logo-white.svg')">
      ezPAARSE
    </v-toolbar-title>

    <v-spacer />

    <v-menu
      bottom
      left
      open-on-hover
      offset-y
    >
      <template #activator="{ on, attrs }">
        <v-chip
          label
          v-bind="attrs"
          v-on="on"
        >
          <v-progress-circular
            v-if="pkbState === 'synchronizing'"
            class="mx-2"
            indeterminate
            color="primary"
            :size="16"
            :width="2"
          />
          <span
            v-if="remainingPkbs > 0 && pkbState === 'synchronizing'"
            v-text="$t('ui.header.pkbsRemaining', { pkbs: remainingPkbs })"
          />

          <span
            v-if="pkbState === 'synchronized' && remainingPkbs === 0"
            v-text="$t('ui.header.pkbsSynchronized')"
          />
        </v-chip>
      </template>

      <v-card>
        <v-card-text v-if="isSynchronizing">
          {{ $t('ui.header.pkbsSynchronizingDesc') }}
        </v-card-text>
        <v-card-text v-else>
          {{ $t('ui.header.pkbsSynchronizedDesc') }}
        </v-card-text>

        <v-list v-if="isSynchronizing" dense>
          <v-list-item v-for="file in synchronizingPkbs" :key="file?.location">
            <v-list-item-avatar>
              <v-progress-circular
                indeterminate
                color="primary"
                :size="24"
                :width="2"
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                {{ file?.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ file?.size | prettyBytes }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <v-btn :to="{ path: '/process' }" class="text-none mx-2 body-2" @click="setStep(3)">
      <span v-if="!jobStatus" v-text="$t('ui.header.noCurrentProcessing')" />
      <span v-else-if="jobStatus === 'abort'" v-text="$t('ui.header.processCanceled')" />
      <span v-else-if="jobStatus === 'end'" v-text="$t('ui.header.processEnd')" />
      <span v-else-if="jobStatus === 'finalization'" v-text="$t('ui.header.finalization')" />
      <span
        v-else-if="jobStatus === 'progress'"
        v-text="$t('ui.header.currentProcessing', { percent: progress })"
      />
      <span v-else-if="jobStatus === 'error'" v-text="$t('ui.header.processError')" />
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex';
import prettyBytes from 'pretty-bytes';

export default {
  filters: {
    prettyBytes (val) {
      let size = parseInt(val, 10);
      if (Number.isNaN(size)) { size = 0; }
      return prettyBytes(size);
    }
  },
  computed: {
    drawer () {
      return this.$store.state.drawer;
    },
    progress () {
      return this.$store.state.process.progress;
    },
    jobStatus () {
      return this.$store.state.process.status;
    },
    pkbs () {
      return this.$store.state.pkbs;
    },
    remainingPkbs () {
      return this.pkbs?.remaining || 0;
    },
    synchronizingPkbs () {
      return Array.isArray(this.pkbs?.synchronizing) ? this.pkbs?.synchronizing : [];
    },
    pkbState () {
      return this.pkbs?.state;
    },
    isSynchronizing () {
      return this.pkbs?.state === 'synchronizing' && this.remainingPkbs > 0;
    }
  },
  methods: mapActions({
    setDrawer: 'SET_DRAWER',
    setStep: 'process/SET_PROCESS_STEP'
  })
};
</script>

<style scoped>
.loadingPkbs {
  width: 50%;
  margin-right: 5px;
}
.ezPAARSELogo {
  width: 32px;
  height: 32px;
  vertical-align: middle;
}
</style>
