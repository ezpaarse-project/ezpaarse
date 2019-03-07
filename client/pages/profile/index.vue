<template>
  <v-card>
    <v-toolbar class="secondary" dark dense card>
      <v-toolbar-title>{{ $t('ui.pages.profile.title') }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-switch
        @change="notifiate"
        :label="$t('ui.pages.profile.notifications')"
        v-model="$auth.user.notifiate"
      ></v-switch>

      <v-divider></v-divider>

      <v-layout row wrap mt-3>
        <h4>{{ $t('ui.pages.profile.updatePassword') }}</h4>
        <v-flex xs12 sm12>
          <v-form>
            <v-layout row wrap>
              <v-flex xs4 sm4 pr-2>
                <v-text-field
                  v-model="oldPassword"
                  type="password"
                  :label="$t('ui.pages.profile.oldPassword')"
                ></v-text-field>
              </v-flex>
              <v-flex xs4 sm4 pr-2>
                <v-text-field
                  v-model="newPassword"
                  type="password"
                  :label="$t('ui.pages.profile.newPassword')"
                ></v-text-field>
              </v-flex>
              <v-flex xs4 sm4 pr-2>
                <v-text-field
                  v-model="confirm"
                  type="password"
                  :label="$t('ui.pages.profile.confirm')"
                  :append-outer-icon="(!oldPassword || !newPassword || !confirm) ? '' : 'mdi-send'"
                  @click:append-outer="updatePassword"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  auth: true,
  data () {
    return {
      oldPassword: null,
      newPassword: null,
      confirm: null
    }
  },
  methods: {
    notifiate () {
      this.$store.dispatch('NOTIFIATE', {
        user: {
          username: this.user.username
        },
        section: 'notifications',
        notifiate: this.user.notifiate
      }).catch(err => {
        this.$store.dispatch('snacks/info', this.$t(`ui.errors.${err.response.data.message}`))
      })
    },
    updatePassword () {
      this.$store.dispatch('UPDATE_PASSWORD', {
        user: {
          username: this.user.username
        },
        section: 'password',
        oldPassword: this.oldPassword.trim(),
        newPassword: this.newPassword.trim(),
        confirm: this.confirm.trim()
      }).then(res => {
        this.oldPassword = ''
        this.newPassword = ''
        this.confirm = ''
        this.$store.dispatch('snacks/success', this.$t(`ui.pages.profile.passwordUpdated`))
      }).catch(err => {
        console.log(err.response.status)
        if (!err.response.data.message) {
          this.$store.dispatch('snacks/info', this.$t('ui.errors.error'))
        } else {
          this.$store.dispatch('snacks/info', this.$t(`ui.errors.${err.response.data.message}`))
        }
      })
    }
  }
}
</script>
