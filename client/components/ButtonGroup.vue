<template>
  <v-item-group class="v-btn-group">
    <slot />
  </v-item-group>
</template>

<style>
.v-btn-group {
  border-radius: 2px;
  display: inline-flex;
}
.v-btn-group .theme--dark & {
  background: #424242;
}
.v-btn-group .theme--light & {
  background: #fff;
}
.v-btn-group .v-btn {
  border-radius: 0;
  justify-content: center;
  margin: 0;
  min-width: auto;
  padding: 0 8px;
  width: auto;
}
.v-btn-group .v-btn:not(:last-child) {
  border-right: 1px solid transparent;
}
.v-btn-group .v-btn:first-child {
  border-radius: 2px 0 0 2px;
}
.v-btn-group .v-btn:last-child {
  border-radius: 0 2px 2px 0;
}
</style>