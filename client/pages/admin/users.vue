<template>
  <v-card>
    <v-toolbar class="secondary" dense dark card>
      <v-toolbar-title>
        {{ $t('ui.pages.admin.users.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm12>
          <v-form>
            <v-layout row wrap>
              <v-flex xs4 sm4 pr-2>
                <v-text-field
                  v-model="userid"
                  label="Email"
                  type="email"
                  required
                ></v-text-field>
              </v-flex>
              
              <v-flex xs4 sm4 pr-2>
                <v-text-field
                  v-model="password"
                  :label="$t('ui.password')"
                  type="password"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs4 sm4>
                <v-select
                  :items="groups"
                  v-model="group"
                  :label="$t('ui.pages.admin.users.group')"
                  :append-outer-icon="(!userid || !group || !password) ? '' : 'mdi-plus-circle'"
                  @click:append-outer="addUser"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-form>
          <v-divider></v-divider>
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
            :items="users"
            :no-data-text="$t('ui.pages.admin.users.noUsers')"
            :rows-per-page-text="$t('ui.pages.admin.users.usersPerPage')"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            sort-icon="mdi-menu-down"
            :search="search"
            :pagination.sync="pagination"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>
                <v-icon @click="removeUser(props.item.username)">mdi-delete</v-icon>
                <v-icon @click="dialog = true; currentUser = props.item">mdi-pencil</v-icon>
                {{ props.item.username }}
              </td>
              <td>{{ (props.item.group === 'admin' ? `${$t('ui.pages.admin.users.groups.admin')}` : `${$t('ui.pages.admin.users.groups.user')}`) }}</td>
            </template>
            <v-alert slot="no-results" :value="true" color="info" icon="mdi-alert-circle">
              {{ $t('ui.pages.admin.users.noUserFoundWithEmail', { search }) }}
            </v-alert>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>

    <v-dialog
      v-model="dialog"
      width="600"
      v-if="currentUser"
    >
      <v-card>
        <v-card-title
          class="headline teal white--text"
          primary-title
        >
          {{ $t('ui.pages.admin.users.updatingInformationOf', { email: currentUser.username }) }}
        </v-card-title>

        <v-card-text>
          <v-text-field
            :value="currentUser.username"
            v-model="currentUser.username"
            label="Email"
          ></v-text-field>
          <v-text-field
            :value="currentUser.password"
            v-model="currentUser.password"
            type="password"
            :label="$t('ui.password')"
          ></v-text-field>
          <v-select
            :items="groups"
            :value="(currentUser.group === 'admin' ? `${$t('ui.pages.admin.users.groups.admin')}` : `${$t('ui.pages.admin.users.groups.user')}`)"
            :label="$t('ui.pages.admin.users.group')"
          ></v-select>
        </v-card-text>

        <v-divider></v-divider>

         <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="dialog = false"><v-icon left>mdi-content-save</v-icon>{{ $t('ui.save') }}</v-btn>

          <v-btn color="error" @click="dialog = false"><v-icon left>mdi-close-circle</v-icon>{{ $t('ui.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      groups: [
        this.$t('ui.pages.admin.users.groups.admin'),
        this.$t('ui.pages.admin.users.groups.user')
      ],
      userid: null,
      password: null,
      group: null,
      dialog: false,
      search: '',
      pagination: {
        rowsPerPage: 10
      },
      headers: [
        {
          text: 'Email',
          align: 'left',
          sortable: true,
          value: 'username'
        },
        {
          text: this.$t('ui.pages.admin.users.group'),
          align: 'left',
          sortable: true,
          value: 'group'
        }
      ],
      currentUser: null
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
      await store.dispatch('GET_USERS_LIST')
    } catch (e) {
      return redirect('/')
    }
  },
  computed: {
    users () {
      return this.$store.state.users
    }
  },
  methods: {
    addUser () {
      const data = {
        userid: this.userid,
        group: (this.group === this.$t('ui.pages.admin.users.groups.admin') ? 'admin': 'user'),
        password: this.password
      }

      this.$store.dispatch('ADD_USER', data).then(res => {
        this.$store.dispatch('GET_USERS_LIST').catch(err => { 
          // TODO : Ajouter l'utilisateur au tableau des utilisateurs si catch
        })

        this.userid = null
        this.group = null
        this.password = null
      }).catch(err => {
        this.$store.dispatch('snacks/info', this.$i18n.t(`ui.errors.${err.response.data.message}`))
      })
      
    },
    removeUser (userid) {
      this.$store.dispatch('REMOVE_USER', userid).then(res => {
        this.$store.dispatch('GET_USERS_LIST').catch(err => { 
          // TODO : Ajouter l'utilisateur au tableau des utilisateurs si catch
        })
      }).catch(err => {
        this.$store.dispatch('snacks/info', this.$i18n.t(`ui.register.${err.response.data.message}`))
      })
    }
  }
}
</script>