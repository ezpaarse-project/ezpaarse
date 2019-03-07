<template>
  <v-card>
    <v-toolbar class="secondary" dark dense card>
      <v-toolbar-title>{{ $t('ui.passwordForgotten') }}</v-toolbar-title>
    </v-toolbar>
    
    <v-card-text>
      <v-form @submit.prevent="reset" method="post">
        <v-card-text>
          <v-text-field
            prepend-icon="mdi-account"
            name="userid"
            label="Email"
            v-model="userid"
            type="email"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" :disabled="!userid">{{ $t('ui.reset') }}</v-btn>
          <v-btn color="error" router :to="{ path: '/' }">{{ $t('ui.back') }}</v-btn>
        </v-card-actions>
      </v-form>
     </v-card-text>
  </v-card>
</template>

<script>
export default {
  auth: false,
  layout: "sign",
  data() {
    return {
      userid: null
    }
  },
  fetch ({ app, redirect }) {
    if (app.$auth.user) return redirect('/process');
  },
  methods: {
    reset () {
      this.$store.dispatch('RESET_PASSWORD', { username: this.userid, locale: this.$i18n.locale })
      .then(res => {
        this.$store.dispatch('snacks/success', this.$t(`ui.pages.profile.emailSent`));
        return this.$router.push('/');
      })
      .catch(err => {
        if (err) this.$store.dispatch('snacks/error', this.$t(`ui.errors.500`));
      });
    }
  }
}
</script>
