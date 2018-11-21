<template>
  <v-card>
    <v-toolbar class="secondary" dense dark card>
      <v-toolbar-title>
        {{ $t('ui.pages.admin.updates.title') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <p><strong>{{ $t('ui.pages.admin.updates.resources') }}</strong></p>
      <p v-html="$t('ui.pages.admin.updates.predefinedParameters')"></p>
      <p>
        <v-alert :value="true" color="red lighten-2" v-html="$t('ui.pages.admin.updates.repoLocalChanges', { repo: 'ressources' })" v-if="ressources['local-commits'] || ressources['local-changes']"></v-alert>
        <strong>{{ $t('ui.currentVersion') }}</strong> :
        <v-tooltip right v-if="ressources['from-head'] === 'outdated'">
          <v-btn @click="update('resources')" depressed color="red lighten-2 white--text" round slot="activator">{{ressources.current}}<v-icon class="pl-1">mdi-alert-circle</v-icon></v-btn>
          <span>{{ $t('ui.updateTo', { newVersion: ressources.head }) }}</span>
        </v-tooltip>
        <v-btn v-else depressed color="green lighten-2 white--text" round slot="activator">{{ressources.current}}</v-btn>
      </p>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-text>
      <v-flex xs12 sm12>
        <p><strong>Middlewares</strong></p>
        <p>{{ $t('ui.pages.admin.updates.middlewaresInfo') }}</p>
        <p>
          <v-alert :value="true" color="red lighten-2" v-html="$t('ui.pages.admin.updates.repoLocalChanges', { repo: 'middlewares' })" v-if="middlewares['local-commits'] || middlewares['local-changes']"></v-alert>
          <strong>{{ $t('ui.currentVersion') }}</strong> :
          <v-tooltip right v-if="middlewares['from-head'] === 'outdated'">
            <v-btn @click="update('middlewares')" depressed color="red lighten-2 white--text" round slot="activator">{{middlewares.current}}<v-icon class="pl-1">mdi-alert-circle</v-icon></v-btn>
            <span>{{ $t('ui.updateTo', { newVersion: middlewares.head }) }}</span>
          </v-tooltip>
          <v-btn v-else depressed color="green lighten-2 white--text" round slot="activator">{{middlewares.current}}</v-btn>
        </p>
      </v-flex>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-text>
      <v-flex xs12 sm12>
        <p><strong>{{ $t('ui.pages.admin.updates.software') }}</strong></p>
        <p>
          <v-alert :value="true" color="red lighten-2" v-if="ezpaarse['local-commits'] || ezpaarse['local-changes']">
            <p>{{$t('ui.pages.admin.updates.softLocalChanges')}}</p>
            <p>{{$t('ui.pages.admin.updates.contactDeploymentService')}}</p>
          </v-alert>
          <strong>{{ $t('ui.currentVersion') }}</strong> :
          <v-tooltip right v-if="ezpaarse['from-head'] === 'outdated'">
            <v-btn @click="update('app')" depressed color="red lighten-2 white--text" round slot="activator">{{ezpaarse.current}}<v-icon class="pl-1">mdi-alert-circle</v-icon></v-btn>
            <span>{{ $t('ui.updateTo', { newVersion: ezpaarse.head }) }}</span>
          </v-tooltip>
          <v-btn v-else depressed color="green lighten-2 white--text" round slot="activator">{{ezpaarse.current}}</v-btn>
          <br />
          <span><a href="">{{ $t('ui.pages.admin.updates.returnToStableVersion') }}</a></span>
        </p>
        <p>{{ $t('ui.pages.admin.updates.updateDuration') }}</p>
      </v-flex>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  watch: {
    user () {
      if (!this.user) this.$router.push('/')
    }
  },
  async fetch ({ store, redirect }) {
    try {
      await store.dispatch('GET_USER')
      await store.dispatch('LOAD_STATUS')
    } catch (e) {
      return redirect('/')
    }
  },
  computed: {
    ezpaarse () {
      return this.$store.state.ezpaarse
    },
    ressources () {
      return this.$store.state.ressources
    },
    middlewares () {
      return this.$store.state.middlewares
    },
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    update (repo) {
      this.$store.dispatch('UPDATE_REPO', repo).then(res => {
        this.$store.dispatch('LOAD_STATUS')
      })
    }
  }
}
</script>
