<template>
  <v-card>
    <v-toolbar class="secondary" dense dark flat>
      <v-toolbar-title v-text="$t('ui.pages.admin.users.title')" />
      <v-spacer />
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn fab text small icon v-on="on" @click="openAddDialog">
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <span v-text="$t('ui.pages.admin.users.addUser')" />
      </v-tooltip>
    </v-toolbar>

    <v-card-text>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 sm12>
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
              :search="search"
              :footer-props="footerProps"
              :items-per-page="itemsPerPage"
              class="elevation-1"
            >
              <template v-slot:item.group="{ item }">
                {{ $t(`ui.pages.admin.users.groups.${item.group}`) }}
              </template>
              <template v-slot:item.action="{ item }">
                <v-icon
                  v-if="$auth.user.username !== item.username"
                  small
                  @click="removeDialog = true;selectedUser = item.username;"
                >
                  mdi-delete
                </v-icon>
                <v-icon
                  v-if="$auth.user.username !== item.username"
                  small
                  @click="dialog = true; user = item;"
                >
                  mdi-pencil
                </v-icon>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>

    <v-dialog
      v-model="dialog"
      width="600"
      @keydown.esc="dialog = false"
    >
      <v-card>
        <v-card-title class="title primary white--text">
          <span
            v-if="user && user.password"
            v-text="$t('ui.pages.admin.users.editUser', { email: user.username })"
          />
          <span v-else v-text="$t('ui.pages.admin.users.addUser')" />
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="currentUser.username"
            label="Email"
          />

          <v-text-field
            v-if="!currentUser._id"
            v-model="currentUser.password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            class="input-group--focused"
            @click:append="showPassword = !showPassword"
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
          <v-btn class="body-2" text @click="dialog = false" v-text="$t('ui.close')" />
          <v-btn
            class="body-2"
            color="primary"
            :disabled="disabled"
            @click="saveOrEdit()"
            v-text="$t('ui.save')"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="removeDialog"
      max-width="600"
      @keydown.esc="removeDialog = false"
    >
      <v-card>
        <v-card-title class="headline" v-text="$t('ui.pages.admin.users.deletingUser')" />
        <v-card-text v-html="$t('ui.pages.admin.users.confirmSentence', { selectedUser })" />
        <v-card-actions>
          <v-spacer />
          <v-btn class="body-2" text @click="removeDialog = false" v-text="$t('ui.close')" />
          <v-btn
            class="body-2"
            color="primary"
            @click="removeUser(selectedUser)"
            v-text="$t('ui.remove')"
          />
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
      itemsPerPage: 10,
      showPassword: false
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
        },
        {
          text: 'Actions',
          value: 'action',
          sortable: false,
          align: 'right',
          width: 20
        }
      ];
    },
    footerProps () {
      return {
        itemsPerPageText: this.$t('ui.pages.admin.users.usersPerPage'),
        itemsPerPageOptions: [this.itemsPerPage, 30, 50, -1]
      };
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
        this.disabled = isEqual(this.currentUser, this.user);

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
