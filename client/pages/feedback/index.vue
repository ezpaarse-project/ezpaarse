<template>
  <v-card>
    <v-toolbar class="secondary" dark dense card>
      <v-toolbar-title>
        {{ $t('ui.drawer.feedback') }}
      </v-toolbar-title>
    </v-toolbar>
    
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm12>
          <v-alert :value="true" color="blue" v-html="$t('ui.pages.feedback.email')"></v-alert>

          <v-alert :value="true" color="success" v-if="feedback" dismissible>{{ $t('ui.pages.feedback.hasSent') }}</v-alert>

          <v-text-field
            v-model="email"
            label="Email"
            type="email"
          ></v-text-field>

          <v-textarea
            v-model="comment"
            label="Message"
          ></v-textarea>

          <v-checkbox
            label="Envoyer la version de mon navigateur"
            v-model="checkbox"
          ></v-checkbox>

          <v-btn class="teal white--text" :disabled="!email && !comment" @click="sendFeedBack">{{ $t('ui.send') }}</v-btn>
        </v-flex>
      </v-layout>      
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  data () {
    return {
      email: null,
      comment: null,
      browser: null,
      checkbox: true,
      feedback: false
    }
  },
  methods: {
    sendFeedBack () {
      const result = this.$store.dispatch('feedback', {
        email: this.email,
        comment: this.comment,
        browser: this.checkbox ? navigator.userAgent : null
      })

      result.then(res => {
        this.email = null
        this.comment = null
        this.checkbox = true
        this.feedback = true
      })
    }
  }
}
</script>