<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    fixed
    clipped
    left
    disable-route-watcher
    :mini-variant="mini"
  >

    <v-layout
      v-if="!mini"
      row
      justify-center
    >
      <v-btn
        v-for="link in links"
        :key="link.icon"
        icon
        target="_blank"
        :title="link.title"
        :href="link.href"
      >
        <v-icon>{{ link.icon }}</v-icon>
      </v-btn>
    </v-layout>

    <v-divider />

    <v-list>
      <v-list-tile
        avatar
        tag="div"
        router
        :to="{ path: '/profile' }"
      >
        <v-list-tile-avatar>
          <v-icon large>
            mdi-account-circle
          </v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-if="$auth.loggedIn">
            {{ $auth.user.username }}
          </v-list-tile-title>
          <v-list-tile-title v-else>
            {{ $t('ui.drawer.notConnected') }}
          </v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action v-if="$auth.loggedIn">
          <v-tooltip right>
            <template>
              <v-btn flat icon slot="activator" @click="logout">
                <v-icon>mdi-logout</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('ui.drawer.signout') }}</span>
          </v-tooltip>
        </v-list-tile-action>
      </v-list-tile>

      <v-divider />

      <v-list-tile
        v-if="$auth.loggedIn"
        router
        :to="{ path: '/process' }"
        ripple
      >
        <v-list-tile-action>
          <v-icon>mdi-cloud-upload</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ $t('ui.drawer.processLogs') }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile
        v-if="$auth.loggedIn"
        router
        :to="{ path: '/format' }"
        ripple
      >
        <v-list-tile-action>
          <v-icon>mdi-file-find</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ $t('ui.drawer.designLogFormat') }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-group
        v-if="!mini && $auth.user && $auth.user.group === 'admin'"
        prepend-icon="mdi-settings"
        append-icon="mdi-chevron-down"
      >
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('ui.drawer.admin.administration') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action
              v-if="hasAvailableUpdates"
            >
              <v-icon>mdi-alert-circle</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </template>

        <v-list-tile
          router
          :to="{ path: '/admin/platforms' }"
          ripple
        >
          <v-list-tile-title>{{ $t('ui.drawer.admin.platforms') }}</v-list-tile-title>
          <v-list-tile-action v-if="hasPlatformsUpdates">
            <v-icon>mdi-alert-circle</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile
          router
          :to="{ path: '/admin/updates' }"
          ripple
        >
          <v-list-tile-title>{{ $t('ui.drawer.admin.updates') }}</v-list-tile-title>
          <v-list-tile-action
            v-if="hasGeneralUpdates"
          >
            <v-icon>mdi-alert-circle</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile
          router
          :to="{ path: '/admin/users' }"
          ripple
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('ui.drawer.admin.users') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          router
          :to="{ path: '/admin/jobs' }"
          ripple
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('ui.drawer.admin.jobs') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-group>

      <v-list-tile
        router
        href="https://ezpaarse.readthedocs.io/en/master/"
        target="_blank"
        ripple
      >
        <v-list-tile-action>
          <v-icon>mdi-library-books</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ $t('ui.drawer.documentation') }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-group
        v-if="!mini"
        prepend-icon="mdi-translate"
        append-icon="mdi-chevron-down"
      >
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('ui.language') }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>

        <v-list-tile
          v-for="lang in locales"
          :key="lang.value"
          @click="$i18n.locale = lang.value"
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ lang.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-group>

      <v-list-tile
        router
        :to="{ path: '/feedback' }"
        ripple
      >
        <v-list-tile-action>
          <v-icon>mdi-message-alert</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ $t('ui.drawer.feedback') }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-divider />

    <v-list class="bottomList">
       <v-list-tile>
        <v-list-tile-content class="text-xs-center">
          <v-list-tile-sub-title>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn small flat icon v-on="on" @click="dark = !dark">
                  <v-icon v-if="dark">mdi-white-balance-sunny</v-icon>
                  <v-icon v-else>mdi-weather-night</v-icon>
                </v-btn>
              </template>
              <span v-if="dark">{{ $t('ui.theme.light') }}</span>
              <span v-else>{{ $t('ui.theme.dark') }}</span>
            </v-tooltip>
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile>
        <v-list-tile-content class="text-xs-center">
          <v-list-tile-sub-title v-if="appInfos.version">
            <v-btn
              small
              outline
              class="ma-0"
              href="https://github.com/ezpaarse-project/ezpaarse#readme"
              target="_blank"
            >
              Version: {{ appInfos.version }}
              <v-icon right>
                mdi-github-circle
              </v-icon>
            </v-btn>
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      mini: false,
      locales: [
        { name: 'Français', value: 'fr' },
        { name: 'English', value: 'en' }
      ],
      links: [
        { icon: 'mdi-home', href: 'http://www.ezpaarse.org/' },
        { icon: 'mdi-email', href: 'mailto:ezpaarse@couperin.org' },
        { icon: 'mdi-twitter-box', href: 'https://twitter.com/ezpaarse' },
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
      return this.hasPlatformsUpdates || this.hasGeneralUpdates;
    },
    hasPlatformsUpdates () {
      return this.$store.getters.hasPlatformsUpdates;
    },
    hasGeneralUpdates () {
      return this.$store.getters.hasGeneralUpdates;
    },
    dark: {
      get () { return this.$store.state.dark; },
      set (newVal) { this.$store.dispatch('SET_DARK', newVal) }
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
