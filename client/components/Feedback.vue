<template>
  <v-card>
    <v-toolbar class="secondary" dark dense card>
      <v-toolbar-title>{{ $t('ui.drawer.feedback') }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-layout row wrap>
        <v-flex v-if="feedback" xs12 sm12>
          <v-alert :value="true" color="blue" v-html="$t('ui.pages.feedback.email')" />

          <v-text-field
            v-if="$auth && $auth.user"
            label="Email"
            type="email"
            :value="$auth.user.username"
            disabled
          />

          <v-text-field v-else v-model="email" label="Email" type="email" />

          <v-textarea v-model="comment" label="Message" />

          <v-select
            v-if="treatments"
            v-model="jobID"
            :items="treatments"
            :item-text="textDate"
            item-value="jobId"
            :label="$t('ui.pages.feedback.treatments')"
          />

          <v-checkbox v-model="checkbox" label="Envoyer la version de mon navigateur" />

          <v-btn
            class="teal white--text"
            :disabled="($auth && $auth.user) ? !comment : (!comment && !email)"
            @click="sendFeedBack"
          >
            {{ $t('ui.send') }}
          </v-btn>
          <v-progress-circular v-if="feedBackSend" indeterminate color="teal" />
        </v-flex>

        <v-flex v-else xs12 sm12>
          <v-alert :value="true" color="blue" v-text="$t('ui.pages.feedback.unavailable')" />
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment';

export default {
  data () {
    return {
      email: null,
      comment: null,
      browser: null,
      checkbox: true,
      feedBackSend: false,
      jobID: null
    };
  },
  computed: {
    feedback () {
      return this.$store.state.feedback;
    },
    treatments () {
      return this.$store.state.process.treatments;
    }
  },
  methods: {
    sendFeedBack () {
      this.feedBackSend = true;
      this.$store.dispatch('SEND_FEEDBACK', {
        mail: (this.$auth && this.$auth.user) ? this.$auth.user.username : this.email,
        comment: this.comment,
        browser: this.checkbox ? navigator.userAgent : null,
        jobID: this.jobID
      }).then(() => {
        this.email = null;
        this.comment = null;
        this.checkbox = true;
        this.$store.dispatch('snacks/success', this.$t('ui.pages.feedback.hasSent'));
        this.feedBackSend = false;
      }).catch(err => {
        this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotSendFeedback')}`);
        this.feedBackSend = false;
      });
    },
    textDate (e) {
      const time = moment(e.createdAt).format(this.$i18n.locale === 'fr' ? 'DD MMM YYYY - HH:mm' : 'YYYY MMM DD - HH:mm');
      return `${this.$t('ui.pages.feedback.treatmentOf')} ${time}`;
    }
  }
};
</script>
