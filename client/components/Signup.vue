<template>
  <v-form @submit.prevent="signup" method="post">
    <v-card-text>
      <v-form>
        <v-text-field
          prepend-icon="mdi-account"
          name="email"
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
        <v-text-field
          id="confirmPassword"
          prepend-icon="mdi-lock"
          name="confirmPassword"
          :label="$t('ui.confirmPassword')"
          v-model="credentials.confirm"
          type="password"
        ></v-text-field>
        <v-alert
          v-if="userNumber <= 0"
          :value="true"
          color="teal lighten-2"
          outline
        >
          <v-checkbox
            :label="$t('ui.informTeam')"
            v-model="informTeam"
          ></v-checkbox>
          <p class="text-xs-justify" v-html="$t('ui.informTeamWarning', { recipients: 'ezpaarse@couperin.org' })"></p>
        </v-alert>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" type="submit" :disabled="!credentials.userid || !credentials.password || !credentials.confirm || credentials.password !== credentials.confirm">{{ $t('ui.signup') }}</v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
export default {
  props: ['userNumber'],
  data () {
    return {
      credentials: {
        userid: null,
        password: null,
        confirm: null
      },
      informTeam: true
    }
  },
  methods: {
    signup () {
      if (this.userNumber <= 0 && this.informTeam) {
        this.$store.dispatch('FRESHINSTALL', { mail: this.credentials.userid.trim() })
      }
      return this.$store.dispatch('REGISTER', {
        userid: this.credentials.userid.trim(),
        password: this.credentials.password.trim(),
        confirm: this.credentials.confirm.trim()
      }).then(res => {
        return this.$auth.loginWith('local', {
          data: {
            userid: this.credentials.userid.trim(),
            password: this.credentials.password.trim(),
          }
        })
      }).catch(err => {
        this.$store.dispatch('snacks/info', err.response.data.message ? this.$t(`ui.errors.${err.response.data.message}`) : this.$t(`ui.errors.error`))
      })
    }
  }
}
</script>
