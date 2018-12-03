<template>
  <v-card>
    <v-toolbar class="secondary" dense dark card>
      <v-toolbar-title>
        {{ $t('ui.pages.admin.platforms.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm12>
          <p v-if="platformsChanged && platformsChanged.length > 0">
            <v-alert :value="true" color="teal lighten-2">
              <h4>{{$t('ui.pages.admin.platforms.newPlatformsAvailable')}}</h4>
              <ul>
                <li v-for="(platform, key) in platformsChanged" :key="key">{{ key }}</li>
              </ul>
            </v-alert>
          </p>
          <p>
            <strong>{{ $t('ui.currentVersion') }}</strong> : 
            <v-alert :value="true" color="red lighten-2" v-html="$t('ui.pages.admin.updates.repoLocalChanges', { repo: 'platforms' })" v-if="platforms['local-commits'] || platforms['local-changes']"></v-alert>
            <v-tooltip right v-if="platforms['from-head'] === 'outdated'">
              <v-btn @click="updatePlatforms" depressed color="red lighten-2 white--text" round slot="activator">{{platforms.current}}<v-icon class="pl-1">mdi-alert-circle</v-icon></v-btn> 
              <span>{{ $t('ui.updateTo', { newVersion: platforms.head }) }}</span>
            </v-tooltip>
            <v-btn v-else depressed color="green lighten-2 white--text" round slot="activator">{{platforms.current}}</v-btn>
            <v-progress-circular
              v-if="inUpdate"
              indeterminate
              color="teal"
            ></v-progress-circular>
          </p>
        </v-flex>

        <v-flex xs12 sm12>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('ui.search')"
            single-line
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm12>
          <v-data-table
            :headers="headers"
            :items="platformsItems"
            :no-data-text="$t('ui.pages.admin.platforms.noPlatforms')"
            :rows-per-page-text="$t('ui.pages.admin.platforms.platformsPerPage')"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            sort-icon="mdi-menu-down"
            :rows-per-page-items="[10, 30, 50, {'text': $t('ui.pages.admin.platforms.allPlatformsPerPage'), 'value': -1}]"
            :search="search"
            :pagination.sync="pagination"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td style="width: 30px;">
                <v-icon v-if="props.item['pkb-packages'].length > 0 && props.item.pkb" @click="currentPlatform = props.item; dialog = true">mdi-file-document</v-icon>
              </td>
              <td><a :href="props.item.docurl" target="_blank">{{ props.item.longname }}</a></td>
              <td v-if="props.item.certifications">
                <span v-for="(certification, k) in props.item.certifications" :key="k">
                  <img :src="`/img/certifications/${certification}.png`" :alt="`Certification ${certification}`" width="25">&nbsp;
                </span>
              </td>
              <td v-else>{{ $t('ui.pages.admin.platforms.noCertifications') }}</td>
            </template>
            <v-alert slot="no-results" :value="true" color="info" icon="mdi-alert-circle">
              {{ $t('ui.pages.admin.platforms.noPlatformFoundWithName', { search }) }}
            </v-alert>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>
    
    <v-dialog width="600" v-if="currentPlatform.pkb && dialog" v-model="currentPlatform">
      <v-card>
        <v-card-title
          class="headline teal lighten-2 white--text"
          primary-title
        >
          {{currentPlatform.longname}}
        </v-card-title>

        <v-card-text>
          <v-data-table
            :headers="pkbsHeaders"
            :items="currentPlatform['pkb-packages']"
            :rows-per-page-text="$t('ui.pages.admin.platforms.platformsPerPage')"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            sort-icon="mdi-menu-down"
            :rows-per-page-items="[10, 30, 50, {'text': $t('ui.pages.admin.platforms.allPlatformsPerPage'), 'value': -1}]"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{props.item.name}}</td>
              <td>{{props.item.entries}}</td>
              <td>{{props.item.date}}</td>
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
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
      ]
    }
  },
  watch: {
    user () {
      if (!this.user) this.$router.push('/')
    }
  },
  async fetch ({ store, redirect }) {
    try {
      await store.dispatch('GET_USER')
      await store.dispatch('LOAD_STATUS')
      await store.dispatch('GET_PLATFORMS')
      await store.dispatch('GET_PLATFORMS_CHANGED')
    } catch (e) {
      return redirect('/')
    }
  },
  computed: {
    platforms () {
      return this.$store.state.platforms
    },
    platformsItems () {
      return this.$store.state.platformsItems
    },
    platformsChanged () {
      return this.$store.state.platformsChanged
    },
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    updatePlatforms () {
      this.inUpdate = true
      this.$store.dispatch('UPDATE_REPO', 'platforms').then(res => {
        this.$store.dispatch('GET_PLATFORMS').then(res => {
          this.$store.dispatch('LOAD_STATUS').then(res => {
            this.inUpdate = false
          }).catch(err => { })
        }).catch(err => { })
      }).catch(err => { })
    }
  }
}
</script>

<style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
</style>