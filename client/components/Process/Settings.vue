<template>
  <v-card>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm12>
          <v-autocomplete
            v-model="currentPredefinedSettings"
            :items="predefinedSettings"
            :item-text="predefinedSettingsText"
            label="Sélectionnez une option"
            :return-object="true"
            solo
            @change="updateDefaultSettings"
            append-outer-icon="mdi-close-circle"
            @click:append-outer="resetSettings"
          ></v-autocomplete>
        </v-flex>

        <v-flex xs12 sm12 mb-3 v-if="currentPredefinedSettings">
          <v-expansion-panel expand>
            <v-expansion-panel-content class="teal lighten-3 white--text">
              <div slot="header">En entrée</div>
              <v-card>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs4 sm4 pr-2>
                      <v-select
                        :items="logTypes"
                        item-value="value"
                        item-text="text"
                        v-model="currentPredefinedSettings.headers['Log-Format'].format"
                        label="Type de log"
                      ></v-select>
                    </v-flex>

                    <v-flex xs4 sm4>
                      <v-text-field
                        v-model="currentPredefinedSettings.headers['Date-Format']"
                        label="Format de date"
                        placeholder="DD/MMM/YYYY:HH:mm:ss Z"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs4 sm4 pl-2>
                      <v-text-field
                        v-model="currentPredefinedSettings.headers['Force-Parser']"
                        label="Parseur par défaut"
                        placeholder="dspace"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm12 v-if="currentPredefinedSettings.headers['Log-Format'].value || currentPredefinedSettings.headers['Log-Format'].format">
                      <v-textarea
                        label="Format de log"
                        :value="currentPredefinedSettings.headers['Log-Format'].value"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content class="teal lighten-3 white--text" v-if="currentPredefinedSettings">
              <div slot="header">En sortie</div>
                <v-card>
                  <v-card-text>
                    <v-layout row wrap>
                      <v-flex xs4 sm4 pr-2>
                        <v-select
                          :items="counterFormats"
                          v-model="currentPredefinedSettings.headers['COUNTER-Format']"
                          label="Format du résultat"
                        ></v-select>
                      </v-flex>

                      <v-flex xs4 sm4>
                        <v-select
                          :items="tracesLevel"
                          v-model="currentPredefinedSettings.headers['Trace-Level']"
                          label="Traces système"
                        ></v-select>
                      </v-flex>

                      <v-flex xs4 sm4 pl-2>
                        <v-text-field
                          v-model="currentPredefinedSettings.headers['ezPAARSE-Job-Notifications']"
                          label="Notifications"
                          placeholder="Adresse(s) emails"
                          required
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm12>
                        <v-checkbox
                          label="Rapports COUNTER *"
                          v-model="currentPredefinedSettings.headers['COUNTER-Reports']"
                          @change="updateCounterFormat"
                        ></v-checkbox>
                      </v-flex>

                      <v-flex xs6 sm6>
                        <v-combobox
                          v-model="currentPredefinedSettings.headers['Output-Fields'].plus"
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
                          v-model="currentPredefinedSettings.headers['Output-Fields'].minus"
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
                          v-model="currentPredefinedSettings.headers['Crypted-Fields']"
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

            <v-expansion-panel-content class="teal lighten-3 white--text" v-if="currentPredefinedSettings">
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
                    
                    <v-flex xs12 sm12 v-for="(header, key) in currentPredefinedSettings.headers.advancedHeaders" :key="key">
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
        
        <v-btn color="primary" block large v-if="currentPredefinedSettings" @click="resetSettings"><v-icon left>mdi-reload</v-icon>Paramètres par défaut</v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['predefinedSettings'],
  data () {
    return {
      currentPredefinedSettings: JSON.parse(JSON.stringify(this.predefinedSettings[0])),
      logTypes: [
        { value: null, text: 'Reconnaissance auto' },
        { value: 'ezproxy', text: 'EZproxy' },
        { value: 'apache', text: 'Apache' },
        { value: 'squid', text: 'Squid' }
      ],
      counterFormats: [
        { value: 'csv', text: 'CSV'},
        { value: 'tsv', text: 'TSV'},
        { value: 'json', text: 'JSON' }
      ],
      tracesLevel: [
        { value: 'info', text: 'Informations générales'},
        { value: 'error', text: 'Erreurs uniquement'},
        { value: 'warn', text: 'Warnings sans conséquences' }
      ],
      header: null,
      headers: [
        { header: 'Encodage' },
        { name: 'Response-Encoding', group: 'Encodage' },
        { name: 'Accept-Encoding', group: 'Encodage' },
        { name: 'Request-Charset', group: 'Encodage' },
        { name: 'Response-Charset', group: 'Encodage' }
      ]
    }
  },
  methods: {
    removeOutputPlus (index) {
      this.currentPredefinedSettings.headers['Output-Fields'].plus.splice(index, 1)
    },
    removeOutputMinus (index) {
      this.currentPredefinedSettings.headers['Output-Fields'].minus.splice(index, 1)
    },
    addOutputPlus (data) {
      this.currentPredefinedSettings.headers['Output-Fields'].plus.push(data)
    },
    addOutputMinus (data) {
      this.currentPredefinedSettings.headers['Output-Fields'].minus.push(data)
    },
    removeCryptedField (value) {
      this.currentPredefinedSettings.headers['Crypted-Fields'].splice(value, 1)
    },
    addHeader (value) {
      if (value) {
        this.currentPredefinedSettings.headers.advancedHeaders.push({ header: value, value: null })
        this.header = null
      }
    },
    removeHeader (header) {
      this.currentPredefinedSettings.headers.advancedHeaders.splice(header, 1)
    },
    predefinedSettingsText (item) {
      return `${item['country']} - ${item['fullName']}`
    },
    updateCounterFormat () {
      if (this.currentPredefinedSettings.headers['COUNTER-Reports']) this.currentPredefinedSettings.headers['COUNTER-Format'] = 'tsv'
    },
    updateDefaultSettings (value) {
      this.currentPredefinedSettings = JSON.parse(JSON.stringify(value))
      this.$emit('setCurrentPredefinedSettings', this.currentPredefinedSettings)
    },
    resetSettings () {
      this.currentPredefinedSettings = JSON.parse(JSON.stringify(this.predefinedSettings[0]))
      this.$emit('setCurrentPredefinedSettings', this.currentPredefinedSettings)
    },
    removeEmail (index) {
      this.currentPredefinedSettings.headers.emails.splice(index, 1)
    }
  }
}
</script>
