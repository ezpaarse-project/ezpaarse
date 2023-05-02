<template>
  <v-dialog :value="value" max-width="600px" @input="updateVisible($event)">
    <v-card>
      <v-toolbar color="primary" dark>
        <span class="mr-2" v-text="$t('ui.pages.admin.restart.title')" />
      </v-toolbar>
      <v-card-text>
        <div class="pa-12" v-text="$t('ui.pages.admin.restart.message')" />
        <v-alert
          :value="hasJob"
          type="info"
        >
          <div v-text="$t('ui.pages.admin.updates.restartAlert')" />
          <v-checkbox
            v-model="force"
            :label="`Forcer le redémarrage`"
          />
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-btn text class="red--text" @click.stop="updateVisible(false)">
          {{ $t("ui.no") }}
        </v-btn>
        <v-spacer />
        <v-btn
          text
          :loading="loading"
          :disabled="hasJob && !force"
          class="green--text"
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
      isInJob: false
    };
  },
  methods: {
    updateVisible (visible) {
      this.$emit('input', visible);
    },
    async restart () {
      await this.$store.dispatch('RESTART');
    }
  },
  computed: {
    hasJob () {
      return this.jobStatus !== null;
    },
    jobStatus () {
      return this.$store.state.process.status;
    }
  }
};
</script>
