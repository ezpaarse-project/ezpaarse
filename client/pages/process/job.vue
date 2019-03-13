<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dense
      dark
      card
    >
      <v-toolbar-title>
        {{ $t('ui.pages.process.job.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <Treatment />
  </v-card>
</template>

<script>
/* eslint-disable import/no-unresolved */
import Treatment from '~/components/Process/Treatment';

export default {
  auth: true,
  components: {
    Treatment
  },
  fetch ({ store, redirect }) {
    if (!store.state.process.inProgress) {
      return redirect('/process');
    }
    return true;
  }
};
</script>
