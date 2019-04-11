<template>
  <v-card color="black">
    <v-card-text class="white--text">
      <div v-for="(log, index) in logs" :key="index">
        <span v-if="log.date" class="grey--text">
          {{ log.date }}
        </span>
        <span :class="logColor(log.level)">
          {{ log.level }}
        </span>
        <span v-if="log.message">
          : {{ log.message }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    logs: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    logColor (type) {
      switch (type) {
        case 'info':
        case 'verbose':
          return 'green--text';
        case 'warn':
          return 'orange--text';
        case 'error':
          return 'red--text';
        default:
          return 'white--text';
      }
    }
  }
};
</script>
