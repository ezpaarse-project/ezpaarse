<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    fixed
    clipped
    left
    disable-route-watcher
    :mini-variant="mini"
    width="300"
  >
    <v-list class="text-center">
      <v-btn
        v-for="link in links"
        :key="link.icon"
        class="mx-2"
        icon
        target="_blank"
        :title="link.title"
        :href="link.href"
      >
        <v-icon dark v-text="link.icon" />
      </v-btn>

      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            class="mx-2"
            icon
            target="_blank"
            href="mailto:ezteam@couperin.org"
            v-on="on"
          >
            <v-icon dark>
              mdi-email
            </v-icon>
          </v-btn>
        </template>
        <span v-text="'ezteam@couperin.org'" />
      </v-tooltip>
    </v-list>

    <v-divider />

    <v-list>
      <v-list-item
        router
        :to="{ path: '/profile' }"
      >
        <v-list-item-avatar>
          <v-icon large>
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-if="$auth.loggedIn" class="body-2" v-text="$auth.user.username" />
          <v-list-item-title v-else v-text="$t('ui.drawer.notConnected')" />
        </v-list-item-content>
        <v-list-item-icon v-if="$auth.loggedIn">
          <v-tooltip right>
            <template #activator="{ on }">
              <v-btn
                text
                icon
                v-on="on"
                @click="logout"
              >
                <v-icon>mdi-logout</v-icon>
              </v-btn>
            </template>
            <span v-text="$t('ui.drawer.signout')" />
          </v-tooltip>
        </v-list-item-icon>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list pt-0>
      <v-list-item
        v-if="$auth.loggedIn"
        router
        :to="{ path: '/process' }"
        ripple
      >
        <v-list-item-icon>
          <v-icon>mdi-cloud-upload</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="body-2" v-text="$t('ui.drawer.processLogs')" />
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        v-if="$auth.loggedIn"
        router
        :to="{ path: '/format' }"
        ripple
      >
        <v-list-item-icon>
          <v-icon>mdi-file-find</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="body-2" v-text="$t('ui.drawer.designLogFormat')" />
        </v-list-item-content>
      </v-list-item>

      <v-list-group
        v-if="$auth.user && $auth.user.group === 'admin'"
        no-action
        prepend-icon="mdi-cog"
        append-icon="mdi-chevron-down"
        :value="$nuxt.$route.name && $nuxt.$route.name.indexOf('admin') !== -1"
      >
        <template #activator>
          <v-list-item-title class="body-2" v-text="$t('ui.drawer.admin.administration')" />
          <v-list-item-icon
            v-if="hasAvailableUpdates"
          >
            <v-icon>mdi-alert-circle</v-icon>
          </v-list-item-icon>
        </template>

        <v-list-item
          router
          :to="{ path: '/admin/platforms' }"
          ripple
        >
          <v-list-item-title class="body-2" v-text="$t('ui.drawer.admin.platforms')" />
          <v-list-item-icon v-if="hasPlatformsUpdates">
            <v-icon>mdi-alert-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-icon>
            <v-icon>mdi-format-list-bulleted-square</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item
          router
          :to="{ path: '/admin/middlewares' }"
          ripple
        >
          <v-list-item-title class="body-2" v-text="$t('ui.drawer.admin.middlewares')" />
          <v-list-item-icon v-if="hasMiddlewaresUpdates">
            <v-icon>mdi-alert-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-icon>
            <v-icon>mdi-middleware-outline</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item
          router
          :to="{ path: '/admin/updates' }"
          ripple
        >
          <v-list-item-title class="body-2" v-text="$t('ui.drawer.admin.updates')" />
          <v-list-item-icon v-if="hasGeneralUpdates">
            <v-icon>mdi-alert-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-icon>
            <v-icon>mdi-cached</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item
          router
          :to="{ path: '/admin/users' }"
          ripple
        >
          <v-list-item-content>
            <v-list-item-title class="body-2" v-text="$t('ui.drawer.admin.users')" />
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item
          router
          :to="{ path: '/admin/jobs' }"
          ripple
        >
          <v-list-item-content>
            <v-list-item-title class="body-2" v-text="$t('ui.drawer.admin.jobs')" />
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-cog-clockwise</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>

      <v-list-item
        router
        href="https://ezpaarse-project.github.io/ezpaarse/"
        target="_blank"
        ripple
      >
        <v-list-item-icon>
          <v-icon>mdi-text-box-multiple</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="body-2" v-text="$t('ui.drawer.documentation')" />
        </v-list-item-content>
      </v-list-item>

      <v-list-group no-action append-icon="mdi-chevron-down" prepend-icon="mdi-translate">
        <template #activator>
          <v-list-item-title class="body-2" v-text="$t('ui.language')" />
        </template>

        <v-list-item
          v-for="locale in $i18n.locales"
          :key="locale.code"
          @click="$i18n.setLocale(locale.code)"
        >
          <v-list-item-title class="body-2" v-text="locale.name" />
          <v-list-item-icon>
            <img width="24" :src="require(`@/static/img/${locale.code}.png`)">
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>

      <v-list-item
        router
        :to="{ path: '/feedback' }"
        ripple
      >
        <v-list-item-icon>
          <v-icon>mdi-message-alert</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="body-2" v-text="$t('ui.drawer.feedback')" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template #append>
      <div class="pa-2 text-center">
        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              small
              text
              icon
              v-on="on"
              @click="$vuetify.theme.dark = !$vuetify.theme.dark"
            >
              <v-icon v-if="$vuetify.theme.dark">
                mdi-white-balance-sunny
              </v-icon>
              <v-icon v-else>
                mdi-weather-night
              </v-icon>
            </v-btn>
          </template>
          <span v-if="$vuetify.theme.dark" v-text="$t('ui.theme.light')" />
          <span v-else v-text="$t('ui.theme.dark')" />
        </v-tooltip>

        <v-spacer />

        <v-btn
          small
          outlined
          class="ma-3"
          href="https://github.com/ezpaarse-project/ezpaarse#readme"
          target="_blank"
        >
          Version: {{ appInfos.version }}
          <v-icon right>
            mdi-github
          </v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      mini: false,
      links: [
        { icon: 'mdi-home', href: 'http://www.ezpaarse.org/' },
        { icon: 'mdi-comment-text-outline', href: 'http://blog.ezpaarse.org/' },
        { icon: 'mdi-youtube', href: 'https://www.youtube.com/channel/UCcR-0UE9WjYiwS4fMG2T4tQ' }
      ]
    };
  },
  computed: {
    drawer: {
      get () { return this.$store.state.drawer; },
      set (newVal) { this.$store.dispatch('SET_DRAWER', newVal); }
    },
    appInfos () {
      return this.$store.state.appInfos;
    },
    hasAvailableUpdates () {
      return this.hasPlatformsUpdates || this.hasGeneralUpdates || this.hasMiddlewaresUpdates;
    },
    hasPlatformsUpdates () {
      return this.$store.getters.hasPlatformsUpdates;
    },
    hasMiddlewaresUpdates () {
      return this.$store.getters.hasMiddlewaresUpdates;
    },
    hasGeneralUpdates () {
      return this.$store.getters.hasGeneralUpdates;
    }
  },
  methods: {
    async logout () {
      await this.$auth.logout();
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.bottomList {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

</style>
