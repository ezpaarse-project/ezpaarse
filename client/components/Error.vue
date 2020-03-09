<template>
  <v-card>
    <v-toolbar
      class="secondary"
      dense
      dark
      card
    >
      <v-toolbar-title v-text="$t('ui.errors.title')" />
    </v-toolbar>
    {{ route }}
    <v-card-text class="text-center">
      <h1 class="display-4 font-weight-black primary--text" v-text="error.statusCode" />
      <h4 class="headline">
        {{ $t(`ui.errors.${error.statusCode}`) }}
      </h4>
      <v-btn
        color="primary"
        class="white--text mt-5"
        @click="back"
        v-text="$t('ui.back')"
      />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['error']
};
</script>
