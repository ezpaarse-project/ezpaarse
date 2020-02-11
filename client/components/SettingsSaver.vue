<template>
  <v-dialog
    max-width="600"
    :value="visible"
    @input="setVisibility"
  >
    <v-form ref="saveForm" v-model="isValid" @submit.prevent="saveCustomSettings">
      <v-card>
        <v-card-title v-if="importSetting" class="headline">
          {{ $t('ui.pages.process.settings.importPredefinedSettings') }}
        </v-card-title>
        <v-card-title v-else class="headline">
          {{ $t('ui.pages.process.settings.savePredefinedSettings') }}
        </v-card-title>
        <v-card-text>
          <p v-if="importSetting">
            <input ref="upload" type="file" name="upload" @change="uploadSetting">
          </p>
          <v-switch
            v-show="!settings.predefined && settings.id"
            v-model="saveAsNew"
            :label="$t('ui.pages.process.settings.saveAsNew')"
            @change="validateForm"
          />
          <v-text-field
            v-model="fullName"
            :label="$t('ui.name')"
            box
            required
            :rules="[fullNameRequired, nameIsAvailable]"
          />
          <v-text-field
            v-model="id"
            :label="$t('ui.identifier')"
            box
            required
            :rules="[identifierRequired, identifierIsAvailable]"
          />
          <v-autocomplete
            v-model="country"
            :items="countries"
            item-text="name"
            item-value="alpha2"
            :label="$t('ui.country')"
            box
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            @click="setVisibility(false)"
          >
            {{ $t('ui.close') }}
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="saving"
            :disabled="!isValid"
          >
            {{ $t('ui.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import get from 'lodash.get';
import i18nIsoCode from 'i18n-iso-countries';

export default {
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    importSetting: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    visible (value) {
      if (value) {
        this.$refs.saveForm.resetValidation();
        this.fullName = this.settings.fullName || '';
        this.id = this.settings.id || '';
        this.country = this.settings.country || 'FR';
        this.saveAsNew = this.settings.predefined || !this.settings.id;
      }
    }
  },
  data () {
    return {
      saveAsNew: true,
      saving: false,
      isValid: true,
      fullName: '',
      id: '',
      country: ''
    };
  },

  computed: {
    settings () { return this.$store.state.settings.settings || {}; },
    countries () {
      const alpha2Countries = Object.entries(i18nIsoCode.getNames(this.$i18n.locale));
      return alpha2Countries.map(([alpha2, name]) => ({ name, alpha2 }));
    }
  },

  methods: {
    setVisibility (value) {
      this.$emit('update:visible', value);
    },
    fullNameRequired (value) {
      return !!(value && value.trim()) || this.$t('ui.pages.process.settings.fullNameRequired');
    },
    identifierRequired (value) {
      return !!(value && value.trim()) || this.$t('ui.pages.process.settings.identifierRequired');
    },
    nameIsAvailable (value) {
      const fullName = (value || '').trim().toLowerCase();
      const allSettings = this.$store.getters['settings/allSettings'];
      const matchingSetting = allSettings.find(s => (s.fullName || '').toLowerCase() === fullName);

      if (!matchingSetting) {
        return true;
      }

      if (matchingSetting.id === this.settings.id) {
        return !this.saveAsNew || this.$t('ui.pages.process.settings.nameUnavailable');
      }

      return this.$t('ui.pages.process.settings.nameUnavailable');
    },

    identifierIsAvailable (value) {
      const id = (value || '').trim();
      const allSettings = this.$store.getters['settings/allSettings'];
      const matchingSetting = allSettings.find(s => s.id === id);

      if (!matchingSetting) {
        return true;
      }

      if (matchingSetting.id === this.settings.id) {
        return !this.saveAsNew || this.$t('ui.pages.process.settings.identifierUnavailable');
      }

      return this.$t('ui.pages.process.settings.identifierUnavailable');
    },

    validateForm () {
      this.$refs.saveForm.validate();
    },

    async saveCustomSettings () {
      this.saving = true;

      const newSettings = JSON.parse(JSON.stringify(this.settings));
      newSettings.predefined = undefined;
      newSettings.fullName = this.fullName;
      newSettings.id = this.id;
      newSettings.country = this.country;

      try {
        if (!newSettings.predefined && newSettings.id && !this.saveAsNew) {
          await this.$store.dispatch('settings/UPDATE_CUSTOM_PREDEFINED_SETTINGS', newSettings);
        } else {
          await this.$store.dispatch('settings/SAVE_CUSTOM_PREDEFINED_SETTINGS', newSettings);
        }
      } catch (err) {
        this.$store.dispatch('snacks/error', 'ui.errors.errorSavePredefinedSettings');
        this.saving = false;
        return;
      }

      try {
        await this.$store.dispatch('settings/GET_PREDEFINED_SETTINGS');
        await this.$store.dispatch('settings/APPLY_PREDEFINED_SETTINGS', newSettings.id);
      } catch (err) {
        const message = get(err, 'response.data.message', 'cannotLoadPredefinedSettings');
        this.$store.dispatch('snacks/error', `ui.errors.${message}`);
        this.saving = false;
        return;
      }

      this.saving = false;
      this.setVisibility(false);
      this.$refs.saveForm.reset();
      this.$store.dispatch('snacks/success', 'ui.pages.process.settings.paramsSaved');
    },

    uploadSetting () {
      const file = this.$refs.upload.files[0];
      if (!file || file.type !== 'application/json') return;

      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (evt) => {
        let setting;
        try {
          setting = JSON.parse(evt.target.result);
          this.id = setting.id;
          this.fullName = setting.fullName;
          this.country = setting.country;
          this.saveAsNew = true;
          this.$store.dispatch('settings/testUploadFile', setting);
        } catch (err) {
          return this.$store.dispatch('snacks/error', 'ui.errors.cannotLoadPredefinedSettings');
        }
        return setting;
      };
      reader.onerror = () => this.$store.dispatch('snacks/error', 'ui.errors.cannotLoadPredefinedSettings');
    }
  }
};
</script>
