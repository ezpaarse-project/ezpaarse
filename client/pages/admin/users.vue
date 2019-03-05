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
          <v-form @submit.prevent="addUser" method="post">
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
                  type="submit"
                  :items="items"
                  item-text="group"
                  item-value="abbr"
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
                <span v-if="props.item.username !== $auth.user.username">
                  <v-icon @click="removeUser(props.item.username)">mdi-delete</v-icon>
                  <v-icon @click="dialog = true; setCurrentUser(props.item)">mdi-pencil</v-icon>
                </span>
                <span v-if="props.item.username === $auth.user.username" :class="users.length > 1 ? 'itIsMe' : ''"></span>
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
      v-if="currentUser.data"
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
            @change="canSaveUser = true"
            :value="currentUser.data.username"
            v-model="currentUser.data.username"
            label="Email"
          ></v-text-field>

          <v-select
            @change="canSaveUser = true"
            v-model="currentUser.data.group"
            :items="items"
            item-text="group"
            item-value="abbr"
            :label="$t('ui.pages.admin.users.group')"
            return-object
            single-line
          ></v-select>
        </v-card-text>

        <v-divider></v-divider>

         <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="editUser(); dialog = false" :disabled="!canSaveUser"><v-icon left>mdi-content-save</v-icon>{{ $t('ui.save') }}</v-btn>

          <v-btn color="error" @click="dialog = false; canSaveUser = false"><v-icon left>mdi-close-circle</v-icon>{{ $t('ui.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  auth: true,
  middleware: [ 'admin' ],
  data () {
    return {
      items: [
        { group: this.$t('ui.pages.admin.users.groups.admin'), abbr: 'admin' },
        { group: this.$t('ui.pages.admin.users.groups.user'), abbr: 'user' }
      ],
      userid: null,
      password: null,
      group: null,
      dialog: false,
      canSaveUser: false,
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
      currentUser: {
        data: null,
        username: null
      }
    }
  },
  async fetch ({ store }) {
    try {
      await store.dispatch('GET_USERS_LIST')
    } catch (e) { }
  },
  computed: {
    users () {
      return this.$store.state.users
    }
  },
  methods: {
    addUser () {
      const data = {
        userid: this.userid.trim(),
        group: (this.group === this.$t('ui.pages.admin.users.groups.admin') ? 'admin': 'user').trim(),
        password: this.password.trim()
      }

      this.$store.dispatch('ADD_USER', data).then(res => {
        this.$store.dispatch('GET_USERS_LIST').catch(err => { 
          // TODO : Ajouter l'utilisateur au tableau des utilisateurs si catch
        })

        this.userid = null
        this.group = null
        this.password = null
      }).catch(err => {
        this.$store.dispatch('snacks/info', this.$t(`ui.errors.${err.response.data.message}`))
      })
    },
    setCurrentUser (user) {
      this.currentUser.data = {
        username: user.username,
        group: { 
          group: (user.group === 'admin' ? this.$t('ui.pages.admin.users.groups.admin') : this.$t('ui.pages.admin.users.groups.user')),
          abbr: (user.group === 'admin' ? 'admin' : 'user')
        }
      }
      this.currentUser.username = user.username
    },
    removeUser (userid) {
      if (userid === this.$auth.user.username)  {
        return this.$store.dispatch('snacks/info', this.$t(`ui.errors.cant_delete_yourself`))
      }
      
      this.$store.dispatch('REMOVE_USER', userid).then(res => {
        this.$store.dispatch('GET_USERS_LIST').catch(err => { 
          this.$store.dispatch('snacks/info', this.$t(`ui.errors.title`))
        })
      }).catch(err => {
        this.$store.dispatch('snacks/info', this.$t(`ui.errors.${err.response.data.message}`))
      })
    },
    editUser () {
       this.$store.dispatch('EDIT_USER', {
         userid: this.currentUser.username.trim(),
         username: this.currentUser.data.username.trim(),
         group: this.currentUser.data.group.abbr.trim()
       }).then(res => {
        this.$store.dispatch('snacks/info', this.$t(`ui.pages.admin.users.updatingInformationOf`, { email: this.currentUser.username }))

        this.$store.dispatch('GET_USERS_LIST').catch(err => { 
         this.$store.dispatch('snacks/info', this.$t(`ui.errors.title`))
        })
      }).catch(err => {
        this.$store.dispatch('snacks/info', this.$t(`ui.errors.${err.response.data.message}`))
      })
    }
  }
}
</script>

<style scope>
.itIsMe {
  margin-left: 55px;
}
</style>