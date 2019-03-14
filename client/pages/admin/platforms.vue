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
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          sm12
        >
          <p v-if="platformsChanged && platformsChanged.length > 0">
            <v-alert
              :value="true"
              color="teal lighten-2"
            >
              <h4>{{ $t('ui.pages.admin.platforms.newPlatformsAvailable') }}</h4>
              <ul>
                <li
                  v-for="(platform, key) in platformsChanged"
                  :key="key"
                >
                  {{ key }}
                </li>
              </ul>
            </v-alert>
          </p>
          <p>
            <strong>{{ $t('ui.currentVersion') }}</strong> :
            <v-alert
              v-if="platforms['local-commits'] || platforms['local-changes']"
              :value="true"
              color="red lighten-2"
              v-html="$t('ui.pages.admin.updates.repoLocalChanges', { repo: 'platforms' })"
            />
            <v-tooltip
              v-if="platforms['from-head'] === 'outdated'"
              right
            >
              <v-btn
                slot="activator"
                depressed
                color="red lighten-2 white--text"
                round
                @click="updatePlatforms"
              >
                {{ platforms.current }}<v-icon class="pl-1">
                  mdi-alert-circle
                </v-icon>
              </v-btn>
              <span>{{ $t('ui.updateTo', { newVersion: platforms.head }) }}</span>
            </v-tooltip>
            <v-btn
              v-else
              slot="activator"
              depressed
              color="green lighten-2 white--text"
              round
            >
              {{ platforms.current }}
            </v-btn>
            <v-progress-circular
              v-if="inUpdate"
              indeterminate
              color="teal"
            />
          </p>
        </v-flex>

        <v-flex
          xs12
          sm12
        >
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('ui.search')"
            single-line
          />
        </v-flex>

        <v-flex
          xs12
          sm12
        >
          <v-data-table
            :headers="headers"
            :items="platformsItems"
            :no-data-text="$t('ui.pages.admin.platforms.noPlatforms')"
            :rows-per-page-text="$t('ui.pages.admin.platforms.platformsPerPage')"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            sort-icon="mdi-menu-down"
            :rows-per-page-items="rowsPerPage"
            :search="search"
            :pagination.sync="pagination"
            class="elevation-1"
          >
            <template
              slot="items"
              slot-scope="props"
            >
              <td style="width: 30px;">
                <v-icon
                  v-if="props.item['pkb-packages'].length > 0 && props.item.pkb"
                  @click="currentPlatform = props.item; dialog = true"
                >
                  mdi-file-document
                </v-icon>
              </td>
              <td>
                <a
                  :href="props.item.docurl"
                  target="_blank"
                >
                  {{ props.item.longname }}
                </a>
              </td>
              <td v-if="props.item.certifications">
                <span
                  v-for="(certification, k) in props.item.certifications"
                  :key="k"
                  class="mr-1"
                >
                  <a
                    href="https://blog.ezpaarse.org/2017/06/certification-h-et-p-des-plateformes-traitees-dans-ezpaarse/"
                    target="_blank"
                  >
                    <img
                      slot="activator"
                      :src="`/img/certifications/${certification}.png`"
                      :alt="`Certification ${certification}`"
                      width="25"
                    >
                  </a>
                </span>
              </td>
              <td v-else>
                {{ $t('ui.pages.admin.platforms.noCertifications') }}
              </td>
            </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="info"
              icon="mdi-alert-circle"
            >
              {{ $t('ui.pages.admin.platforms.noPlatformFoundWithName', { search }) }}
            </v-alert>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>

    <v-dialog
      v-if="currentPlatform.pkb && dialog"
      v-model="currentPlatform"
      width="600"
    >
      <v-card>
        <v-card-title
          class="headline teal lighten-2 white--text"
          primary-title
        >
          {{ currentPlatform.longname }}
        </v-card-title>

        <v-card-text>
          <v-data-table
            :headers="pkbsHeaders"
            :items="currentPlatform['pkb-packages']"
            :rows-per-page-text="$t('ui.pages.admin.platforms.platformsPerPage')"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            sort-icon="mdi-menu-down"
            :rows-per-page-items="rowsPerPage"
            class="elevation-1"
          >
            <template
              slot="items"
              slot-scope="props"
            >
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.entries }}</td>
              <td>{{ props.item.date }}</td>
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
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
      inUpdate: false,
      dialog: false,
      currentPlatform: false,
      search: '',
      pagination: {
        rowsPerPage: 10
      },
      headers: [
        {
          text: 'PKBs',
          align: 'left',
          sortable: false
        },
        {
          text: this.$t('ui.pages.admin.platforms.title'),
          align: 'left',
          sortable: true,
          value: 'longname'
        },
        {
          text: 'Certifications',
          align: 'left',
          sortable: true,
          value: 'certifications'
        }
      ],
      pkbsHeaders: [
        {
          text: 'Package',
          sortable: false,
          value: 'name'
        },
        {
          text: this.$t('ui.pages.admin.platforms.entries'),
          sortable: false,
          value: 'entries'
        },
        {
          text: 'Date',
          sortable: false,
          value: 'date'
        }
      ],
      rowsPerPage: [10, 30, 50, {
        text: this.$t('ui.pages.admin.platforms.allPlatformsPerPage'),
        value: -1
      }]
    };
  },
  async fetch ({ store, app }) {
    try {
      await store.dispatch('GET_PLATFORMS');
      await store.dispatch('GET_PLATFORMS_CHANGED');
      return true;
    } catch (e) {
      await store.dispatch('snacks/error', app.i18n.t('ui.errors.error'));
      return false;
    }
  },
  computed: {
    platforms () {
      return this.$store.state.platforms;
    },
    platformsItems () {
      return this.$store.state.platformsItems;
    },
    platformsChanged () {
      return this.$store.state.platformsChanged;
    }
  },
  methods: {
    updatePlatforms () {
      this.inUpdate = true;
      this.$store.dispatch('UPDATE_REPO', 'platforms').then(() => {
        this.$store.dispatch('GET_PLATFORMS').then(() => {
          this.$store.dispatch('LOAD_STATUS').then(() => {
            this.inUpdate = false;
          }).catch(() => this.$store.dispatch('snacks/error', this.$t('ui.errors.error')));
        }).catch(() => this.$store.dispatch('snacks/error', this.$t('ui.errors.error')));
      }).catch(() => this.$store.dispatch('snacks/error', this.$t('ui.errors.error')));
    }
  }
};
</script>

<style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
</style>
