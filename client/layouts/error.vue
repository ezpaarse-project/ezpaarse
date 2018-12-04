<template>
  <v-card>
    <v-toolbar class="secondary" dense dark card>
      <v-toolbar-title>
        {{$t(`ui.errors.title`)}}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text class="text-xs-center">
      <h1 class="display-4 font-weight-black teal--text">{{error.statusCode}}</h1>
      <h4 class="headline">{{$t(`ui.errors.${error.statusCode}`)}}</h4>
      <v-btn color="teal" @click="back" class="white--text mt-5">{{$t('ui.back')}}</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['error'],
  layout: 'sign',
  methods: {
    back () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  }
}
</script>