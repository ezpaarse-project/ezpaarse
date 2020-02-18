<template>
  <v-card>
    <v-toolbar class="secondary" dark dense flat>
      <v-toolbar-title v-text="$t('ui.pages.profile.title')" />
    </v-toolbar>

    <v-card-text>
      <v-switch
        v-model="isNotifiate"
        :label="$t('ui.pages.profile.notifications')"
        @change="notifiate"
      />

      <v-divider />

      <v-container>
        <v-layout row wrap mt-3>
          <h4 v-text="$t('ui.pages.profile.updatePassword')" />
          <v-flex xs12 sm12>
            <v-form>
              <v-layout row wrap>
                <v-flex xs4 sm4 px-3>
                  <v-text-field
                    v-model="oldPassword"
                    type="password"
                    :label="$t('ui.pages.profile.oldPassword')"
                  />
                </v-flex>
                <v-flex xs4 sm4 px-3>
                  <v-text-field
                    v-model="newPassword"
                    type="password"
                    :label="$t('ui.pages.profile.newPassword')"
                  />
                </v-flex>
                <v-flex xs4 sm4 px-3>
                  <v-text-field
                    v-model="confirm"
                    type="password"
                    :label="$t('ui.pages.profile.confirm')"
                    :append-outer-icon="!isValid ? '' : 'mdi-send'"
                    @click:append-outer="updatePassword"
                  />
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue';
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
  computed: {
    isValid () {
      return (this.oldPassword && this.newPassword && this.confirm);
    },
    isNotifiate: {
      get () { return this.$auth.user.notifiate; },
      set (newVal) {
        const user = JSON.parse(JSON.stringify(this.$auth.user));
        user.notifiate = newVal;
        this.$auth.$storage.setState('user', user);
      }
    }
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
