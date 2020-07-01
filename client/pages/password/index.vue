<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dark
      dense
      flat
    >
      <v-toolbar-title v-text="$t('ui.passwordForgotten')" />
    </v-toolbar>

    <v-card-text>
      <v-form method="post" @submit.prevent="reset">
        <v-card-text>
          <v-text-field
            v-model="userid"
            prepend-icon="mdi-account"
            name="userid"
            label="Email"
            type="email"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            type="submit"
            :disabled="!userid"
            v-text="$t('ui.reset')"
          />
          <v-btn
            color="error"
            router
            :to="{ path: '/' }"
            v-text="$t('ui.back')"
          />
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import get from 'lodash.get';

export default {
  auth: false,
  layout: 'sign',
  data () {
    return {
      userid: null
    };
  },
  fetch ({ app, redirect }) {
    if (app.$auth.user) {
      redirect('/process');
    }
  },
  methods: {
    async reset () {
      try {
        await this.$store.dispatch('RESET_PASSWORD', {
          username: this.userid,
          locale: this.$i18n.locale
        });
      } catch (e) {
        const message = get(e, 'response.data.message', 'cannotResetPassword');
        this.$store.dispatch('snacks/error', `ui.errors.${message}`);
        return;
      }

      this.$store.dispatch('snacks/success', 'ui.pages.profile.emailSent');
      this.$router.push('/');
    }
  }
};
</script>
