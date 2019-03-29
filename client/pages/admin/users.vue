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
      <v-spacer></v-spacer>
      <v-tooltip left>
        <v-btn fab flat small icon slot="activator" @click="dialog = true; user = {
          username: null,
          password: null,
          group: null
        }">
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
        <span>{{ $t('ui.pages.admin.users.addUser') }}</span>
      </v-tooltip>
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
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('ui.search')"
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
              <td class="layout justify-center">
                <v-icon v-if="$auth.user.username !== props.item.username" small @click="removeUser(props.item.username)">
                  mdi-delete
                </v-icon>
                <v-icon v-if="$auth.user.username !== props.item.username" small @click="dialog = true; user = props.item;">
                  mdi-pencil
                </v-icon>
              </td>
              <td>
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
      @keydown.esc="dialog = false"
      v-model="dialog"
      width="600"
    >
      <v-card>
        <v-card-title
          class="headline teal white--text"
          primary-title
        >
          <span v-if="user && user.password">
            {{ $t('ui.pages.admin.users.updatingInformationOf', { email: user.username }) }}
          </span>
          <span v-else>
            {{ $t('ui.pages.admin.users.addUser') }}
          </span>
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="currentUser.username"
            label="Email"
          />

          <v-text-field
            v-if="!currentUser._id"
            v-model="currentUser.password"
            label="Password"
          />

          <v-select
            v-model="currentUser.group"
            :items="items"
            item-text="group"
            item-value="abbr"
            :label="$t('ui.pages.admin.users.group')"
            single-line
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn flat @click="dialog = false">
            {{ $t('ui.close') }}
          </v-btn>
          <v-btn color="primary" @click="saveOrEdit(); dialog = false" :disabled="disabled">
            {{ $t('ui.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import isEqual from 'lodash.isequal';

export default {
  auth: true,
  middleware: ['admin'],
  data () {
    return {
      user: {},
      currentUser: {},
      dialog: false,
      disabled: true,
      search: '',
      pagination: {
        rowsPerPage: 10
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
    },
    headers () {
      return [
        {
          sortable: false,
          width: 10
        },
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
      ];
    },
    items () {
      return [
        { group: this.$t('ui.pages.admin.users.groups.admin'), abbr: 'admin' },
        { group: this.$t('ui.pages.admin.users.groups.user'), abbr: 'user' }
      ];
    }
  },
  watch: {
    user () {
      this.currentUser = JSON.parse(JSON.stringify(this.user));
    },
    currentUser: {
      handler () {
        if (this.user._id) {
          this.disabled = isEqual(this.currentUser, this.user);
        } else {
          this.disabled = isEqual(this.currentUser, this.user);
        }

        if (this.currentUser.username) {
          this.currentUser.username = this.currentUser.username.trim();
        }
        if (this.currentUser.password) {
          this.currentUser.password = this.currentUser.password.trim();
        }
        if (this.currentUser.group) {
          this.currentUser.group = this.currentUser.group.trim();
        }
      },
      deep: true
    }
  },
  methods: {
    saveOrEdit () {
      if (this.user._id) {
        this.$store.dispatch('EDIT_USER', {
          userid: this.user.username,
          username: this.currentUser.username,
          group: this.currentUser.group
        }).then(() => {
          this.$store.dispatch('snacks/info', this.$t('ui.pages.admin.users.updatingInformationOf', {
            email: this.currentUser.username
          }));

          this.$store.dispatch('GET_USERS_LIST').catch(err => {
            return this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotLoadUsersList')}`);
          });

          this.currentUser = {};
          return this.user = {};
        }).catch(err => {
          return this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t(`ui.errors.${err.response.data.message}`)}`);
        });
      }

      if (!this.user._id) {
        const data = {
          userid: this.currentUser.username,
          group: this.currentUser.group,
          password: this.currentUser.password
        };
        this.$store.dispatch('ADD_USER', data).then(() => {
          this.$store.dispatch('GET_USERS_LIST').catch(err => {
            return this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t('ui.errors.cannotLoadUsersList')}`);
          });

          return this.currentUser = {};
        }).catch(err => {
          return this.$store.dispatch('snacks/error', `E${err.response.status} - ${this.$t(`ui.errors.${err.response.data.message}`)}`);
        });
      }
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
    }
  }
};
</script>