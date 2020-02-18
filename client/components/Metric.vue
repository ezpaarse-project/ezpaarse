<template>
  <v-card>
    <v-list-item two-line>
      <v-list-item-avatar
        tile
        size="58"
        :color="color"
        style="border-radius: 4px;"
        class="elevation-1"
      >
        <v-icon size="40" dark>
          {{ icon }}
        </v-icon>
      </v-list-item-avatar>

      <v-list-item-content class="text-right">
        <v-list-item-title class="headline mb-1" v-text="value" />
        <v-list-item-subtitle v-text="label" />
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: () => ''
    },
    value: {
      type: [String, Number],
      default: () => ''
    },
    icon: {
      type: String,
      default: () => ''
    },
    color: {
      type: String,
      default: () => ''
    }
  }
};
</script>
