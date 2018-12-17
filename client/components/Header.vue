<template>
  <v-toolbar app dark fixed class="teal">
    <v-toolbar-side-icon @click.stop="setDrawer(!drawer)">
      <v-icon>mdi-menu</v-icon>
    </v-toolbar-side-icon>
    <v-toolbar-title>ezPAARSE</v-toolbar-title>
    
    <v-spacer></v-spacer>

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
          ></v-progress-circular>
          <span v-if="pkbs && pkbs.remaining.length > 0 && pkbs.state === 'synchronizing'">
            {{ $t('ui.header.pkbsRemaining', { pkbs: pkbs.remaining.length }) }}
          </span>

          <span v-if="pkbs && pkbs.state === 'synchronized'">
            {{ $t('ui.header.pkbsSynchronized') }}
          </span>
        </v-chip>
      </div>
      <div class="text-xs-center mt-2">
        <v-chip>{{ $t('ui.header.noCurrentProcessing') }}</v-chip>
      </div>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: mapState([
    'drawer',
    'pkbs',
  ]),
  methods: mapActions({
    'setDrawer': 'SET_DRAWER'
  })
}
</script>

<style scoped>
.loadingPkbs {
  width: 50%;
  margin-right: 5px;
}
</style>