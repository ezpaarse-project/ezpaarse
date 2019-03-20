<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dark
      dense
      card
    >
      <v-toolbar-title>{{ $t('ui.passwordForgotten') }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-form
        method="post"
        @submit.prevent="reset"
      >
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
          >
            {{ $t('ui.reset') }}
          </v-btn>
          <v-btn
            color="error"
            router
            :to="{ path: '/' }"
          >
            {{ $t('ui.back') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  auth: false,
  layout: 'sign',
  data () {
    return {
      userid: null
    };
  },
  fetch ({ app, redirect }) {
    if (app.$auth.user) return redirect('/process');
    return true;
  },
  methods: {
    reset () {
      this.$store.dispatch('RESET_PASSWORD', { username: this.userid, locale: this.$i18n.locale })
        .then(() => {
          this.$store.dispatch('snacks/success', this.$t('ui.pages.profile.emailSent'));
          return this.$router.push('/');
        })
        .catch(err => {
          if (err && err.response && err.response.message) {
            return this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t(`ui.errors.${err.response.message}`)}`);
          }
          return this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotResetPassword')}`);
        });
    }
  }
};
</script>
