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
          v-model="credentials.passwordConfirm"
          prepend-icon="mdi-lock"
          name="passwordConfirm"
          :label="$t('ui.pages.profile.confirm')"
          type="password"
          required
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            type="submit"
            :disabled="!samePassword"
          >
            {{ $t('ui.send') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import get from 'lodash.get';

export default {
  auth: false,
  layout: 'sign',
  data () {
    return {
      credentials: {
        password: null,
        passwordConfirm: null
      }
    };
  },
  computed: {
    samePassword () {
      return this.credentials.password === this.credentials.passwordConfirm;
    }
  },
  methods: {
    async reset () {
      try {
        await this.$store.dispatch('SEND_NEW_PASSWORD', {
          credentials: this.credentials,
          uuid: this.$route.params.uuid
        });
      } catch (e) {
        const message = get(e, 'response.data.message', 'error');
        this.$store.dispatch('snacks/error', `ui.errors.${message}`);
        if (message === 'expirationDate') {
          this.$router.push('/');
        }
        return;
      }

      this.$store.dispatch('snacks/success', 'ui.pages.profile.passwordUpdated');
      this.$router.push('/');
    }
  }
};
</script>
