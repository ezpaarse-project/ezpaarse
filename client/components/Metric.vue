<template>
  <v-card>
    <v-layout row align-center>
      <v-flex shrink>
        <v-card :color="color" class="ma-2 pa-2">
          <v-icon size="40" dark>
            {{ icon }}
          </v-icon>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card-title class="text-xs-right">
          <v-spacer />
          <div class="text-xs-right">
            <div class="headline">
              {{ value }}
            </div>
            <div class="subheading grey--text">
              {{ label }}
            </div>
          </div>
        </v-card-title>
      </v-flex>
    </v-layout>
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
