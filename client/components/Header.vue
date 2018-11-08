<template>
  <v-toolbar app dark fixed class="teal">
    <v-toolbar-side-icon @click.stop="setDrawer(!drawer)">
      <v-icon>mdi-menu</v-icon>
    </v-toolbar-side-icon>
    <v-toolbar-title>ezPAARSE</v-toolbar-title>
    
    <v-spacer></v-spacer>

    <v-toolbar-items>
      <div class="text-xs-center mt-2">
        <v-chip>{{ $t('ui.header.pkbsSynchronized') }}</v-chip>
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
    'drawer'
  ]),
  methods: mapActions({
    'setDrawer': 'SET_DRAWER'
  })
}
</script>
