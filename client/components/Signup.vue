<template>
  <div>
    <v-card-text>
      <v-form>
        <v-text-field prepend-icon="mdi-account" name="email" label="Email" v-model="credentials.userid" type="email"></v-text-field>
        <v-text-field id="password" prepend-icon="mdi-lock" name="password" :label="$t('ui.password')" v-model="credentials.password" type="password"></v-text-field>
        <v-text-field id="confirmPassword" prepend-icon="mdi-lock" name="confirmPassword" :label="$t('ui.confirmPassword')" v-model="credentials.confirm" type="password"></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="signup">{{ $t('ui.signup') }}</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  data () {
    return {
      credentials: {
        userid: null,
        password: null,
        confirm: null
      }
    }
  },
  methods: {
    signup () {
      return this.$store.dispatch('REGISTER', this.credentials).catch(err => {
        this.$store.dispatch('snacks/info', this.$i18n.t(`ui.register.${err.response.data.message}`))
      })
    }
  }
}
</script>
