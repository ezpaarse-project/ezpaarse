<template>
  <v-toolbar app dark fixed class="teal">
    <v-toolbar-side-icon @click.stop="setDrawer(!drawer)">
      <v-icon>mdi-menu</v-icon>
    </v-toolbar-side-icon>
    <v-toolbar-title>ezPAARSE</v-toolbar-title>

    <v-spacer/>

    <v-toolbar-items>
      <div class="text-xs-center mt-2">
        <v-chip>
          <v-progress-circular
            v-if="pkbs && pkbs.state === 'synchronizing'"
            indeterminate
            color="teal"
            class="loadingPkbs"
            :size="16"
            :width="2"
          />

          <span
            v-if="pkbs && pkbs.remaining.length > 0 && pkbs.state === 'synchronizing'"
          >{{ $t('ui.header.pkbsRemaining', { pkbs: pkbs.remaining.length }) }}</span>
          
          <span
            v-if="pkbs && pkbs.state === 'synchronized' && pkbs.remaining.length <= 0"
          >{{ $t('ui.header.pkbsSynchronized') }}</span>
        </v-chip>
      </div>
      <div class="text-xs-center mt-2">
        <v-chip v-if="!inProgress">{{ $t('ui.header.noCurrentProcessing') }}</v-chip>
        <nuxt-link
          v-else-if="!inProgress && status === 'abort' && status !== 'error' && status !== 'end'  && status !== 'finalisation'"
          tag="v-chip"
          to="/process/job"
        >{{ $t('ui.header.processCanceled') }}</nuxt-link>
        <nuxt-link
          v-else-if="!inProgress && status === 'end' && status !== 'error' && status !== 'abort'  && status !== 'finalisation'"
          tag="v-chip"
          to="/process/job"
        >{{ $t('ui.header.processEnd') }}</nuxt-link>
        <nuxt-link
          v-else-if="inProgress && status === 'finalisation' &&  status !== 'error' && status !== 'abort'  && status !== 'end'"
          tag="v-chip"
          to="/process/job"
        >{{ $t('ui.header.finalisation') }}</nuxt-link>
        <nuxt-link
          v-else
          tag="v-chip"
          to="/process/job"
        >{{ $t('ui.header.currentProcessing', { percent: processProgress }) }}</nuxt-link>
      </div>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapActions } from "vuex";

export default {
  computed: {
    drawer() {
      return this.$store.state.drawer;
    },
    pkbs() {
      return this.$store.state.pkbs;
    },
    processProgress() {
      return this.$store.state.process.processProgress;
    },
    inProgress() {
      return this.$store.state.process.inProgress;
    },
    status() {
      return this.$store.state.process.status;
    }
  },
  methods: mapActions({
    setDrawer: "SET_DRAWER"
  })
};
</script>

<style scoped>
.loadingPkbs {
  width: 50%;
  margin-right: 5px;
}
</style>
