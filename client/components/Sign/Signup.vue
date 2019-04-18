<template>
  <v-form
    method="post"
    @submit.prevent="signup"
  >
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="credentials.userid"
          prepend-icon="mdi-account"
          name="email"
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
        <v-text-field
          id="confirmPassword"
          v-model="credentials.confirm"
          prepend-icon="mdi-lock"
          name="confirmPassword"
          :label="$t('ui.confirmPassword')"
          type="password"
        />
        <v-alert
          v-if="userNumber <= 0"
          :value="true"
          color="teal lighten-2"
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
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        type="submit"
        :disabled="!credentials.userid || !credentials.password
          || !credentials.confirm || credentials.password !== credentials.confirm"
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
      informTeam: true
    };
  },
  methods: {
    async signup () {
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
        return;
      }

      await this.$auth.loginWith('local', {
        data: {
          userid: this.credentials.userid.trim(),
          password: this.credentials.password.trim()
        }
      });

      this.$router.push('/process');
    }
  }
};
</script>
