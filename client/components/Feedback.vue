<template>
  <v-card>
    <v-toolbar class="secondary" dark dense flat>
      <v-toolbar-title>{{ $t('ui.drawer.feedback') }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text v-if="!recipient" v-text="$t('ui.pages.feedback.unavailable')" />

    <v-card-text v-else>
      <v-alert
        :value="recipient ? true : false"
        outlined
        type="info"
        class="mb-3"
        v-html="$t('ui.pages.feedback.emailWillBeSent', { recipient })"
      />

      <v-form ref="feedbackForm" v-model="formIsValid" @submit.prevent="sendFeedBack">
        <v-text-field
          v-model="email"
          :label="$t('ui.pages.feedback.email')"
          type="email"
          :disabled="$auth.loggedIn"
          :rules="[isRequired]"
        />

        <v-textarea
          v-model="comment"
          :label="$t('ui.pages.feedback.message')"
          :rules="[isRequired]"
        />

        <v-select
          v-model="jobID"
          :disabled="treatments.length === 0"
          :items="treatments"
          :item-text="textDate"
          item-value="jobId"
          clearable
          :label="$t('ui.pages.feedback.sendReport')"
        />

        <v-checkbox v-model="sendBrowser" :label="$t('ui.pages.feedback.sendBrowserVersion')" />

        <p class="text-center">
          <v-btn
            large
            color="primary"
            type="submit"
            :disabled="!formIsValid"
            :loading="sendingFeedback"
          >
            <v-icon left>
              mdi-send
            </v-icon>
            <span v-text="$t('ui.send')" />
          </v-btn>
        </p>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment';
import get from 'lodash.get';

export default {
  data () {
    return {
      formIsValid: false,
      email: this.$auth.user && this.$auth.user.username,
      comment: null,
      sendBrowser: true,
      sendingFeedback: false,
      jobID: null
    };
  },
  computed: {
    recipient () {
      return this.$store.state.feedback;
    },
    checkingFeedback () {
      return this.$store.state.checkingFeedback;
    },
    treatments () {
      return this.$store.state.process.treatments;
    }
  },
  methods: {
    isRequired (value) {
      return !!(value && value.trim()) || this.$t('ui.fieldRequired');
    },
    async sendFeedBack () {
      this.sendingFeedback = true;

      try {
        await this.$store.dispatch('SEND_FEEDBACK', {
          mail: (this.$auth && this.$auth.user) ? this.$auth.user.username : this.email,
          comment: this.comment,
          browser: this.sendBrowser ? navigator.userAgent : null,
          jobID: this.jobID
        });
      } catch (e) {
        let message = get(e, 'response.data.message');

        if (message !== 'reportDoesNotExist') {
          message = 'cannotSendFeedback';
        }

        this.$store.dispatch('snacks/error', `ui.errors.${message}`);
        this.sendingFeedback = false;
        return;
      }

      this.email = this.$auth.user && this.$auth.user.username;
      this.comment = null;
      this.sendBrowser = true;
      this.sendingFeedback = false;
      this.jobID = null;
      this.$refs.feedbackForm.resetValidation();
      this.$store.dispatch('snacks/success', 'ui.pages.feedback.hasBeenSent');
    },
    textDate (e) {
      const time = moment(e.createdAt).format(this.$i18n.locale === 'fr' ? 'DD MMM YYYY - HH:mm' : 'YYYY MMM DD - HH:mm');
      return `${this.$t('ui.pages.feedback.treatmentOf')} ${time}`;
    }
  }
};
</script>
