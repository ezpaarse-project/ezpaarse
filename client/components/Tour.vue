<template>
  <v-tour
    name="ezTour"
    :steps="etapes"
  >
    <!-- <template slot-scope="tour">
      <transition name="fade">
        <v-step
          v-for="(step, index) of tour.steps"
          :key="index"
          :step="step"
          :previous-step="tour.previousStep"
          :next-step="tour.nextStep"
          :stop="tour.stop"
          :is-first="tour.isFirst"
          :is-last="tour.isLast"
        >
          <template>
            <div slot="actions">
              <button
                v-if="!tour.isLast"
                class="v-step__button"
                @click="tour.stop"
              >
                {{ $t('ui.tour.skip') }}
              </button>
              <button
                v-if="!tour.isFirst"
                class="v-step__button"
                @click="tour.previousStep"
              >
                {{ $t('ui.tour.previous') }}
              </button>
              <button
                v-if="!tour.isLast"
                class="v-step__button"
                @click="tour.nextStep"
              >
                {{ $t('ui.tour.next') }}
              </button>
              <button
                v-if="tour.isLast"
                class="v-step__button"
                @click="tour.stop"
              >
                {{ $t('ui.tour.finish') }}
              </button>
            </div>
          </template>
        </v-step>
      </transition>
    </template> -->
  </v-tour>
</template>

<script>
export default {
  props: ['etapes'],
  methods: {
    start () {
      this.$tour['ezTour'].start();
    }
  }
};
</script>
