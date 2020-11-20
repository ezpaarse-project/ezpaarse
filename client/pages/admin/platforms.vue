<template>
  <v-card>
    <v-toolbar class="secondary" dense dark flat>
      <v-toolbar-title v-text="$t('ui.pages.admin.platforms.title')" />
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
            <v-avatar left>
              <v-icon small>
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
      <v-container>
        <v-layout row wrap>
          <v-flex sx12 sm12 md9>
            <v-text-field

              v-model="search"
              class="mx-1"
              append-icon="mdi-magnify"
              :label="$t('ui.search')"
              solo
              hide-details
              clearable
            />
          </v-flex>

          <v-flex sx12 sm12 md3>
            <v-combobox
              v-model="searchCertifications"
              :item-text="(obj) => (obj)['name']"
              :item-value="(obj) => (obj)['id']"
              append-icon="mdi-tag"
              :items="certifications"
              class="mx-1"
              label="Certification"
              solo
              hide-details
              single-line
              multiple
              clearable
            >
              <template v-slot:selection="{ attrs, item, parent }">
                <v-chip
                  :key="item.id"
                  v-bind="attrs"
                >
                  <v-avatar
                    class="white--text"
                    left
                    :color="item.color"
                    v-text="item.id.toUpperCase().substr(0, 1)"
                  />
                  {{ item.name }}
                  <v-icon small @click="parent.selectItem(item)">
                    mdi-close
                  </v-icon>
                </v-chip>
              </template>
              <template v-slot:item="{ item }">
                <span v-text="item.name" />
                <v-list-item-avatar
                  class="white--text"
                  style="margin-left: 10px"
                  size="24"
                  :color="item.color"
                  v-text="item.id.toUpperCase().substr(0, 1)"
                />
              </template>
            </v-combobox>
          </v-flex>
        </v-layout>
      </v-container>
      <v-checkbox
        v-model="onlyOutdated"
        :label="$t('ui.pages.admin.platforms.onlyOutdated')"
      />
    </v-card-text>

    <v-data-table
      :headers="headers"
      :items="platformsItems"
      :no-data-text="$t('ui.pages.admin.platforms.noPlatforms')"
      :no-results-text="$t('ui.pages.admin.platforms.noPlatformFound')"
      :footer-props="footerProps"
      :search="search"
      :items-per-page="itemsPerPage"
    >
      <template v-slot:item.pkbs="{ item }">
        <v-icon
          v-if="item['pkb-packages'].length > 0"
          @click="selectedPlatform = item; pkbDialog = true"
        >
          mdi-file-document
        </v-icon>
      </template>

      <template v-slot:item.longname="{ item }">
        <a
          :href="item.docurl"
          target="_blank"
          v-text="item.longname"
        />
      </template>

      <template v-slot:item.certifications="{ item }">
        <a
          v-if="item.certifications && item.certifications.human"
          href="https://blog.ezpaarse.org/2017/06/certification-h-et-p-des-plateformes-traitees-dans-ezpaarse/"
          target="_blank"
          style="text-decoration: none;"
        >
          <v-avatar size="24" color="#F4B48B">
            <span class="white--text">H</span>
          </v-avatar>
        </a>

        <a
          v-if="item.certifications && item.certifications.publisher"
          href="https://blog.ezpaarse.org/2017/06/certification-h-et-p-des-plateformes-traitees-dans-ezpaarse/"
          target="_blank"
          style="text-decoration: none;"
        >
          <v-avatar size="24" color="#5AB9C1">
            <span class="white--text">P</span>
          </v-avatar>
        </a>
      </template>

      <template v-slot:item.update="{ item }">
        <v-icon v-if="platformsChanged[item.name]" color="info">
          mdi-arrow-up-bold-circle
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="pkbDialog" width="600">
      <v-card>
        <v-card-title class="title primary white--text" v-text="selectedPlatform.longname" />

        <v-divider />

        <v-data-table
          :headers="pkbsHeaders"
          :items="selectedPlatform['pkb-packages']"
          :rows-per-page-text="$t('ui.pages.admin.platforms.platformsPerPage')"
          :rows-per-page-items="rowsPerPage"
        >
          <template v-slot:items="{ item }">
            <td v-text="item.name" />
            <td v-text="item.entries" />
            <td v-text="item.date" />
          </template>
        </v-data-table>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="pkbDialog = false"
            v-text="$t('ui.close')"
          />
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
      onlyOutdated: false,
      search: '',
      itemsPerPage: 10,
      searchCertifications: []
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
        hasLocalChanges: !!(platforms['local-commits'] || platforms['local-changes']),
        isOutdated: platforms['from-head'] === 'outdated',
        ...platforms
      };
    },
    platformsItems () {
      const certifications = this.searchCertifications;

      return this.$store.state.platformsItems.filter((p) => {
        if (this.onlyOutdated && !this.platformsChanged[p.name]) {
          return false;
        }
        if (certifications.length) {
          return certifications.some((certification) => {
            return p.certifications && p.certifications[certification.id];
          });
        }

        return true;
      }).sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
    },
    platformsChanged () {
      return this.$store.state.platformsChanged;
    },
    headers () {
      return [
        {
          text: 'PKBs',
          value: 'pkbs',
          align: 'center',
          sortable: true,
          width: 10
        },
        {
          text: this.$t('ui.pages.admin.platforms.platform'),
          align: 'left',
          sortable: true,
          value: 'longname',
          width: 300
        },
        {
          text: this.$t('ui.pages.admin.platforms.certifications'),
          align: 'center',
          sortable: false,
          value: 'certifications',
          width: 10
        },
        {
          text: this.$t('ui.pages.admin.platforms.update'),
          align: 'center',
          sortable: true,
          value: 'update',
          width: 10
        }
      ];
    },
    footerProps () {
      return {
        itemsPerPageText: this.$t('ui.pages.admin.platforms.platformsPerPage'),
        itemsPerPageOptions: [this.itemsPerPage, 30, 50, -1]
      };
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
    },
    certifications () {
      return [
        {
          id: 'human',
          name: this.$t('ui.pages.admin.platforms.human'),
          color: '#F4B48B'
        },
        {
          id: 'publisher',
          name: this.$t('ui.pages.admin.platforms.publisher'),
          color: '#5AB9C1'
        }
      ];
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
