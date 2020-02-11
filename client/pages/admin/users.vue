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
      <v-spacer />
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn fab flat small icon v-on="on" @click="openAddDialog">
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </template>
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

        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="users"
            :no-data-text="$t('ui.pages.admin.users.noUsers')"
            :no-results-text="$t('ui.pages.admin.users.noMatchingUser')"
            :rows-per-page-text="$t('ui.pages.admin.users.usersPerPage')"
            :search="search"
            :pagination.sync="pagination"
            class="elevation-1"
          >
            <template
              v-slot:items="props"
            >
              <td class="layout justify-center">
                <template v-if="$auth.user.username !== props.item.username">
                  <v-icon small @click="removeDialog = true; selectedUser = props.item.username;">
                    mdi-delete
                  </v-icon>
                  <v-icon small @click="dialog = true; user = props.item;">
                    mdi-pencil
                  </v-icon>
                </template>
              </td>
              <td>
                {{ props.item.username }}
              </td>
              <td>{{ $t(`ui.pages.admin.users.groups.${props.item.group}`) }}</td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>

    <v-dialog
      v-model="dialog"
      width="600"
      @keydown.esc="dialog = false"
    >
      <v-card>
        <v-card-title class="title primary white--text">
          <span v-if="user && user.password">
            {{ $t('ui.pages.admin.users.editUser', { email: user.username }) }}
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
          <v-btn color="primary" :disabled="disabled" @click="saveOrEdit()">
            {{ $t('ui.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="removeDialog"
      max-width="600"
      @keydown.esc="removeDialog = false"
    >
      <v-card>
        <v-card-title class="headline">{{ $t('ui.pages.admin.users.deletingUser') }}</v-card-title>
        <v-card-text v-html="$t('ui.pages.admin.users.confirmSentence', { selectedUser })" />
        <v-card-actions>
          <v-spacer />
          <v-btn flat @click="removeDialog = false">
            {{ $t('ui.close') }}
          </v-btn>
          <v-btn color="primary" @click="removeUser(selectedUser)">
            {{ $t('ui.remove') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import isEqual from 'lodash.isequal';
import get from 'lodash.get';

export default {
  auth: true,
  middleware: ['admin'],
  data () {
    return {
      user: {},
      currentUser: {},
      dialog: false,
      removeDialog: false,
      selectedUser: null,
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
      await store.dispatch('snacks/error', 'ui.errors.cannotLoadUsersList');
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
        const { _id: userId } = this.user;
        if (userId) {
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
    openAddDialog () {
      this.dialog = true;
      this.user = {
        username: null,
        password: null,
        group: null
      };
    },
    async saveOrEdit () {
      const { _id: userId } = this.user;
      if (userId) {
        const data = {
          userid: this.user.username,
          username: this.currentUser.username,
          group: this.currentUser.group
        };

        try {
          await this.$store.dispatch('EDIT_USER', data);
        } catch (e) {
          const message = get(e, 'response.data.message', 'error');
          this.$store.dispatch('snacks/error', `ui.errors.${message}`);
          return;
        }

        this.$store.dispatch('snacks/info', 'ui.pages.admin.users.userUpdated');

        this.user = {};
      } else {
        const data = {
          userid: this.currentUser.username,
          group: this.currentUser.group,
          password: this.currentUser.password
        };

        try {
          await this.$store.dispatch('ADD_USER', data);
        } catch (e) {
          const message = get(e, 'response.data.message', 'error');
          this.$store.dispatch('snacks/error', `ui.errors.${message}`);
          return;
        }
      }

      try {
        await this.$store.dispatch('GET_USERS_LIST');
      } catch (e) {
        const message = get(e, 'response.data.message', 'cannotLoadUsersList');
        this.$store.dispatch('snacks/error', `ui.errors.${message}`);
        return;
      }

      this.dialog = false;
      this.currentUser = {};
    },
    async removeUser (userid) {
      if (userid === this.$auth.user.username) {
        this.$store.dispatch('snacks/error', 'ui.errors.cannotDeleteYourself');
        return;
      }

      try {
        await this.$store.dispatch('REMOVE_USER', userid);
        this.removeDialog = false;
        this.selectedUser = null;
        this.$store.dispatch('snacks/success', 'ui.pages.admin.users.userDeleted');
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.cannotRemoveUser');
        return;
      }

      try {
        await this.$store.dispatch('GET_USERS_LIST');
      } catch (e) {
        this.$store.dispatch('snacks/error', 'ui.errors.cannotLoadUsersList');
      }
    }
  }
};
</script>
