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
                  v-model="email"
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
                  :append-outer-icon="(!email || !group || !password) ? '' : 'mdi-plus-circle'"
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
                <v-icon @click="removeUser(props.item.email)">mdi-delete</v-icon>
                <v-icon @click="dialog = true; currentUser = props.item">mdi-pencil</v-icon>
                {{ props.item.email }}
              </td>
              <td>{{ props.item.role }}</td>
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
          {{ $t('ui.pages.admin.users.updatingInformationOf', { email: currentUser.email }) }}
        </v-card-title>

        <v-card-text>
          <v-text-field
            :value="currentUser.email"
            v-model="currentUser.email"
            label="Email"
          ></v-text-field>
          <v-text-field
            :value="currentUser.password"
            v-model="currentUser.password"
            type="password"
            :label="$t('ui.pages.admin.users.password')"
          ></v-text-field>
          <v-select
            :items="groups"
            v-model="currentUser.role"
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
      email: null,
      password: null,
      group: null,
      dialog: false,
      currentPlatform: false,
      search: '',
      pagination: {
        rowsPerPage: 10
      },
      headers: [
        {
          text: 'Email',
          align: 'left',
          sortable: true,
          value: 'email'
        },
        {
          text: this.$t('ui.pages.admin.users.group'),
          align: 'left',
          sortable: true,
          value: 'role'
        }
      ],
      users: [
        {
          email: 'john.doe@email.com',
          role: this.$t('ui.pages.admin.users.groups.admin'),
          password: ''
        },
        {
          email: 'jane.doe@email.com',
          role: this.$t('ui.pages.admin.users.groups.user'),
          password: ''
        }
      ],
      currentUser: null
    }
  },
  methods: {
    addUser () {
      this.users.push({
        email: this.email,
        role: this.group,
        password: this.password
      })
      this.email = null
      this.group = null
      this.password = null
    },
    removeUser (emailUser) {
      this.users = this.users.filter(u => {
        return u.email !== emailUser
      })
      /* eslint-disable-next-line */
      console.log(this.users)
    }
  }
}
</script>
