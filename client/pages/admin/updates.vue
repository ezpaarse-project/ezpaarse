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
      <p v-html="$t('ui.pages.admin.updates.afterAnUpdate')"></p>
      <p>
        <strong>{{ $t('ui.currentVersion') }}</strong> :
        <v-btn depressed color="teal lighten-2 white--text" round slot="activator">1ac7e20</v-btn>
      </p>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-text>
      <v-flex xs12 sm12>
        <p><strong>Middlewares</strong></p>
        <p>{{ $t('ui.pages.admin.updates.middlewaresInfo') }}</p>
        <p>
          <strong>{{ $t('ui.currentVersion') }}</strong> :
          <v-btn depressed color="teal lighten-2 white--text" round slot="activator">1ac7e20</v-btn>
        </p>
      </v-flex>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-text>
      <v-flex xs12 sm12>
        <p><strong>{{ $t('ui.pages.admin.updates.software') }}</strong></p>
        <p>
          <strong>{{ $t('ui.currentVersion') }}</strong> :
          <v-tooltip right>
            <v-btn depressed color="teal lighten-2 white--text" round slot="activator">2.12.12-8-gfa33929 (beta)<v-icon class="pl-1">mdi-alert-circle</v-icon></v-btn>
            <span>{{ $t('ui.updateTo', { newVersion: '2.12.12-8-gfa48792' }) }}</span>
          </v-tooltip>
          <br />
          <span><a href="">{{ $t('ui.pages.admin.updates.returnToStableVersion') }}</a></span>
        </p>
        <p>{{ $t('ui.pages.admin.updates.updateDuration') }}</p>
      </v-flex>
    </v-card-text>
  </v-card>
</template>
