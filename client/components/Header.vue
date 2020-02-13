<template>
  <v-toolbar app fixed clipped-left :color="dark ? '' : 'primary'">
    <v-toolbar-side-icon @click.stop="setDrawer(!drawer)">
      <v-icon color="white">
        mdi-menu
      </v-icon>
    </v-toolbar-side-icon>
    <v-toolbar-title class="white--text">
      <img class="ezPAARSELogo" src="~/assets/img/logo-white.svg">
      ezPAARSE
    </v-toolbar-title>

    <v-spacer />

    <v-chip label>
      <v-progress-circular
        v-if="pkbState === 'synchronizing'"
        class="mr-2"
        indeterminate
        color="primary"
        :size="16"
        :width="2"
      />
      <span v-if="remainingPkbs > 0 && pkbState === 'synchronizing'">
        {{ $t('ui.header.pkbsRemaining', { pkbs: remainingPkbs }) }}
      </span>

      <span v-if="pkbState === 'synchronized' && remainingPkbs === 0">
        {{ $t('ui.header.pkbsSynchronized') }}
      </span>
    </v-chip>

    <v-btn to="/process" class="text-none" @click="setStep(3)">
      <span v-if="!jobStatus">
        {{ $t('ui.header.noCurrentProcessing') }}
      </span>
      <span v-else-if="jobStatus === 'abort'">
        {{ $t('ui.header.processCanceled') }}
      </span>
      <span v-else-if="jobStatus === 'end'">
        {{ $t('ui.header.processEnd') }}
      </span>
      <span v-else-if="jobStatus === 'finalization'">
        {{ $t('ui.header.finalization') }}
      </span>
      <span v-else-if="jobStatus === 'progress'">
        {{ $t('ui.header.currentProcessing', { percent: progress }) }}
      </span>
      <span v-else-if="jobStatus === 'error'">
        {{ $t('ui.header.processError') }}
      </span>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapActions } from 'vuex';

export default {
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
      return (this.pkbs.remaining || []).length;
    },
    pkbState () {
      return this.pkbs.state;
    },
    dark () {
      return this.$store.state.dark;
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
