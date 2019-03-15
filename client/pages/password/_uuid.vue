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
        <v-text-field
          v-model="credentials.password"
          prepend-icon="mdi-lock"
          name="userid"
          :label="$t('ui.pages.profile.newPassword')"
          type="password"
          required
        />
        <v-text-field
          id="password"
          v-model="credentials.password_repeat"
          prepend-icon="mdi-lock"
          name="password_repeat"
          :label="$t('ui.pages.profile.confirm')"
          type="password"
          required
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            type="submit"
            :disabled="samePassword === false"
          >
            {{ $t('ui.send') }}
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
      credentials: {
        password: null,
        password_repeat: null
      },
      samePassword: false
    };
  },
  watch: {
    credentials: {
      handler () {
        if (this.credentials.password === this.credentials.password_repeat) {
          this.samePassword = true;
        } else {
          this.samePassword = false;
        }
      },
      deep: true
    }
  },
  methods: {
    reset () {
      this.$store.dispatch('SEND_NEW_PASSWORD', { credentials: this.credentials, uuid: this.$route.params.uuid }).then(() => {
        this.$store.dispatch('snacks/success', this.$t('ui.pages.profile.passwordUpdated'));
        return this.$router.push('/');
      }).catch(err => {
        if (err) return this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t(`ui.errors.${err.response.data.message}`)}`);
        if (err.response.data.message === 'expiration_date') return this.$router.push('/');
        return this.$router.push('/');
      });
    }
  }
};
</script>
