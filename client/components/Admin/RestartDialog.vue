<template>
  <v-dialog :value="value" max-width="600px" @input="updateVisible($event)">
    <v-card>
      <v-card-title class="headline">
        {{ $t('ui.pages.admin.restart.title') }}
      </v-card-title>
      <v-card-text>
        <div class="mt-4" v-text="$t('ui.pages.admin.restart.message')" />
        <v-alert
          :value="hasJobs"
          type="info"
          class="mt-4"
        >
          <div v-text="$t('ui.pages.admin.updates.restartAlert')" />
          <v-row align="center">
            <v-checkbox
              v-model="force"
            />
            {{ $t('ui.pages.admin.updates.force') }}
          </v-row>
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click.stop="updateVisible(false)">
          {{ $t("ui.no") }}
        </v-btn>
        <v-btn
          text
          :loading="loading"
          :disabled="hasJobs && !force"
          color="primary"
          @click="restart()"
        >
          {{ $t("ui.yes") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'RestartDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      force: false,
      hasJobs: false
    };
  },
  methods: {
    updateVisible (visible) {
      this.$emit('input', visible);
    },
    async restart () {
      this.loading = true;
      try {
        await this.$store.dispatch('RESTART', this.force);
      } catch (err) {
        if (err?.response?.status === 409) {
          this.hasJobs = true;
          this.loading = false;
          return;
        }
        this.$store.dispatch('snacks/error', 'ui.errors.cannotRestart');
        this.loading = false;
        return;
      }
      this.loading = false;
      this.updateVisible(false);
    }
  }
};
</script>
