<template>
  <Feedback />
</template>

<script>
import Feedback from '~/components/Feedback';

export default {
  components: {
    Feedback
  },
  async fetch ({ store, app }) {
    try {
      if (app.$auth.user) {
        await store.dispatch('process/GET_TREATMENTS_BY_USER', app.$auth.user.username);
      }
    } catch (err) {
      this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotLoadJobsData')}`);
    }
  }
};
</script>
