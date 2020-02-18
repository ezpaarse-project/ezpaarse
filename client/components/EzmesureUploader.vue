<template>
  <v-dialog
    max-width="600"
    :value="visible"
    :persistent="uploading"
    @input="setVisibility"
  >
    <v-form ref="saveForm" v-model="isValid" @submit.prevent="uploadToEzMesure">
      <v-card>
        <v-card-title class="title primary white--text">
          <span v-if="result">{{ $t('ui.ezmesure.fileLoaded') }}</span>
          <span v-else>{{ $t('ui.ezmesure.loadIntoEzmesure') }}</span>
        </v-card-title>

        <v-fade-transition mode="out-in">
          <v-card-text v-if="result" key="result">
            <Metric
              v-for="metric in metrics" :key="metric.label"
              :label="$t(`ui.ezmesure.metrics.${metric.label}`)"
              :value="metric.count"
              :icon="metric.icon"
              :color="metric.color"
              class="ma-2"
            />

            <v-card v-if="errors.length > 0" class="ma-2">
              <v-card-title class="subheading">
                {{ $t('ui.ezmesure.errorsFound') }}
                <v-spacer />
                <v-icon color="error">
                  mdi-alert-circle
                </v-icon>
              </v-card-title>
              <v-card-text>
                <ul>
                  <li v-for="(e, index) in errors" :key="index" v-text="e" />
                </ul>
              </v-card-text>
            </v-card>
          </v-card-text>

          <v-card-text v-else key="form">
            <v-alert outlined color="error" :value="error">
              <span v-if="errorMessage">{{ errorMessage }}</span>
              <span v-else>{{ $t('ui.errors.error') }}</span>
            </v-alert>

            <v-switch
              v-model="preprod"
              :label="$t('ui.ezmesure.toPreprod')"
              :disabled="uploading"
            />
            <v-text-field
              v-model="indice"
              prepend-inner-icon="mdi-database"
              :label="$t('ui.ezmesure.indice')"
              :disabled="uploading"
              outlined
              required
            />
            <v-text-field
              v-model="token"
              prepend-inner-icon="mdi-lock"
              :label="$t('ui.ezmesure.token')"
              :disabled="uploading"
              :type="showToken ? 'text' : 'password'"
              outlined
              required
              :append-icon="showToken ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showToken = !showToken"
            />

            <div
              class="caption text-xs-right"
              v-html="$t('ui.ezmesure.findYourToken', { url: tokenUrl })"
            />
          </v-card-text>
        </v-fade-transition>

        <v-divider />

        <v-card-actions>
          <v-scale-transition origin="center center">
            <v-btn
              v-if="result"
              text
              @click="result = null"
            >
              {{ $t('ui.back') }}
            </v-btn>
          </v-scale-transition>

          <v-spacer />

          <v-btn
            text
            @click="setVisibility(false)"
          >
            {{ $t('ui.close') }}
          </v-btn>

          <v-scale-transition origin="center center">
            <v-btn
              v-if="!result"
              color="primary"
              type="submit"
              :loading="uploading"
              :disabled="!isValid"
            >
              {{ $t('ui.ezmesure.load') }}
            </v-btn>
          </v-scale-transition>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import Metric from '~/components/Metric';
import get from 'lodash.get';

export default {
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    jobId: {
      type: String,
      default: () => ''
    }
  },
  components: {
    Metric
  },
  watch: {
    visible () {
      this.$refs.saveForm.resetValidation();
      this.indice = '';
      this.token = '';
      this.preprod = false;
      this.result = null;
      this.error = null;
      this.errorMessage = null;
    }
  },
  data () {
    return {
      uploading: false,
      isValid: true,
      preprod: false,
      showToken: false,
      indice: '',
      token: '',
      result: null,
      error: null,
      errorMessage: null
    };
  },

  computed: {
    tokenUrl () {
      return `https://${this.preprod ? 'ezmesure-preprod' : 'ezmesure'}.couperin.org/myspace#tab-token`;
    },
    errors () {
      if (this.result && Array.isArray(this.result.errors)) {
        return this.result.errors;
      }
      return [];
    },
    metrics () {
      const result = this.result || {};
      const total = result.total || 0;

      return [
        {
          label: 'inserted',
          color: 'green',
          icon: 'mdi-file-download-outline',
          count: result.inserted || 0,
          percent: Math.floor((result.inserted || 0) / total)
        },
        {
          label: 'updated',
          color: 'blue',
          icon: 'mdi-refresh',
          count: result.updated || 0,
          percent: Math.floor((result.updated || 0) / total)
        },
        {
          label: 'failed',
          color: 'red',
          icon: 'mdi-cancel',
          count: result.failed || 0,
          percent: Math.floor((result.failed || 0) / total)
        }
      ];
    }
  },

  methods: {
    setVisibility (value) {
      this.$emit('update:visible', value);
    },
    validateForm () {
      this.$refs.saveForm.validate();
    },
    async uploadToEzMesure () {
      this.uploading = true;
      this.error = null;
      this.errorMessage = null;
      this.result = null;

      try {
        this.result = await this.$store.dispatch('process/UPLOAD_TO_EZMESURE', {
          jobId: this.jobId,
          data: {
            indice: this.indice,
            options: {
              token: this.token,
              baseUrl: this.preprod ? 'https://ezmesure-preprod.couperin.org/api' : undefined
            }
          }
        });
      } catch (e) {
        this.error = e;
        this.errorMessage = get(e, 'response.data.message');
      }

      this.uploading = false;
    }
  }
};
</script>
