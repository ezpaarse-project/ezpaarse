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
          <p>
            <strong>{{ $t('ui.currentVersion') }}</strong> : 
            <v-tooltip right>
              <v-btn depressed color="teal lighten-2 white--text" round slot="activator">1ac7e20<v-icon class="pl-1">mdi-alert-circle</v-icon></v-btn>
              <span>{{ $t('ui.updateTo', { newVersion: '1ac7e20' }) }}</span>
            </v-tooltip>
          </p>
        </v-flex>

        <v-flex xs12 sm12>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t(('ui.search'))"
            single-line
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm12>
          <v-data-table
            :headers="headers"
            :items="platforms"
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
              <td @click="currentPlatform = props.item; dialog = true"><a :href="props.item.url" target="_blank">{{ props.item.name }}</a></td>
              <td @click="currentPlatform = props.item; dialog = true" v-if="props.item.certifications">
                <span v-for="(certification, k) in props.item.certifications" :key="k">
                  <img :src="`/img/certifications/${certification}.png`" :alt="`Certification ${certification}`" width="25">&nbsp;
                </span>
              </td>
              <td @click="currentPlatform = props.item; dialog = true" v-else>{{ $t('ui.pages.admin.platforms.noCertifications') }}</td>
            </template>
            <v-alert slot="no-results" :value="true" color="info" icon="mdi-alert-circle">
              {{ $t('ui.pages.admin.platforms.noPlatformFoundWithName', { search }) }}
            </v-alert>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>
    
    <v-dialog width="500" v-if="currentPlatform.pkbs && dialog" v-model="currentPlatform">
      <v-card>
        <v-card-title
          class="headline teal lighten-2 white--text"
          primary-title
        >
          {{currentPlatform.name}}
        </v-card-title>

        <v-card-text>
          <v-chip v-for="(pkb, key) in currentPlatform.pkbs" :key="key">
            <v-avatar class="teal">{{pkb.issues}}</v-avatar>
            {{pkb.date}} - {{pkb.name}}
          </v-chip>
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
      dialog: false,
      currentPlatform: false,
      search: '',
      pagination: {
        rowsPerPage: 10
      },
      headers: [
        {
          text: 'Plateforme',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Certifications',
          align: 'left',
          sortable: true,
          value: 'certifications'
        }
      ],
      platforms: [
        {
          url: 'http://analyses.ezpaarse.org',
          name: 'Plateforme 1',
          certifications: ['H', 'P'],
          pkbs: null,
          old: false
        },
        {
          url: 'http://analyses.ezpaarse.org',
          name: 'Plateforme 2',
          certifications: null,
          pkbs: [
            {
              name: 'PBK 1',
              issues: 10,
              date: '2018-09-20'
            },
            {
              name: 'PBK 2',
              issues: 53,
              date: '2017-10-09'
            }
          ],
          old: false
        },
        {
          url: 'http://analyses.ezpaarse.org',
          name: 'Plateforme 3',
          certifications: null,
          pkbs: null,
          old: true
        }
      ]
    }
  }
}
</script>
