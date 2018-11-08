<template>
  <div>
    <v-card-text>
      <v-form>
        <v-text-field prepend-icon="mdi-account" name="userid" label="Email" v-model="credentials.userid" type="email"></v-text-field>
        <v-text-field id="password" prepend-icon="mdi-lock" name="password" :label="$t('ui.password')" v-model="credentials.password" type="password"></v-text-field>
        <v-checkbox
          :label="$t('ui.rememberMe')"
          v-model="credentials.remember"
        ></v-checkbox>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="signin">{{ $t('ui.signin') }}</v-btn>
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
        remember: false
      }
    }
  },
  methods: {
    signin () {
      this.$store.dispatch('SIGNIN', this.credentials)
        .then(res => this.$router.push('/process'))
        .catch(err => {
          if (err.response.status !== 200) this.$store.dispatch('snacks/error', this.$i18n.t('ui.register.badeCredentials'))
        })
    }
  }
}
</script>

