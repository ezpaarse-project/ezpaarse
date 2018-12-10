<template>
  <v-card>
    <v-toolbar class="secondary" dense dark card>
      <v-toolbar-title>
        {{ $t('ui.pages.admin.report.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-layout row wrap>
        <v-flex xs6 sm6 v-for="(report, key) in reports" :key="key" mb-3 pr-2 pl-2>
          <v-card>
            <v-toolbar color="teal" dense dark card>
              <v-toolbar-title>{{ report.title }}</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12 sm12>
                  <v-data-table
                    :items="report.data"
                    class="elevation-1"
                    hide-actions
                    right
                    hide-headers
                  >
                    <template slot="items" slot-scope="props">
                      <td>{{ props.item.label }}</td>
                      <td class="text-xs-right">{{ props.item.value }}</td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  auth: true,
  middleware: [ 'admin' ],
  data () {
    return {
      reports: [
        {
          title: 'Général',
          data: [
            {
              label: 'Job-Date',
              value: '2018-09-26T09:38:07+02:00'
            },
            {
              label: 'Job-Done',
              value: 'true'
            }
          ]
        },
        {
          title: 'Rejets',
          data: [
            {
              label: 'nb-lines-duplicate-ecs',
              value: 1
            },
            {
              label: 'nb-lines-ignored',
              value: 70
            }
          ]
        },
        {
          title: 'Statistiques',
          data: [
            {
              label: 'mime-HTML',
              value: 17
            },
            {
              label: 'mime-MISC',
              value: 4
            }
          ]
        },
        {
          title: 'Alertes',
          data: [
            {
              label: 'active-alerts',
              value: 'unknown-domains, missing-title-ids'
            }
          ]
        },
        {
          title: 'Dédoublonnage',
          data: [
            {
              label: 'activated',
              value: true
            },
            {
              label: 'fieldname-C',
              value: 'session'
            }
          ]
        },
        {
          title: 'Fichier',
          data: [
            {
              label: '1',
              value: 'sd.2012-11-30.300.log'
            }
          ]
        },
        {
          title: 'Première consultation',
          data: [
            {
              label: 'ISSNs',
              value: '1046-2023'
            },
            {
              label: 'coverage_depth',
              value: 'fulltext'
            }
          ]
        },
        {
          title: 'Traces système',
          data: [
            {
              label: 'info',
              value: 'New job with ID: 629d25c0-c15f-11e8-a37b-790b63d18935 '
            },
            {
              label: 'info',
              value: 'Charset for request : utf-8 '
            }
          ]
        }
      ]
    }
  },
  async fetch ({ store, redirect }) {
    try {
      await store.dispatch('LOAD_STATUS')
    } catch (e) { }
  }
}
</script>
