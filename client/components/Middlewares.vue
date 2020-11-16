<template>
  <v-container fluid>
    <v-row align="start" justify="center">
      <v-col cols="4" align-self="start">
        <v-card align-self-stretch>
          <v-toolbar flat color="blue-grey darken-1 white--text">
            <v-toolbar-title v-text="$t('ui.pages.admin.middlewares.middlewares')" />
          </v-toolbar>

          <v-list :color="`blue-grey ${dark ? 'darken-3' : 'lighten-4'}`">
            <vuedraggable
              :list="selectableMiddlewares"
              group="middlewares"
              ghost-class="font-weight-bold"
            >
              <template v-for="(middleware, key) in selectableMiddlewares">
                <v-list-item :key="`${middleware}-${key}`" :ripple="false" @click.stop>
                  <v-list-item-content>
                    <v-list-item-title v-text="middleware" />
                  </v-list-item-content>
                </v-list-item>
              </template>
            </vuedraggable>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="1" align-self="center" class="text-center">
        <v-avatar size="36" color="primary">
          <v-icon dark>
            mdi-swap-horizontal-bold
          </v-icon>
        </v-avatar>
      </v-col>

      <v-col cols="4" align-self="start">
        <v-card align-self-stretch>
          <v-toolbar flat color="green darken-1 white--text">
            <v-toolbar-title v-text="$t('ui.pages.admin.middlewares.defaultsMiddlewares')" />

            <v-spacer />

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  fab
                  icon
                  small
                  dark
                  v-on="on"
                  @click="resetMiddlewares"
                >
                  <v-icon>
                    mdi-reload
                  </v-icon>
                </v-btn>
              </template>
              <span v-text="$t('ui.pages.admin.middlewares.default')" />
            </v-tooltip>
          </v-toolbar>

          <v-list :color="`green ${dark ? 'darken-3' : 'lighten-4'}`">
            <vuedraggable
              v-model="middlewares.defaults"
              group="middlewares"
              ghost-class="font-weight-bold"
              @change="watchDefaultsMiddlewares"
            >
              <template v-for="(middleware, key) in middlewares.defaults">
                <v-list-item
                  :key="`${middleware}-${key}`"
                  :ripple="false"
                  @click.stop
                >
                  <v-list-item-avatar>
                    <v-avatar
                      size="32"
                      color="green darken-1 white--text"
                    >
                      <span v-text="(key + 1)" />
                    </v-avatar>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-text="middleware" />
                  </v-list-item-content>

                  <v-list-item-avatar>
                    <v-btn icon @click="removeDefaultMiddlewares(key)">
                      <v-icon dark>
                        mdi-close
                      </v-icon>
                    </v-btn>
                  </v-list-item-avatar>
                </v-list-item>
              </template>
            </vuedraggable>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import vuedraggable from 'vuedraggable';

export default {
  props: {
    middlewares: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    vuedraggable
  },
  computed: {
    dark () { return this.$vuetify.theme.dark; },
    selectableMiddlewares () {
      let availableMiddlewares = this.middlewares.availables;
      let defaultMiddlewares = this.middlewares.defaults;

      if (!Array.isArray(availableMiddlewares)) { availableMiddlewares = []; }
      if (!Array.isArray(defaultMiddlewares)) { defaultMiddlewares = []; }

      const selectedMiddlewares = new Set(this.middlewares.defaults);

      return availableMiddlewares.filter(mw => !selectedMiddlewares.has(mw));
    }
  },
  methods: {
    watchDefaultsMiddlewares (event) {
      this.$emit('watchDefaultsMiddlewares', event, false);
    },
    removeDefaultMiddlewares (id) {
      this.$emit('removeDefaultMiddlewares', id);
    },
    resetMiddlewares () {
      this.$emit('watchDefaultsMiddlewares', null, true);
    }
  }
};
</script>
