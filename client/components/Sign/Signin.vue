<template>
  <v-form @submit.prevent="signin" method="post">
    <v-card-text>
      <v-text-field
        prepend-icon="mdi-account"
        name="userid"
        label="Email"
        v-model="credentials.userid"
        type="email"
      ></v-text-field>
      <v-text-field
        id="password"
        prepend-icon="mdi-lock"
        name="password"
        :label="$t('ui.password')"
        v-model="credentials.password"
        type="password"
      ></v-text-field>
      <v-checkbox :label="$t('ui.rememberMe')" v-model="credentials.remember"></v-checkbox>
    </v-card-text>
    <v-card-actions>
      <v-btn flat router :to="{ path: '/password' }" ripple>{{ $t('ui.passwordForgotten') }}</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" type="submit" :disabled="!credentials.userid || !credentials.password">{{ $t('ui.signin') }}</v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
export default {
  data () {
    return {
      credentials: {
        userid: null,
        password: null,
        remember: false
      }
    }
  },
  methods: {
    signin () {
      return this.$auth.login({
        data: {
          userid: this.credentials.userid.trim(),
          password: this.credentials.password.trim(),
          remember: this.credentials.remember
        }
      }).then(re => {
        this.$store.dispatch('GET_APP_VERSION')
        this.$store.dispatch('LOAD_PKBS')
        this.$store.dispatch('LOAD_STATUS')
      }).catch(err => {
        if (err.response.status !== 200) this.$store.dispatch('snacks/error', this.$t('ui.errors.bad_credentials'))
      })
    }
  }
}
</script>

