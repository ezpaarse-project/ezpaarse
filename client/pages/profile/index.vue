<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dark
      dense
      card
    >
      <v-toolbar-title>{{ $t('ui.pages.profile.title') }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-switch
        v-model="$auth.user.notifiate"
        :label="$t('ui.pages.profile.notifications')"
        @change="notifiate"
      />

      <v-divider />

      <v-layout
        row
        wrap
        mt-3
      >
        <h4>{{ $t('ui.pages.profile.updatePassword') }}</h4>
        <v-flex
          xs12
          sm12
        >
          <v-form>
            <v-layout
              row
              wrap
            >
              <v-flex
                xs4
                sm4
                pr-2
              >
                <v-text-field
                  v-model="oldPassword"
                  type="password"
                  :label="$t('ui.pages.profile.oldPassword')"
                />
              </v-flex>
              <v-flex
                xs4
                sm4
                pr-2
              >
                <v-text-field
                  v-model="newPassword"
                  type="password"
                  :label="$t('ui.pages.profile.newPassword')"
                />
              </v-flex>
              <v-flex
                xs4
                sm4
                pr-2
              >
                <v-text-field
                  v-model="confirm"
                  type="password"
                  :label="$t('ui.pages.profile.confirm')"
                  :append-outer-icon="(!oldPassword || !newPassword || !confirm) ? '' : 'mdi-send'"
                  @click:append-outer="updatePassword"
                />
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import get from 'lodash.get';

export default {
  auth: true,
  data () {
    return {
      oldPassword: null,
      newPassword: null,
      confirm: null
    };
  },
  methods: {
    async notifiate () {
      try {
        await this.$store.dispatch('NOTIFIATE', {
          user: {
            username: this.$auth.user.username
          },
          section: 'notifications',
          notifiate: this.$auth.user.notifiate
        });
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.cannotNotifiate');
      }
    },
    async updatePassword () {
      try {
        await this.$store.dispatch('UPDATE_PASSWORD', {
          user: {
            username: this.$auth.user.username
          },
          section: 'password',
          oldPassword: this.oldPassword.trim(),
          newPassword: this.newPassword.trim(),
          confirm: this.confirm.trim()
        });
      } catch (e) {
        const message = get(e, 'response.data.message', 'cannotUpdatePassword');
        this.$store.dispatch('snacks/error', `ui.errors.${message}`);
      }

      this.oldPassword = '';
      this.newPassword = '';
      this.confirm = '';
      this.$store.dispatch('snacks/success', 'ui.pages.profile.passwordUpdated');
    }
  }
};
</script>
