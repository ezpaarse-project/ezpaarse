<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dark
      dense
      card
    >
      <v-toolbar-title>
        {{ $t('ui.drawer.feedback') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-layout
        row
        wrap
      >
        <v-flex
          v-if="feedback"
          xs12
          sm12
        >
          <v-alert
            :value="true"
            color="blue"
            v-html="$t('ui.pages.feedback.email')"
          />

          <v-text-field
            v-model="email"
            label="Email"
            type="email"
          />

          <v-textarea
            v-model="comment"
            label="Message"
          />

          <v-checkbox
            v-model="checkbox"
            label="Envoyer la version de mon navigateur"
          />

          <v-btn
            class="teal white--text"
            :disabled="!email && !comment"
            @click="sendFeedBack"
          >
            {{ $t('ui.send') }}
          </v-btn>
          <v-progress-circular
            v-if="feedBackSend"
            indeterminate
            color="teal"
          ></v-progress-circular>
        </v-flex>

        <v-flex
          v-else
          xs12
          sm12
        >
          <v-alert
            :value="true"
            color="blue"
            v-html="$t('ui.pages.feedback.unavailable')"
          />
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  auth: true,
  data () {
    return {
      email: null,
      comment: null,
      browser: null,
      checkbox: true,
      feedBackSend: false
    };
  },
  computed: {
    feedback () {
      return this.$store.state.feedback;
    }
  },
  methods: {
    sendFeedBack () {
      this.feedBackSend = true;
      // this.$store.dispatch('SEND_FEEDBACK', {
      //   email: this.email,
      //   comment: this.comment,
      //   browser: this.checkbox ? navigator.userAgent : null
      // }).then(() => {
      //   this.email = null;
      //   this.comment = null;
      //   this.checkbox = true;
      //   this.$store.dispatch('snacks/success', this.$t('ui.pages.feedback.hasSent'));
      //   this.feedBackSend = false;
      // }).catch(err => {
      //   this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotSendFeedback')}`);
      //   this.feedBackSend = false;
      // });
    }
  }
};
</script>
