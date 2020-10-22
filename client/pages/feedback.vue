<template>
  <Feedback />
</template>

<script>
import Feedback from '~/components/Feedback.vue';

export default {
  components: {
    Feedback
  },
  async fetch ({ store, app }) {
    try {
      if (app.$auth.user) {
        await store.dispatch('process/GET_TREATMENTS_BY_USER', app.$auth.user.username);
      }
    } catch (e) {
      store.dispatch('snacks/error', 'ui.errors.cannotLoadJobsData');
    }

    try {
      await store.dispatch('GET_FEEDBACK_STATUS');
    } catch (e) { }
  }
};
</script>
