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
          <v-btn color="primary" type="submit">{{ $t('ui.reset') }}</v-btn>
          <v-btn color="error" router :to="{ path: '/' }">{{ $t('ui.back') }}</v-btn>
        </v-card-actions>
      </v-form>
     </v-card-text>
  </v-card>
</template>

<script>
export default {
  auth: true,
  layout: "sign",
  data() {
    return {
      userid: null
    }
  },
  methods: {
    reset () {
      this.$store.dispatch('RESET_PASSWORD', this.userid)
      .then(res => this.$router.push('/'))
      .catch(err => {
        console.log(err.response)
        if (err.response.status !== 200) this.$store.dispatch('snacks/error', this.$t(`ui.errors.invalid_address`))
      })
    }
  }
}
</script>
