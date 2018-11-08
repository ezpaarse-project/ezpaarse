<template>
  <v-card>
    <v-toolbar class="secondary" dense dark card>
      <v-toolbar-title>
        {{ $t('ui.pages.admin.jobs.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <p v-html="$t('ui.pages.admin.jobs.currentProcess', { process: 0 })"></p>

      <v-alert
        :value="true"
        color="teal"
        xs12 sm12
        outline
      >
        <p class="text-xs-center subheading" v-html="$t('ui.pages.admin.jobs.infos', {
          excelUrl: 'https://github.com/ezpaarse-project/ezpaarse/raw/master/misc/windows/ezPAARSE-Render.xltm',
          libreOfficeUrl: 'https://github.com/ezpaarse-project/ezpaarse/raw/master/misc/windows/ezPAARSE-Render.ots'
        })"></p>
      </v-alert>

      <v-layout row wrap mt-3>
        <v-flex xs12 sm12>
          <v-progress-linear
            background-color="teal lighten-3 white--text"
            color="success"
            height="20"
            value="75"
          ></v-progress-linear>
        </v-flex>

        <v-flex xs6 sm6 class="text-xs-left">
          <v-btn-toggle>
            <v-btn depressed color="green darken-4" class="white--text" router :to="{ path: '/admin/report' }">
              <v-icon left>mdi-file</v-icon>{{ $t('ui.pages.admin.jobs.consultReport') }}
            </v-btn>
          </v-btn-toggle>
        </v-flex>

        <v-flex xs6 sm6 class="text-xs-right">
          <v-btn-toggle>
            <v-btn depressed color="teal darken-4" class="white--text">
              <v-icon left>mdi-home</v-icon>{{ $t('ui.pages.admin.jobs.downloadResult') }}
            </v-btn>

            <v-btn depressed color="teal darken-2" class="white--text">
              {{ $t('ui.pages.admin.jobs.newProcess') }}<v-icon right>mdi-reload</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-flex>

        <v-flex xs12 sm12 mt-3>
          <v-expansion-panel v-model="panel" expand>
            <v-expansion-panel-content class="teal lighten-3 white--text">
              <div slot="header">{{ $t('ui.pages.admin.jobs.processState') }}</div>
              <v-card>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs6 sm6 pr-2>
                      <v-data-table
                        :items="dataECs"
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

                    <v-flex xs6 sm6 pl-2>
                      <v-data-table
                        :items="data"
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
            </v-expansion-panel-content>

            <v-expansion-panel-content class="teal lighten-3 white--text">
              <div slot="header">{{ $t('ui.files') }}</div>
              <v-card>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12 sm12>
                      <v-data-table
                        :items="files"
                        class="elevation-1"
                        hide-actions
                        :headers="headersFiles"
                      >
                        <template slot="items" slot-scope="props">
                          <td>{{ props.item.name }}</td>
                          <td class="text-xs-right">{{ props.item.size }} ko</td>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content class="teal lighten-3 white--text">
              <div slot="header">{{ $t('ui.pages.admin.jobs.rejects') }}</div>
              <v-card>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs9 sm9 pr-2>
                      <v-data-table
                        :items="rejects"
                        class="elevation-1"
                        hide-actions
                        right
                        hide-headers
                      >
                        <template slot="items" slot-scope="props">
                          <td @mouseover="currentReject = props.item">{{ props.item.label }}</td>
                          <td @mouseover="currentReject = props.item" class="text-xs-right">{{ props.item.value }}</td>
                          <td>
                            <v-progress-linear
                              v-if="props.item.progress"
                              background-color="teal lighten-3 white--text"
                              color="success"
                              height="15"
                              :value="Math.ceil((props.item.value * 100) / relevantLogLines)"
                            ></v-progress-linear>
                          </td>
                        </template>
                      </v-data-table>
                      <br />
                      <p>{{ $t('ui.pages.admin.jobs.relevantLogLinesRead', { relevantLogLines }) }}</p>
                    </v-flex>

                    <v-flex xs3 sm3 pl-2 v-if="currentReject">
                      <h3 class="headline">{{ currentReject.label }}</h3>
                      <br />
                      <p v-html="currentReject.descr" class="text-xs-justify"></p> 
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content class="teal lighten-3 white--text">
              <div slot="header">{{ $t('ui.pages.admin.jobs.traces') }}</div>
              <v-card>
                <v-card-text>
                  <v-alert
                    :value="true"
                    type="black"
                  >
                    <p v-for="trace in traces" :key="trace">{{ trace.type }} : {{ trace.text }}</p>
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      panel: [true, false, false, false, false],
      dataECs: [
        {
          label: 'Lignes lues',
          value: 283
        },
        {
          label: 'ECs générés',
          value: 21
        },
        {
          label: 'Durée du traitement',
          value: '1 s'
        },
        {
          label: 'Vitesse de traitement des logs',
          value: '225 lignes/s'
        },
        {
          label: 'Vitesse de génération des ECs',
          value: '16 ec/s'
        }
      ],
      data: [
        {
          label: 'Plateformes reconnues',
          value: 1
        },
        {
          label: 'Consultations HTML',
          value: 17
        },
        {
          label: 'Consultations PDF',
          value: 0
        }
      ],
      headersFiles: [
        {
          text: this.$t('ui.filesName'),
          align: 'left',
          sortable: true,
          value: 'name'
        },
        {
          text: this.$t('ui.size'),
          align: 'right',
          sortable: true,
          value: 'size'
        }
      ],
      files: [
        {
          name: 'Fichier 1',
          size: 405
        },
        {
          name: 'Fichier 2',
          size: 304
        },
        {
          name: 'Fichier 3',
          size: 786
        }
      ],
      rejects: [
        {
          label: 'Lignes ignorées',
          value: 70,
          alert: false,
          progress: false,
          descr: 'Nombre de requêtes non pertinentes. Il s\'agit principalement de téléchargements d\'images, css ou scripts web sans rapport direct avec une ressource. Dans un log brut, ce chiffre est souvent élevé.'
        },
        {
          label: 'ECs en accès refusé',
          value: 0,
          alert: false,
          progress: true,
          descr: '<p>Liste des accès qui ont été refusés à l\'utilisateur au moment du clic.</p><p>Exemple : tentative d\'accès à un article non négocié dans le bouquet de l\'établissement.</p>'
        },
        {
          label: 'Doublons filtrés',
          value: 1,
          alert: false,
          progress: true
        },
        {
          label: 'Domaines ignorés',
          value: 0,
          alert: false,
          progress: true
        },
        {
          label: 'Domaines inconnus',
          value: 0,
          alert: false,
          progress: true
        },
        {
          label: 'Formats inconnus',
          value: 0,
          alert: false,
          progress: true
        },
        {
          label: 'ECs non qualifiés',
          value: 191,
          alert: true,
          progress: true
        },
        {
          label: 'PKBs manquantes',
          value: 0,
          alert: false,
          progress: true
        },
        {
          label: 'Hosts ignorés',
          value: 0,
          alert: false,
          progress: true
        },
        {
          label: 'Robots',
          value: 0,
          alert: false,
          progress: true
        }
      ],
      relevantLogLines: 213,
      currentReject: null,
      traces: [
        {
          type: 'info',
          text: 'New job with ID: 8f8ca030-c0bd-11e8-9d16-b36968329800'
        },
        {
          type: 'info',
          text: 'Charset for request : utf-8'
        },
        {
          type: 'info',
          text: 'Charset for response : utf-8'
        }
      ]
    }
  }
}
</script>
