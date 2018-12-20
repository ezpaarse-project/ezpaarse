<template>
  <v-card>
    <v-card-text>
      <pre>
        {{currentPredefinedSettings}}
      </pre>
      <hr>
      <pre>
        {{predefinedSettings[0]}}
      </pre>
      <v-layout row wrap>
        <v-flex xs12 sm12>
          <v-select
            v-model="currentPredefinedSettings"
            :items="predefinedSettings"
            :item-text="predefinedSettingsText"
            label="Sélectionnez une option"
            :return-object="true"
            solo
          ></v-select>
        </v-flex>

        <v-flex xs12 sm12 mb-3>
          <v-expansion-panel>
            <v-expansion-panel-content class="teal lighten-3 white--text">
              <div slot="header">En entrée</div>
              <v-card>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs4 sm4 pr-2>
                      <v-select
                        :items="logTypes"
                        v-model="currentPredefinedSettings.headers.logTypes"
                        label="Type de log"
                      ></v-select>
                    </v-flex>

                    <v-flex xs4 sm4>
                      <v-text-field
                        v-model="currentPredefinedSettings.headers.dateFormat"
                        label="Format de date"
                        placeholder="DD/MMM/YYYY:HH:mm:ss Z"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs4 sm4 pl-2>
                      <v-text-field
                        v-model="currentPredefinedSettings.headers.forceParser"
                        label="Parseur par défaut"
                        placeholder="dspace"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content class="teal lighten-3 white--text">
              <div slot="header">En sortie</div>
                <v-card>
                  <v-card-text>
                    <v-layout row wrap>
                      <v-flex xs4 sm4 pr-2>
                        <v-select
                          :items="counterFormats"
                          v-model="currentPredefinedSettings.headers.counterFormat"
                          label="Format du résultat"
                        ></v-select>
                      </v-flex>

                      <v-flex xs4 sm4>
                        <v-select
                          :items="systemTraces"
                          v-model="systemTrace"
                          label="Traces système"
                        ></v-select>
                      </v-flex>

                      <v-flex xs4 sm4 pl-2>
                        <v-text-field
                          v-model="emails"
                          label="Notifications"
                          placeholder="Adresse(s) emails"
                          required
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm12>
                        <v-checkbox
                          label="Rapports COUNTER *"
                          v-model="currentPredefinedSettings.headers.counterReports"
                        ></v-checkbox>
                      </v-flex>

                      <v-flex xs6 sm6>
                        <v-combobox
                          v-model="currentPredefinedSettings.headers.outputFields.plus"
                          label="Champs en sortie"
                          chips
                          clearable
                          placeholder="Ajouter..."
                          multiple
                          append-icon=""
                        >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              :selected="data.selected"
                              close
                              @input="removeOutputPlus(data.index)"
                            >
                              <strong>{{ data.item }}</strong>
                            </v-chip>
                          </template>
                        </v-combobox>
                      </v-flex>

                      <v-flex xs6 sm6 pl-2>
                        <v-combobox
                          v-model="currentPredefinedSettings.headers.outputFields.minus"
                          chips
                          clearable
                          placeholder="Enlever..."
                          multiple
                          append-icon=""
                        >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              :selected="data.selected"
                              close
                              @input="removeOutputMinus(data.index)"
                            >
                              <strong>{{ data.item }}</strong>
                            </v-chip>
                          </template>
                        </v-combobox>
                      </v-flex>

                      <v-flex xs12 sm12>
                        <v-combobox
                          v-model="currentPredefinedSettings.headers.cryptedFields"
                          chips
                          clearable
                          label="Champs cryptés"
                          multiple
                          append-icon=""
                        >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              :selected="data.selected"
                              close
                              @input="removeCryptedField(data.index)"
                            >
                              <strong>{{ data.item }}</strong>
                            </v-chip>
                          </template>
                        </v-combobox>                      
                      </v-flex>

                      <v-flex xs12 sm12 mt-3>
                        * Les rapports ne sont pas certifiés COUNTER, cependant l'algorithme de dédoublonnage et les formats de sortie suivent les recommandations.
                      </v-flex>

                    </v-layout>
                  </v-card-text>
                </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content class="teal lighten-3 white--text">
              <div slot="header">Headers (avancé)</div>
              <v-card>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12 sm12>
                      <v-autocomplete
                        v-model="header"
                        :items="headers"
                        item-text="name"
                        item-value="name"
                        box
                        label="Headers"
                        append-icon="mdi-chevron-down"
                        @change="addHeader(header)"
                      >
                      </v-autocomplete>
                    </v-flex>
                    
                    <v-flex xs12 sm12 v-for="(header, key) in currentPredefinedSettings.advancedHeaders" :key="key">
                      <v-layout row wrap>
                        <v-flex xs2 sm2 pr-2>
                          <v-text-field
                            :value="header.header"
                            v-model="header.header"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs10 sm10>
                          <v-text-field
                            :value="header.value"
                            v-model="header.value"
                            append-outer-icon="mdi-close-circle"
                            @click:append-outer="removeHeader(key)"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>          
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
        
        <v-btn color="primary" block large><v-icon left>mdi-reload</v-icon>Paramètres par défaut</v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['predefinedSettings'],
  data () {
    return {
      currentPredefinedSettings: Object.assign({}, this.predefinedSettings[0]),
      logTypes: ['Reconnaissance auto', 'EZproxy', 'Apache', 'Squid'],
      logType: 'Reconnaissance auto',
      counterFormats: ['CSV', 'JSON', 'TSV'],
      systemTraces: ['Erreurs uniquement', 'Informations générales', 'Warnings sans conséquences'],
      systemTrace: 'Informations générales',
      emails: null,
      cryptedFiled: null,
      header: null,
      headers: {
        { header: 'Encodage' },
        { name: 'Response-Encoding', group: 'Encodage' },
        { name: 'Accept-Encoding', group: 'Encodage' },
        { name: 'Request-Charset', group: 'Encodage' },
        { name: 'Response-Charset', group: 'Encodage' }
      }
    }
  },
  methods: {
    removeOutputPlus (index) {
      this.currentPredefinedSettings.headers.plus.splice(index, 1)
    },
    removeOutputMinus (index) {
      this.currentPredefinedSettings.headers.minus.splice(index, 1)
    },
    removeCryptedField (value) {
      this.currentPredefinedSettings.headers.cryptedFields.splice(value, 1)
    },
    addHeader (value) {
      if (value) {
        this.currentPredefinedSettings.advancedHeaders.push({ label: value, value: null })
        this.header = null
      }
    },
    removeHeader (header) {
      this.currentPredefinedSettings.advancedHeaders.splice(header, 1)
    },
    predefinedSettingsText (item) {
      return `${item.country} - ${item.fullName}`
    }
  }
}
</script>
