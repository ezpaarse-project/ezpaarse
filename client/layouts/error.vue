<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dense
      dark
      card
    >
      <v-toolbar-title>
        {{ $t(`ui.errors.title`) }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text class="text-xs-center">
      <h1 class="display-4 font-weight-black primary--text">
        {{ error.statusCode }}
      </h1>
      <h4 class="headline">
        {{ $t(`ui.errors.${error.statusCode}`) }}
      </h4>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  },
  layout: ({ app }) => (app.$auth.user ? 'default' : 'sign')
};
</script>
