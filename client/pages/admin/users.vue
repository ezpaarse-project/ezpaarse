<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dense
      dark
      card
    >
      <v-toolbar-title>
        {{ $t('ui.pages.admin.users.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          sm12
        >
          <v-form
            method="post"
            @submit.prevent="addUser"
          >
            <v-layout
              row
              wrap
            >
              <v-flex
                xs4
                sm4
                pr-2
              >
                <v-text-field
                  v-model="userid"
                  label="Email"
                  type="email"
                  required
                  autocomplete="off"
                />
              </v-flex>

              <v-flex
                xs4
                sm4
                pr-2
              >
                <v-text-field
                  v-model="password"
                  :label="$t('ui.password')"
                  type="password"
                  required
                  autocomplete="off"
                />
              </v-flex>

              <v-flex
                xs4
                sm4
              >
                <v-select
                  v-model="group"
                  type="submit"
                  :items="items"
                  item-text="group"
                  item-value="abbr"
                  :label="$t('ui.pages.admin.users.group')"
                  :append-outer-icon="(!userid || !group || !password) ? '' : 'mdi-plus-circle'"
                  @click:append-outer="addUser"
                  required
                  autocomplete="off"
                />
              </v-flex>
            </v-layout>
          </v-form>
          <v-divider />
        </v-flex>

        <v-flex
          xs12
          sm12
        >
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t(('ui.search'))"
            single-line
          />
        </v-flex>

        <v-flex
          xs12
          sm12
        >
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
            <template
              slot="items"
              slot-scope="props"
            >
              <td>
                <span v-if="props.item.username !== $auth.user.username">
                  <v-icon @click="removeUser(props.item.username)">
                    mdi-delete
                  </v-icon>
                  <v-icon @click="dialog = true; setCurrentUser(props.item)">
                    mdi-pencil
                  </v-icon>
                </span>
                <span
                  v-if="props.item.username === $auth.user.username"
                  :class="users.length > 1 ? 'itIsMe' : ''"
                />
                {{ props.item.username }}
              </td>
              <td>{{ $t(`ui.pages.admin.users.groups.${props.item.group}`) }}</td>
            </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="info"
              icon="mdi-alert-circle"
            >
              {{ $t('ui.pages.admin.users.noUserFoundWithEmail', { search }) }}
            </v-alert>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>

    <v-dialog
      v-if="currentUser.data"
      v-model="dialog"
      width="600"
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
            v-model="currentUser.data.username"
            :value="currentUser.data.username"
            label="Email"
            @change="canSaveUser = true"
          />

          <v-select
            v-model="currentUser.data.group"
            :items="items"
            item-text="group"
            item-value="abbr"
            :label="$t('ui.pages.admin.users.group')"
            return-object
            single-line
            @change="canSaveUser = true"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="success"
            :disabled="!canSaveUser"
            @click="editUser(); dialog = false"
          >
            <v-icon left>
              mdi-content-save
            </v-icon>{{ $t('ui.save') }}
          </v-btn>

          <v-btn
            color="error"
            @click="dialog = false; canSaveUser = false"
          >
            <v-icon left>
              mdi-close-circle
            </v-icon>{{ $t('ui.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  auth: true,
  middleware: ['admin'],
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
    };
  },
  async fetch ({ store }) {
    try {
      await store.dispatch('GET_USERS_LIST');
    } catch (e) {
      await store.dispatch('snacks/error', `E${e.response.status} - ${this.$t('ui.errors.cannotLoadUsersList')}`);
    }
  },
  computed: {
    users () {
      return this.$store.state.users;
    }
  },
  methods: {
    addUser () {
      const data = {
        userid: this.userid.trim(),
        group: (this.group === this.$t('ui.pages.admin.users.groups.admin') ? 'admin' : 'user').trim(),
        password: this.password.trim()
      };

      this.$store.dispatch('ADD_USER', data).then(() => {
        this.$store.dispatch('GET_USERS_LIST').catch(err => {
          this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotLoadUsersList')}`);
        });

        this.userid = null;
        this.group = null;
        this.password = null;
      }).catch(err => {
        this.$store.dispatch('snacks/error', `E${err.response.status} - $${err.response.data.message}`);
      });
    },
    setCurrentUser (user) {
      this.currentUser.data = {
        username: user.username,
        group: {
          group: (user.group === 'admin' ? this.$t('ui.pages.admin.users.groups.admin') : this.$t('ui.pages.admin.users.groups.user')),
          abbr: (user.group === 'admin' ? 'admin' : 'user')
        }
      };
      this.currentUser.username = user.username;
    },
    removeUser (userid) {
      if (userid === this.$auth.user.username) {
        return this.$store.dispatch('snacks/error', this.$t('ui.errors.cannotDeleteYourself'));
      }

      this.$store.dispatch('REMOVE_USER', userid).then(() => {
        this.$store.dispatch('GET_USERS_LIST').catch(err => {
          this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotLoadUsersList')}`);
        });
      }).catch(err => {
        this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotRemoveUser')}`);
      });
      return false;
    },
    editUser () {
      this.$store.dispatch('EDIT_USER', {
        userid: this.currentUser.username.trim(),
        username: this.currentUser.data.username.trim(),
        group: this.currentUser.data.group.abbr.trim()
      }).then(() => {
        this.$store.dispatch('snacks/info', this.$t('ui.pages.admin.users.updatingInformationOf', {
          email: this.currentUser.username
        }));

        this.$store.dispatch('GET_USERS_LIST').catch(err => {
          this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotLoadUsersList')}`);
        });
      }).catch(err => this.$store.dispatch('snacks/error', `E${err.response.status} - $${err.response.data.message}`));
    }
  }
};
</script>

<style scope>
.itIsMe {
  margin-left: 55px;
}
</style>
