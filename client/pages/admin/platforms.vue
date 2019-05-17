<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dense
      dark
      card
    >
      <v-toolbar-title>
        {{ $t('ui.pages.admin.platforms.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-alert
        :value="platforms.hasLocalChanges"
        type="error"
        v-text="$t('ui.pages.admin.updates.repoLocalChanges', { repo: 'platforms' })"
      />

      <v-layout align-center :column="this.$vuetify.breakpoint.smAndDown">
        <div class="subheading">
          {{ $t('ui.currentVersion') }} :

          <v-chip
            v-if="platforms.current"
            :color="platforms.isOutdated ? 'error' : 'success'"
            dark
            small
          >
            <v-avatar>
              <v-icon>
                {{ platforms.isOutdated ? 'mdi-alert-circle' : 'mdi-check-circle' }}
              </v-icon>
            </v-avatar>
            {{ platforms.current }}
          </v-chip>
        </div>

        <v-spacer />

        <v-btn
          small
          :disabled="!platforms.isOutdated"
          color="accent"
          :loading="updating"
          @click="updatePlatforms"
        >
          <v-icon left>
            mdi-download
          </v-icon>
          {{ $t('ui.update') }}
        </v-btn>
      </v-layout>
    </v-card-text>

    <v-card-text>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        :label="$t('ui.search')"
        solo
      />
    </v-card-text>

    <v-data-table
      :headers="headers"
      :items="platformsItems"
      :no-data-text="$t('ui.pages.admin.platforms.noPlatforms')"
      :no-results-text="$t('ui.pages.admin.platforms.noPlatformFound')"
      :rows-per-page-text="$t('ui.pages.admin.platforms.platformsPerPage')"
      :rows-per-page-items="rowsPerPage"
      :search="search"
      :pagination.sync="pagination"
    >
      <template v-slot:items="{ item }">
        <td>
          <v-icon
            v-if="item['pkb-packages'].length > 0"
            @click="selectedPlatform = item; pkbDialog = true"
          >
            mdi-file-document
          </v-icon>
        </td>

        <td>
          <a
            :href="item.docurl"
            target="_blank"
          >
            {{ item.longname }}
          </a>
        </td>

        <td>
          <span
            v-for="(certification, k) in item.certifications"
            :key="k"
            class="mr-1"
          >
            <a
              href="https://blog.ezpaarse.org/2017/06/certification-h-et-p-des-plateformes-traitees-dans-ezpaarse/"
              target="_blank"
            >
              <img
                :src="`/img/certifications/${certification}.png`"
                :alt="`Certification ${certification}`"
                width="25"
              >
            </a>
          </span>
        </td>

        <td class="text-xs-center">
          <v-icon v-if="platformsChanged[item.name]" color="info">
            mdi-arrow-up-bold-circle
          </v-icon>
        </td>
      </template>
    </v-data-table>

    <v-dialog
      v-model="pkbDialog"
      width="600"
    >
      <v-card>
        <v-card-title class="title primary white--text">
          {{ selectedPlatform.longname }}
        </v-card-title>

        <v-divider />

        <v-data-table
          :headers="pkbsHeaders"
          :items="selectedPlatform['pkb-packages']"
          :rows-per-page-text="$t('ui.pages.admin.platforms.platformsPerPage')"
          :rows-per-page-items="rowsPerPage"
        >
          <template v-slot:items="{ item }">
            <td>{{ item.name }}</td>
            <td>{{ item.entries }}</td>
            <td>{{ item.date }}</td>
          </template>
        </v-data-table>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            @click="pkbDialog = false"
          >
            {{ $t('ui.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  auth: true,
  middleware: ['admin'],
  data () {
    return {
      updating: false,
      pkbDialog: false,
      selectedPlatform: false,
      search: '',
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  async fetch ({ store }) {
    try {
      await store.dispatch('GET_PLATFORMS');
    } catch (e) {
      await store.dispatch('snacks/error', 'ui.errors.cannotGetPlatforms');
    }

    try {
      await store.dispatch('GET_PLATFORMS_CHANGED');
    } catch (e) {
      await store.dispatch('snacks/error', 'ui.errors.cannotGetPlatformsChanged');
    }
  },
  computed: {
    platforms () {
      const { platforms } = this.$store.state;
      return {
        hasLocalChanges: platforms['local-commits'] || platforms['local-changes'],
        isOutdated: platforms['from-head'] === 'outdated',
        ...platforms
      };
    },
    platformsItems () {
      return this.$store.state.platformsItems;
    },
    platformsChanged () {
      return this.$store.state.platformsChanged;
    },
    headers () {
      return [
        {
          text: 'PKBs',
          align: 'left',
          sortable: false,
          width: '10px'
        },
        {
          text: this.$t('ui.pages.admin.platforms.platform'),
          align: 'left',
          sortable: true,
          value: 'longname'
        },
        {
          text: this.$t('ui.pages.admin.platforms.certifications'),
          align: 'left',
          sortable: true,
          value: 'certifications',
          width: '10px'
        },
        {
          text: this.$t('ui.pages.admin.platforms.update'),
          align: 'left',
          sortable: false,
          width: '10px'
        }
      ];
    },
    pkbsHeaders () {
      return [
        {
          text: this.$t('ui.pages.admin.platforms.package'),
          sortable: false,
          value: 'name'
        },
        {
          text: this.$t('ui.pages.admin.platforms.entries'),
          sortable: false,
          value: 'entries'
        },
        {
          text: this.$t('ui.pages.admin.platforms.date'),
          sortable: false,
          value: 'date'
        }
      ];
    },
    rowsPerPage () {
      return [10, 30, 50, {
        text: this.$t('ui.pages.admin.platforms.allPlatformsPerPage'),
        value: -1
      }];
    }
  },
  methods: {
    async updatePlatforms () {
      this.updating = true;

      try {
        await this.$store.dispatch('UPDATE_REPO', 'platforms');
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.impossibleToUpdate');
        this.updating = false;
        return;
      }

      try {
        await this.$store.dispatch('GET_PLATFORMS');
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.cannotGetPlatforms');
        this.updating = false;
        return;
      }

      try {
        await this.$store.dispatch('LOAD_STATUS');
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.cannotLoadStatus');
        this.updating = false;
        return;
      }

      this.updating = false;
    }
  }
};
</script>
