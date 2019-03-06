<template>
  <v-card>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm12>
          <v-autocomplete
            v-model="currentPredefinedSettings"
            :items="!displayCustomPredefinedSettings ? allPredefinedSettings : customPredefinedSettings"
            item-text="fullName"
            :label="$t('ui.pages.process.settings.selectAnOption')"
            :return-object="true"
            :append-outer-icon="(currentPredefinedSettings._id && $auth.user.group === 'admin') ? 'mdi-delete' : ''"
            @click:append-outer="removeCustomPredefinedSettings"
            box
            clearable
          >
            <template slot="item" slot-scope="data">
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.fullName"></v-list-tile-title>
                <v-list-tile-sub-title v-html="data.item.country"></v-list-tile-sub-title>
              </v-list-tile-content>
            </template>
          </v-autocomplete>

          <v-checkbox
            v-if="customPredefinedSettings.length > 0"
            class="mTopM20"
            v-model="displayCustomPredefinedSettings"
            @change="setCurrentToCustomPredefinedSettings"
            label="Afficher les paramètres prédéfines personnalisés"
          ></v-checkbox>
        </v-flex>

        <v-flex xs12 sm12 mb-3 v-if="currentPredefinedSettings">
          <v-expansion-panel expand>
            <v-expansion-panel-content class="teal white--text">
              <div slot="header">{{ $t('ui.pages.process.settings.input') }}</div>
              <v-card>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs4 sm4 pr-2>
                      <v-select
                        :items="logTypes"
                        item-value="value"
                        item-text="text"
                        v-model="currentPredefinedSettings.headers['Log-Format'].format"
                        :label="$t('ui.pages.process.settings.typeOfLog')"
                      ></v-select>
                    </v-flex>

                    <v-flex xs4 sm4>
                      <v-text-field
                        v-model="currentPredefinedSettings.headers['Date-Format']"
                        :label="$t('ui.pages.process.settings.dateFormat')"
                        placeholder="DD/MMM/YYYY:HH:mm:ss Z"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs4 sm4 pl-2>
                      <v-text-field
                        v-model="currentPredefinedSettings.headers['Force-Parser']"
                        :label="$t('ui.pages.process.settings.defaultParser')"
                        placeholder="dspace"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm12 v-if="currentPredefinedSettings.headers['Log-Format'].value || currentPredefinedSettings.headers['Log-Format'].format">
                      <v-textarea
                        :label="$t('ui.pages.process.settings.logFormat')"
                        :value="currentPredefinedSettings.headers['Log-Format'].value"
                        v-model="currentPredefinedSettings.headers['Log-Format'].value"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content class="teal white--text" v-if="currentPredefinedSettings">
              <div slot="header">{{ $t('ui.pages.process.settings.output') }}</div>
                <v-card>
                  <v-card-text>
                    <v-layout row wrap>
                      <v-flex xs6 sm6 pr-2>
                        <v-select
                          :items="counterFormats"
                          v-model="currentPredefinedSettings.headers['COUNTER-Format']"
                          :label="$t('ui.pages.process.settings.counterFormat')"
                        ></v-select>
                      </v-flex>

                      <v-flex xs6 sm6>
                        <v-select
                          :items="tracesLevel"
                          v-model="currentPredefinedSettings.headers['Trace-Level']"
                          :label="$t('ui.pages.process.settings.traceLevel')"
                        ></v-select>
                      </v-flex>

                      <v-flex xs12 sm12>
                        <v-combobox
                          v-model="currentPredefinedSettings.headers['ezPAARSE-Job-Notifications']"
                          :label="$t('ui.pages.process.settings.notificationsEmails')"
                          chips
                          clearable
                          multiple
                          append-icon=""
                        >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              :selected="data.selected"
                              close
                              @input="removeEmail(data.index)"
                            >
                              <strong>{{ data.item }}</strong>
                            </v-chip>
                          </template>
                        </v-combobox>
                      </v-flex>

                      <v-flex xs12 sm12>
                        <v-checkbox
                          :label="$t('ui.pages.process.settings.counterReports')"
                          v-model="currentPredefinedSettings.headers['COUNTER-Reports']"
                          @change="updateCounterFormat"
                        ></v-checkbox>
                      </v-flex>

                      <v-flex xs12 sm12>
                        <h4>{{ $t('ui.pages.process.settings.outputFields') }} :</h4>
                      </v-flex>
                      <v-flex xs6 sm6>
                        <v-combobox
                          v-model="currentPredefinedSettings.headers['Output-Fields'].plus"
                          :label="$t('ui.pages.process.settings.add')"
                          chips
                          clearable
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
                          :label="$t('ui.pages.process.settings.remove')"
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
                          :label="$t('ui.pages.process.settings.cryptedFields')"
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
                        {{ $t('ui.pages.process.settings.counterReportDetail') }}
                      </v-flex>

                    </v-layout>
                  </v-card-text>
                </v-card>
            </v-expansion-panel-content>

            <v-expansion-panel-content class="teal white--text" v-if="currentPredefinedSettings">
              <div slot="header">Headers ({{ $t('ui.pages.process.settings.advancedHeaders') }})</div>
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
                            prepend-icon="mdi-information"
                            @click:prepend="informations(header.header)"
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

        <v-flex xs12 sm12 class="text-xs-center">
          <ButtonGroup>
            <v-btn color="success" block large @click="modal = true" :disabled="disabledButton">
              <v-icon left>mdi-content-save-settings</v-icon>
              {{ $t('ui.save') }}
            </v-btn>
            <v-btn color="primary" block large @click="resetSettings" :disabled="disabledButton">
              {{ $t('ui.pages.process.settings.defaultParams') }}
              <v-icon right>mdi-reload</v-icon>
            </v-btn>
          </ButtonGroup>
        </v-flex>
      </v-layout>
    </v-card-text>

    <v-dialog
      v-model="modal"
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">{{ $t('ui.save') }}</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12>
                <v-text-field
                :label="$t('ui.name')"
                v-model="saveFields.fullName"
                box
                name="fullName"
                required
                :error="fullNameError ? true : false"
                :error-messages="fullNameError"
              >
              </v-text-field>
              </v-flex>
              <v-flex xs12 sm12>
                 <v-autocomplete
                  v-model="saveFields.country"
                  :items="countries"
                  item-value="en"
                  :item-text="$i18n.locale"
                  :label="$t('ui.country')"
                  :return-object="true"
                  box
                  name="country"
                  required
                >
                  <template slot="item" slot-scope="data">
                    <v-list-tile-content>
                      <v-list-tile-title v-html="data.item[$i18n.locale]"></v-list-tile-title>
                    </v-list-tile-content>
                  </template>
                </v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            @click="modal = false"
          >
            {{ $t('ui.close') }}
          </v-btn>
          <v-btn
            color="success"
            :disabled="disabledButtonSave"
            @click="saveCustomSettings"
          >
            {{ $t('ui.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import ButtonGroup from '~/components/ButtonGroup'
import isEqual from 'lodash.isequal'

export default {
  components: {
    ButtonGroup
  },
  data () {
    return {
      disabledButton: true,
      disabledButtonSave: true,
      displayCustomPredefinedSettings: false,
      modal: false,
      fullNameError: null,
      saveFields: {
        fullName: '',
        country: ''
      },
      logTypes: [
        { value: '', text: 'Reconnaissance auto' },
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
        { name: 'Response-Encoding', anchor: 'response-encoding' },
        { name: 'Accept-Encoding', anchor: 'accept-encoding' },
        { name: 'Request-Charset', anchor: 'request-charset' },
        { name: 'Response-Charset', anchor: 'response-charset' },
        { divider: true },
        { header: 'Format' },
        { name: 'Accept', anchor: 'accept' },
        { name: 'Log-Format-xxx', anchor: 'log-format-xxx' },
        { name: 'Date-Format', anchor: 'date-format' },
        { name: 'Output-Fields', anchor: 'output-fields' },
        { name: 'Max-Parse-Attempts', anchor: 'max-parse-attempts' },
        { divider: true },
        { header: 'Extraction' },
        { name: 'Extract', anchor: 'extract' },
        { divider: true },
        { header: 'COUNTER' },
        { name: 'COUNTER-Reports', anchor: 'counter-reports' },
        { name: 'COUNTER-Format', anchor: 'counter-format' },
        { name: 'COUNTER-Customer', anchor: 'counter-customer' },
        { name: 'COUNTER-Vendor', anchor: 'counter-vendor' },
        { divider: true },
        { header: 'Deduplication' },
        { name: 'Double-Click-Removal', anchor: 'double-click-xxx' },
        { name: 'Double-Click-HTML', anchor: 'double-click-xxx' },
        { name: 'Double-Click-PDF', anchor: 'double-click-xxx' },
        { name: 'Double-Click-MISC', anchor: 'double-click-xxx' },
        { name: 'Double-Click-MIXED', anchor: 'double-click-xxx' },
        { name: 'Double-Click-Strategy', anchor: 'double-click-xxx' },
        { name: 'Double-Click-C-Field', anchor: 'double-click-xxx' },
        { name: 'Double-Click-L-Field', anchor: 'double-click-xxx' },
        { name: 'Double-Click-I-Field', anchor: 'double-click-xxx' },
        { divider: true },
        { header: 'Anonymization' },
        { name: 'Crypted-Fields', anchor: 'crypted-fields' },
        { divider: true },
        { header: 'Other' },
        { name: 'Traces-Level', anchor: 'traces-level' },
        { name: 'Reject-Files', anchor: 'reject-files' },
        { name: 'Clean-Only', anchor: 'clean-only' },
        { name: 'Force-Parser', anchor: 'force-parser' },
        { name: 'Geoip', anchor: 'geoip' },
        { name: 'ezPAARSE-Job-Notifications', anchor: 'ezpaarse-job-notifications' },
        { name: 'ezPAARSE-Enrich', anchor: 'ezpaarse-enrich' },
        { name: 'ezPAARSE-Predefined-Settings', anchor: 'ezpaarse-predefined-settings' },
        { name: 'ezPAARSE-Filter-Redirects', anchor: 'ezpaarse-filter-redirects' },
        { name: 'Disable-Filters', anchor: 'disable-filters' },
        { name: 'Force-ECField-Publisher', anchor: 'force-ecfield-publisher' },
        { name: 'Extract', anchor: 'extract' },
        { name: 'ezPAARSE-Middlewares', anchor: 'ezpaarse-middlewares' },
        { divider: true },
        { header: 'Metadata enrichment' },
        { name: 'Crossref-enrich', anchor: 'crossref' },
        { name: 'Crossref-ttl', anchor: 'crossref' },
        { name: 'Crossref-throttle', anchor: 'crossref' },
        { name: 'Crossref-paquet-size', anchor: 'crossref' },
        { name: 'Crossref-buffer-size', anchor: 'crossref' },
        { name: 'Sudoc-enrich', anchor: 'sudoc' },
        { name: 'Sudoc-ttl', anchor: 'sudoc' },
        { name: 'Sudoc-throttle', anchor: 'sudoc' },
        { name: 'Hal-enrich', anchor: 'hal' },
        { name: 'Hal-ttl', anchor: 'hal' },
        { name: 'Hal-throttle', anchor: 'hal' },
        { name: 'Istex-enrich', anchor: 'istex' },
        { name: 'Istex-ttl', anchor: 'istex' },
        { name: 'Istex-throttle', anchor: 'istex' }
      ],
      countries: [
        { fr: 'Afghanistan', en: 'Afghanistan' },
        { fr: 'Afrique du Sud', en: 'South Africa' },
        { fr: 'Albanie', en: 'Albania' },
        { fr: 'Algérie', en: 'Algeria' },
        { fr: 'Allemagne', en: 'Germany' },
        { fr: 'Andorre', en: 'Andorra' },
        { fr: 'Angola', en: 'Angola' },
        { fr: 'Antigua-et-Barbuda', en: 'Antigua and Barbuda' },
        { fr: 'Arabie saoudite', en: 'Saudi Arabia' },
        { fr: 'Argentine', en: 'Argentina' },
        { fr: 'Arménie', en: 'Armenia' },
        { fr: 'Australie', en: 'Australia' },
        { fr: 'Autriche', en: 'Austria' },
        { fr: 'Azerbaïdjan', en: 'Azerbaijan' },
        { fr: 'Bahamas', en: 'Bahamas' },
        { fr: 'Bahreïn', en: 'Bahrain' },
        { fr: 'Bangladesh', en: 'Bangladesh' },
        { fr: 'Barbade', en: 'Barbados' },
        { fr: 'Belgique', en: 'Belgium' },
        { fr: 'Belize', en: 'Belize' },
        { fr: 'Bénin', en: 'Benin' },
        { fr: 'Bhoutan', en: 'Bhutan' },
        { fr: 'Biélorussie', en: 'Belarus' },
        { fr: 'Birmanie', en: 'Burma' },
        { fr: 'Bolivie', en: 'Bolivia' },
        { fr: 'Bosnie-Herzégovine', en: 'Bosnia and Herzegovina' },
        { fr: 'Botswana', en: 'Botswana' },
        { fr: 'Brésil', en: 'Brazil' },
        { fr: 'Brunei', en: 'Brunei' },
        { fr: 'Bulgarie', en: 'Bulgaria' },
        { fr: 'Burkina Faso', en: 'Burkina Faso' },
        { fr: 'Burundi', en: 'Burundi' },
        { fr: 'Cambodge', en: 'Cambodia' },
        { fr: 'Cameroun', en: 'Cameroon' },
        { fr: 'Canada', en: 'Canada' },
        { fr: 'Cap-Vert', en: 'Cape Verde' },
        { fr: 'Centrafrique', en: 'Central African Republic' },
        { fr: 'Chili', en: 'Chile' },
        { fr: 'Chine', en: 'China' },
        { fr: 'Chypre', en: 'Cyprus' },
        { fr: 'Colombie', en: 'Colombia' },
        { fr: 'Comores', en: 'Comoros' },
        { fr: 'Congo', en: 'Congo' },
        { fr: 'République démocratique du Congo', en: 'Democratic Republic of Congo' },
        { fr: 'Îles Cook', en: 'Cook Islands' },
        { fr: 'Corée du Nord', en: 'North Korea' },
        { fr: 'Corée du Sud', en: 'South Korea' },
        { fr: 'Costa Rica', en: 'Costa Rica' },
        { fr: 'Côte d\'Ivoire', en: 'Ivory Coast' },
        { fr: 'Croatie', en: 'Croatia' },
        { fr: 'Cuba', en: 'Cuba' },
        { fr: 'Danemark', en: 'Denmark' },
        { fr: 'Djibouti', en: 'Djibouti' },
        { fr: 'République dominicaine', en: 'Dominican Republic' },
        { fr: 'Dominique', en: 'Dominica' },
        { fr: 'Égypte', en: 'Egypt' },
        { fr: 'Émirats arabes unis', en: 'United Arab Emirates' },
        { fr: 'Équateur', en: 'Ecuador' },
        { fr: 'Érythrée', en: 'Eritrea' },
        { fr: 'Espagne', en: 'Spain' },
        { fr: 'Estonie', en: 'Estonia' },
        { fr: 'États-Unis', en: 'United States' },
        { fr: 'Éthiopie', en: 'Ethiopia' },
        { fr: 'Fidji', en: 'Fiji' },
        { fr: 'Finlande', en: 'Finland' },
        { fr: 'France', en: 'France' },
        { fr: 'Gabon', en: 'Gabon' },
        { fr: 'Gambie', en: 'Gambia' },
        { fr: 'Géorgie', en: 'Georgia' },
        { fr: 'Ghana', en: 'Ghana' },
        { fr: 'Grèce', en: 'Greece' },
        { fr: 'Grenade', en: 'Grenada' },
        { fr: 'Guatemala', en: 'Guatemala' },
        { fr: 'Guinée', en: 'Guinea' },
        { fr: 'Guinée-Bissau', en: 'Guinea-Bissau' },
        { fr: 'Guinée équatoriale', en: 'Equatorial Guinea' },
        { fr: 'Guyana', en: 'Guyana' },
        { fr: 'Haïti', en: 'Haiti' },
        { fr: 'Honduras', en: 'Honduras' },
        { fr: 'Hongrie', en: 'Hungary' },
        { fr: 'Inde', en: 'India' },
        { fr: 'Indonésie', en: 'Indonesia' },
        { fr: 'Irak', en: 'Iraq' },
        { fr: 'Iran', en: 'Iran' },
        { fr: 'Irlande', en: 'Ireland' },
        { fr: 'Islande', en: 'Iceland' },
        { fr: 'Israël', en: 'Israel' },
        { fr: 'Italie', en: 'Italy' },
        { fr: 'Jamaïque', en: 'Jamaica' },
        { fr: 'Japon', en: 'Japan' },
        { fr: 'Jordanie', en: 'Jordan' },
        { fr: 'Kazakhstan', en: 'Kazakhstan' },
        { fr: 'Kenya', en: 'Kenya' },
        { fr: 'Kirghizistan', en: 'Kyrgyzstan' },
        { fr: 'Kiribati', en: 'Kiribati' },
        { fr: 'Koweït', en: 'Kuwait' },
        { fr: 'Laos', en: 'Laos' },
        { fr: 'Lesotho', en: 'Lesotho' },
        { fr: 'Lettonie', en: 'Latvia' },
        { fr: 'Liban', en: 'Lebanon' },
        { fr: 'Liberia', en: 'Liberia' },
        { fr: 'Libye', en: 'Libya' },
        { fr: 'Liechtenstein', en: 'Liechtenstein' },
        { fr: 'Lituanie', en: 'Lithuania' },
        { fr: 'Luxembourg', en: 'Luxembourg' },
        { fr: 'Macédoine', en: 'Macedonia' },
        { fr: 'Madagascar', en: 'Madagascar' },
        { fr: 'Malaisie', en: 'Malaysia' },
        { fr: 'Malawi', en: 'Malawi' },
        { fr: 'Maldives', en: 'Maldives' },
        { fr: 'Mali', en: 'Mali' },
        { fr: 'Malte', en: 'Malta' },
        { fr: 'Maroc', en: 'Morocco' },
        { fr: 'Îles Marshall', en: 'Marshall Islands' },
        { fr: 'Maurice', en: 'Mauritius' },
        { fr: 'Mauritanie', en: 'Mauritania' },
        { fr: 'Mexique', en: 'Mexico' },
        { fr: 'Micronésie', en: 'Micronesia' },
        { fr: 'Moldavie', en: 'Moldova' },
        { fr: 'Monaco', en: 'Monaco' },
        { fr: 'Mongolie', en: 'Mongolia' },
        { fr: 'Monténégro', en: 'Montenegro' },
        { fr: 'Mozambique', en: 'Mozambique' },
        { fr: 'Namibie', en: 'Namibia' },
        { fr: 'Nauru', en: 'Nauru' },
        { fr: 'Népal', en: 'Nepal' },
        { fr: 'Nicaragua', en: 'Nicaragua' },
        { fr: 'Niger', en: 'Niger' },
        { fr: 'Nigeria', en: 'Nigeria' },
        { fr: 'Niue', en: 'Niue' },
        { fr: 'Norvège', en: 'Norway' },
        { fr: 'Nouvelle-Zélande', en: 'New Zealand' },
        { fr: 'Oman', en: 'Oman' },
        { fr: 'Ouganda', en: 'Uganda' },
        { fr: 'Ouzbékistan', en: 'Uzbekistan' },
        { fr: 'Pakistan', en: 'Pakistan' },
        { fr: 'Palaos', en: 'Palau' },
        { fr: 'Palestine', en: 'Palestine' },
        { fr: 'Panama', en: 'Panama' },
        { fr: 'Papouasie-Nouvelle-Guinée', en: 'Papua New Guinea' },
        { fr: 'Paraguay', en: 'Paraguay' },
        { fr: 'Pays-Bas', en: 'Netherlands' },
        { fr: 'Pérou', en: 'Peru' },
        { fr: 'Philippines', en: 'Philippines' },
        { fr: 'Pologne', en: 'Poland' },
        { fr: 'Portugal', en: 'Portugal' },
        { fr: 'Qatar', en: 'Qatar' },
        { fr: 'Roumanie', en: 'Romania' },
        { fr: 'Royaume-Uni', en: 'United Kingdom' },
        { fr: 'Russie', en: 'Russia' },
        { fr: 'Rwanda', en: 'Rwanda' },
        { fr: 'Saint-Christophe-et-Niévès', en: 'Saint Kitts and Nevis' },
        { fr: 'Saint-Marin', en: 'San Marino' },
        { fr: 'Saint-Vincent-et-les Grenadines', en: 'Saint Vincent and the Grenadines' },
        { fr: 'Sainte-Lucie', en: 'Saint Lucia' },
        { fr: 'Îles Salomon', en: 'Solomon Islands' },
        { fr: 'Salvador', en: 'El Salvador' },
        { fr: 'Samoa', en: 'Samoa' },
        { fr: 'Sao Tomé-et-Principe', en: 'Sao Tome and Principe' },
        { fr: 'Sénégal', en: 'Senegal' },
        { fr: 'Serbie', en: 'Serbia' },
        { fr: 'Seychelles', en: 'Seychelles' },
        { fr: 'Sierra Leone', en: 'Sierra Leone' },
        { fr: 'Singapour', en: 'Singapore' },
        { fr: 'Slovaquie', en: 'Slovakia Slovakia' },
        { fr: 'Slovénie', en: 'Slovenia' },
        { fr: 'Somalie', en: 'Somalia' },
        { fr: 'Soudan', en: 'Sudan' },
        { fr: 'Soudan du Sud', en: 'South Sudan' },
        { fr: 'Sri Lanka', en: 'Sri Lanka' },
        { fr: 'Suède', en: 'Sweden' },
        { fr: 'Suisse', en: 'Switzerland' },
        { fr: 'Suriname', en: 'Suriname' },
        { fr: 'Swaziland', en: 'Swaziland' },
        { fr: 'Syrie', en: 'Syria' },
        { fr: 'Tadjikistan', en: 'Tajikistan' },
        { fr: 'Tanzanie', en: 'Tanzania' },
        { fr: 'Tchad', en: 'Chad' },
        { fr: 'République tchèque', en: 'Czech Republic' },
        { fr: 'Thaïlande', en: 'Thailand' },
        { fr: 'Timor oriental', en: 'East Timor' },
        { fr: 'Togo', en: 'Togo' },
        { fr: 'Tonga', en: 'Tonga' },
        { fr: 'Trinité-et-Tobago', en: 'Trinidad and Tobago' },
        { fr: 'Tunisie', en: 'Tunisia' },
        { fr: 'Turkménistan', en: 'Turkmenistan' },
        { fr: 'Turquie', en: 'Turkey' },
        { fr: 'Tuvalu', en: 'Tuvalu' },
        { fr: 'Ukraine', en: 'Ukraine' },
        { fr: 'Uruguay', en: 'Uruguay' },
        { fr: 'Vanuatu', en: 'Vanuatu' },
        { fr: 'Vatican', en: 'Vatican City' },
        { fr: 'Venezuela', en: 'Venezuela' },
        { fr: 'Viêt Nam', en: 'Vietnam' },
        { fr: 'Yémen', en: 'Yemen' },
        { fr: 'Zambie', en: 'Zambia' },
        { fr: 'Zimbabwe', en: 'Zimbabwe' }
      ]
    }
  },
  computed: {
    currentPredefinedSettings: {
      get () { return this.$store.state.process.currentPredefinedSettings; },
      set (newVal) { this.$store.dispatch('process/SET_CURRENT_PREDEFINED_SETTINGS', JSON.parse(JSON.stringify(newVal || this.predefinedSettings[1]))); }
    },
    predefinedSettings () {
      return this.$store.state.process.predefinedSettings;
    },
    allPredefinedSettings: {
      get () { return this.$store.state.process.allPredefinedSettings; }
    },
    customPredefinedSettings: {
      get () { return this.$store.state.process.customPredefinedSettings; }
    },
  },
  watch: {
    currentPredefinedSettings: {
      handler: function (newVal) {
        let changed;
        
        changed = this.predefinedSettings.find(p => {
          return p.fullName === newVal.fullName;
        });
        if (!changed) {
          changed = this.customPredefinedSettings.find(p => {
            return p.fullName === newVal.fullName;
          });
        }
        this.disabledButton = !!isEqual(changed, this.currentPredefinedSettings);
      },
      deep: true
    },
    saveFields: {
      handler: function (newVal) {
        if (this.saveFields.fullName.length > 0 && this.saveFields.country.en && this.saveFields.country.en.length > 0) this.disabledButtonSave = false;
        const exists = this.customPredefinedSettings.find(p => {
          return p.fullName === newVal.fullName;
        });
        if (exists) {
          this.disabledButtonSave = true;
          this.fullNameError = this.$t('ui.pages.process.settings.nameUnavailable');
        } else {
          this.fullNameError = null;
        }
      },
      deep: true
    }
  },
  methods: {
    removeOutputPlus (index) {
      this.currentPredefinedSettings.headers['Output-Fields'].plus.splice(index, 1);
    },
    removeOutputMinus (index) {
      this.currentPredefinedSettings.headers['Output-Fields'].minus.splice(index, 1);
    },
    removeCryptedField (value) {
      this.currentPredefinedSettings.headers['Crypted-Fields'].splice(value, 1);
    },
    removeEmail (index) {
      this.currentPredefinedSettings.headers['ezPAARSE-Job-Notifications'].plus.splice(index, 1);
    },
    addHeader (value) {
      if (value) {
        this.currentPredefinedSettings.headers.advancedHeaders.push({ header: value, value: null });
        this.header = null;
      }
    },
    removeHeader (header) {
      this.currentPredefinedSettings.headers.advancedHeaders.splice(header, 1);
    },
    updateCounterFormat () {
      if (this.currentPredefinedSettings.headers['COUNTER-Reports']) this.currentPredefinedSettings.headers['COUNTER-Format'] = 'tsv';
    },
    resetSettings () {
      const currentSettings = this.allPredefinedSettings.find(param => {
        return param.fullName === this.currentPredefinedSettings.fullName;
      });
      this.$store.dispatch('process/SET_CURRENT_PREDEFINED_SETTINGS', JSON.parse(JSON.stringify(currentSettings)));
    },
    informations (header) {
      const h = this.headers.find(h => {
        return header === h.name;
      });
      if (h) window.open(`https://ezpaarse.readthedocs.io/en/master/configuration/parametres.html#${h.anchor}`, '_blank');
    },
    saveCustomSettings () {
      let customPs = JSON.parse(JSON.stringify(this.currentPredefinedSettings));
      customPs.fullName = this.saveFields.fullName;
      customPs.country = this.saveFields.country.en;

      this.$store.dispatch('process/SAVE_CUSTOM_PREDEFINED_SETTINGS', customPs).then(res =>  {
        this.$store.dispatch('process/GET_PREDEFINED_SETTINGS').catch(err => {
          this.$store.dispatch('snacks/info', err.response.data.message ? this.$t(`ui.errors.${err.response.data.message}`) : this.$t(`ui.errors.error`));
        });

        this.currentPredefinedSettings = customPs;
        this.modal = false;
        this.disabledButton = true;
        this.disabledButtonSave = true;
        this.$store.dispatch('snacks/success', this.$t(`ui.pages.process.settings.paramsSaved`));
      });      
    },
    setCurrentToCustomPredefinedSettings () {
      if (this.displayCustomPredefinedSettings && this.customPredefinedSettings.length > 0) {
        this.currentPredefinedSettings = this.customPredefinedSettings[1];
      }
    },
    removeCustomPredefinedSettings (el) {
      this.$store.dispatch('process/REMOVE_CUSTOM_PREDEFINED_SETTINGS', { id: this.currentPredefinedSettings._id }).then(res => {
        this.$store.dispatch('snacks/success', this.$t('ui.pages.process.settings.deleted'));
        this.$store.dispatch('process/GET_PREDEFINED_SETTINGS').catch(err => {
          this.$store.dispatch('snacks/error', this.$t('ui.errors.error'));
        });
      }).catch(err => {
        this.$store.dispatch('snacks/error', this.$t('ui.errors.error'));
      });
    }
  }
}
</script>

<style>
.mTopM20 {
  margin-top: -20px;
}
</style>
