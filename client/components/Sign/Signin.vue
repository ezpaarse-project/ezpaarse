<template>
  <v-form
    method="post"
    @submit.prevent="signin"
  >
    <v-card-text>
      <v-text-field
        v-model="credentials.userid"
        prepend-icon="mdi-account"
        name="userid"
        label="Email"
        type="email"
      />
      <v-text-field
        id="password"
        v-model="credentials.password"
        prepend-icon="mdi-lock"
        name="password"
        :label="$t('ui.password')"
        type="password"
      />
      <v-checkbox
        v-model="credentials.remember"
        :label="$t('ui.rememberMe')"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        flat
        router
        :to="{ path: '/password' }"
        ripple
      >
        {{ $t('ui.passwordForgotten') }}
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        type="submit"
        :disabled="!credentials.userid || !credentials.password"
      >
        {{ $t('ui.signin') }}
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import get from 'lodash.get';

export default {
  data () {
    return {
      credentials: {
        userid: null,
        password: null,
        remember: false
      }
    };
  },
  methods: {
    signin () {
      return this.$auth.login({
        data: {
          userid: this.credentials.userid.trim(),
          password: this.credentials.password.trim(),
          remember: this.credentials.remember
        }
      }).then(() => {
        this.$store.dispatch('GET_APP_INFOS');
        this.$store.dispatch('LOAD_PKBS');
        this.$store.dispatch('LOAD_STATUS');
        this.$router.push('/process');
      }).catch(err => {
        const status = get(err, 'response.status', 500);

        if (status === 401) {
          this.$store.dispatch('snacks/error', 'ui.errors.badCredentials');
        } else {
          this.$store.dispatch('snacks/error', 'ui.errors.error');
        }
      });
    }
  }
};
</script>
