<template>
  <v-form v-model="validForm" @submit.prevent="signup">
    <v-card-text>
      <v-text-field
        v-model="credentials.userid"
        prepend-icon="mdi-account"
        label="Email"
        type="email"
        :rules="[isRequired]"
      />
      <v-text-field
        id="password"
        v-model="credentials.password"
        prepend-icon="mdi-lock"
        :label="$t('ui.password')"
        type="password"
        :rules="[isRequired]"
      />
      <v-text-field
        id="confirmPassword"
        v-model="credentials.confirm"
        prepend-icon="mdi-lock"
        :label="$t('ui.confirmPassword')"
        type="password"
        :rules="[isRequired, matchesPassword]"
      />
      <v-alert
        :value="userNumber === 0"
        color="primary"
        outline
      >
        <v-checkbox
          v-model="informTeam"
          :label="$t('ui.informTeam')"
        />
        <p
          class="text-xs-justify"
          v-html="$t('ui.informTeamWarning', { recipients: 'ezpaarse@couperin.org' })"
        />
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        type="submit"
        :loading="loading"
        :disabled="!validForm"
      >
        {{ $t('ui.signup') }}
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import get from 'lodash.get';

export default {
  props: {
    userNumber: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      credentials: {
        userid: null,
        password: null,
        confirm: null
      },
      informTeam: true,
      validForm: true,
      loading: false
    };
  },
  methods: {
    isRequired (value) {
      return !!(value && value.trim()) || this.$t('ui.fieldRequired');
    },
    matchesPassword (value) {
      return (value === this.credentials.password) || this.$t('ui.errors.passwordDoesNotMatch');
    },
    async signup () {
      this.loading = true;

      if (this.userNumber <= 0 && this.informTeam) {
        this.$store.dispatch('FRESHINSTALL', { mail: this.credentials.userid.trim() });
      }

      try {
        await this.$store.dispatch('REGISTER', {
          userid: this.credentials.userid.trim(),
          password: this.credentials.password.trim(),
          confirm: this.credentials.confirm.trim()
        });
      } catch (e) {
        const message = get(e, 'response.data.message', 'cannotRegister');
        this.$store.dispatch('snacks/error', `ui.errors.${message}`);
        this.loading = false;
        return;
      }

      await this.$auth.loginWith('local', {
        data: {
          userid: this.credentials.userid.trim(),
          password: this.credentials.password.trim()
        }
      });

      this.$router.push('/process');
      this.loading = false;
    }
  }
};
</script>
