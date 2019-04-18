<template>
  <v-snackbar
    v-if="currentMessage"
    v-model="visible"
    bottom
    right
    :color="currentMessage.color"
    :timeout="currentMessage.timeout"
  >
    <span v-if="$te(currentMessage.text)">
      {{ $t(currentMessage.text) }}
    </span>
    <span v-else>
      {{ $t('ui.errors.error') }}
    </span>
    <v-btn
      dark
      flat
      @click.native="visible = false"
    >
      {{ $t('ui.close') }}
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data () {
    return {
      visible: false
    };
  },
  watch: {
    messages: {
      immediate: true,
      handler () {
        if (!this.visible && this.messages.length) {
          this.visible = true;
        }
      }
    },
    async visible () {
      if (this.visible || !this.messages.length) { return; }

      await this.$nextTick();

      // wait for the closing animation to finish
      setTimeout(() => {
        this.shiftMessages();
        this.visible = true;
      }, 500);
    }
  },
  computed: {
    ...mapState('snacks', ['messages']),
    currentMessage () {
      return this.messages[0];
    }
  },
  methods: {
    ...mapActions('snacks', ['shiftMessages'])
  }
};
</script>
