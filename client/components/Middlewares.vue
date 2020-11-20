<template>
  <v-container fluid style="max-width: 1200px">
    <v-row align="start" justify="center">
      <v-col cols="12" sm="6" md="5" align-self="start">
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

                  <v-list-item-action>
                    <v-btn icon @click="addMiddleware(middleware)">
                      <v-icon>
                        mdi-transfer-right
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </vuedraggable>
          </v-list>
        </v-card>
      </v-col>

      <v-col md="1" align-self="center" class="text-center d-none d-md-block">
        <v-avatar size="36" color="primary">
          <v-icon dark>
            mdi-swap-horizontal-bold
          </v-icon>
        </v-avatar>
      </v-col>

      <v-col cols="12" sm="6" md="5" align-self="start">
        <v-card align-self-stretch>
          <v-toolbar flat color="green darken-1 white--text">
            <v-toolbar-title v-text="$t('ui.pages.admin.middlewares.defaultsMiddlewares')" />

            <v-spacer />

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="!hideResetButton"
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
              v-model="selectedMiddlewares"
              group="middlewares"
              ghost-class="font-weight-bold"
              @change="emitChange"
            >
              <template v-for="(middleware, key) in selectedMiddlewares">
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

                  <v-list-item-action>
                    <v-btn icon @click="removeMiddleware(key)">
                      <v-icon dark>
                        mdi-close
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
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
    default: {
      type: Array,
      default: () => []
    },
    available: {
      type: Array,
      default: () => []
    },
    hidden: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    hideResetButton: {
      type: Boolean,
      default: () => false
    }
  },
  components: {
    vuedraggable
  },
  computed: {
    dark () { return this.$vuetify.theme.dark; },

    availableMiddlewares () { return Array.isArray(this.available) ? this.available : []; },
    defaultMiddlewares () { return Array.isArray(this.default) ? this.default : []; },
    hiddenMiddlewares () { return Array.isArray(this.hidden) ? this.hidden : []; },
    selectedMiddlewares: {
      get () { return Array.isArray(this.value) ? this.value : []; },
      set (value) { this.$emit('input', value); }
    },

    selectableMiddlewares () {
      const selectedMiddlewares = new Set([...this.selectedMiddlewares, ...this.hiddenMiddlewares]);

      return this.availableMiddlewares.filter(mw => !selectedMiddlewares.has(mw));
    }
  },
  methods: {
    emitChange () {
      this.$emit('change', this.selectedMiddlewares);
    },
    addMiddleware (name) {
      const newArray = this.selectedMiddlewares.slice();
      newArray.push(name);
      this.selectedMiddlewares = newArray;
      this.emitChange();
    },
    removeMiddleware (index) {
      const newArray = this.selectedMiddlewares.slice();
      newArray.splice(index, 1);
      this.selectedMiddlewares = newArray;
      this.emitChange();
    },
    resetMiddlewares () {
      this.selectedMiddlewares = this.default;
      this.emitChange();
    }
  }
};
</script>
