<template>
  <v-form v-model="validForm" @submit.prevent="signin">
    <v-card-text>
      <v-text-field
        v-model="credentials.userid"
        prepend-icon="mdi-account"
        name="userid"
        label="Email"
        type="email"
        :rules="[isRequired]"
      />
      <v-text-field
        id="password"
        v-model="credentials.password"
        prepend-icon="mdi-lock"
        name="password"
        :label="$t('ui.password')"
        type="password"
        :rules="[isRequired]"
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
        :loading="loading"
        :disabled="!validForm"
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
      loading: false,
      validForm: true,
      credentials: {
        userid: '',
        password: '',
        remember: false
      }
    };
  },
  methods: {
    isRequired (value) {
      return !!(value && value.trim()) || this.$t('ui.fieldRequired');
    },
    async signin () {
      this.loading = true;

      try {
        await this.$auth.login({
          data: {
            userid: this.credentials.userid.trim(),
            password: this.credentials.password.trim(),
            remember: this.credentials.remember
          }
        });
      } catch (e) {
        const status = get(e, 'response.status', 500);

        if (status === 400 || status === 401) {
          this.$store.dispatch('snacks/error', 'ui.errors.badCredentials');
        } else {
          this.$store.dispatch('snacks/error', 'ui.errors.error');
        }
        this.loading = false;
        return;
      }

      this.$router.push('/process');
      this.loading = false;
    }
  }
};
</script>
