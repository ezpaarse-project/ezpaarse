<template>
  <v-navigation-drawer app fixed disable-route-watcher :mini-variant="mini" v-model="drawer">
    <v-list dark class="pa-1 teal" v-if="!mini">
      <v-list-tile avatar tag="div">
        <v-list-tile-avatar>
          <img src="~/assets/img/logo-white.svg" />
        </v-list-tile-avatar>
        
        <v-list-tile-content>
          <v-list-tile-title>ezPAARSE</v-list-tile-title>
          
          <v-list-tile-sub-title v-if="appVersion">
            <v-menu>
              <span flat slot="activator">
                Version: {{ appVersion }} <v-icon dark>mdi-menu-down</v-icon>
              </span>

              <v-list>
                <v-list-tile href="https://github.com/ezpaarse-project/ezpaarse#readme" target="_blank">
                  <v-list-tile-action>
                    <v-icon>mdi-github-box</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    GitHub
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    
    <v-layout row justify-center v-if="!mini">
      <v-btn icon target="_blank" v-for="link in links" :title="link.title" :href="link.href" :key="link.icon">
        <v-icon>{{ link.icon }}</v-icon>
      </v-btn>
    </v-layout>

    <v-divider></v-divider>

    <v-list>
      <v-list-tile v-if="mini" @click="mini = !mini">
        <v-list-tile-action>
          <v-icon light>mdi-chevron-right</v-icon>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile avatar router :to="{ path: '/profile' }">
        <v-list-tile-avatar>
          <v-icon large>mdi-account-circle</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-if="$auth.loggedIn">{{ $auth.user.username }}</v-list-tile-title>
          <v-list-tile-title v-else>{{ $t('ui.drawer.notConnected') }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon @click="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>

      <v-divider></v-divider>

      <v-list-tile v-if="$auth.loggedIn" router :to="{ path: '/process' }" ripple>
        <v-list-tile-action>
          <v-icon>mdi-cloud-upload</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ $t('ui.drawer.processLogs') }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

       <v-list-group
        prepend-icon="mdi-settings"
        append-icon="mdi-chevron-down"
        v-if="!mini && $auth.user && $auth.user.group === 'admin'"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Administration</v-list-tile-title>
          <v-list-tile-action 
            v-if="(platforms && platforms['from-head'] === 'outdated') || 
              (middlewares && middlewares['from-head'] === 'outdated') || 
              (ressources && ressources['from-head'] === 'outdated')"
          >
            <v-icon>mdi-alert-circle</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile router :to="{ path: '/admin/platforms' }" ripple>
          <v-list-tile-title>{{ $t('ui.drawer.admin.platforms') }}</v-list-tile-title>
          <v-list-tile-action v-if="platforms && platforms['from-head'] === 'outdated'">
            <v-icon>mdi-alert-circle</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile router :to="{ path: '/admin/updates' }" ripple>
          <v-list-tile-title>{{ $t('ui.drawer.admin.updates') }}</v-list-tile-title>
          <v-list-tile-action 
            v-if="(middlewares && middlewares['from-head'] === 'outdated') || (ressources && ressources['from-head'] === 'outdated')"
          >
            <v-icon>mdi-alert-circle</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile router :to="{ path: '/admin/users' }" ripple>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('ui.drawer.admin.users') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile router :to="{ path: '/admin/jobs' }" ripple>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('ui.drawer.admin.jobs') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-group>

      <v-list-tile router href="https://ezpaarse.readthedocs.io/en/master/" target="_blank" ripple>
        <v-list-tile-action>
          <v-icon>mdi-library-books</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Documentation</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-group
        prepend-icon="mdi-translate"
        append-icon="mdi-chevron-down"
        v-if="!mini"
      >
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('ui.language') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-for="lang in locales" :key="lang.value" @click="$i18n.locale = lang.value">
          <v-list-tile-content>
            <v-list-tile-title>{{ lang.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-group>

      <v-list-tile router :to="{ path: '/feedback' }" ripple>
        <v-list-tile-action>
          <v-icon>mdi-message-alert</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ $t('ui.drawer.feedback') }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="$auth.loggedIn" @click="$auth.logout()">
        <v-list-tile-action>
          <v-icon>mdi-logout</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ $t('ui.drawer.signout') }}</v-list-tile-title>
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
        { icon: 'mdi-youtube-play', href: 'https://www.youtube.com/channel/UCcR-0UE9WjYiwS4fMG2T4tQ' }
      ]
    }
  },
  computed: {
    drawer: {
      get () { return this.$store.state.drawer },
      set (newVal) { this.$store.dispatch('SET_DRAWER', newVal) }
    },
    appVersion () {
      return this.$store.state.appVersion
    },
    ezpaarse () {
      return this.$store.state.ezpaarse
    },
    platforms () {
      return this.$store.state.platforms
    },
    ressources () {
      return this.$store.state.ressources
    },
    middlewares () {
      return this.$store.state.middlewares
    },
    feedback () {
      return this.$store.state.feedback
    }
  }
}
</script>