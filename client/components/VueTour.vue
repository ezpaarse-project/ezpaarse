<template>
  <v-layout row wrap>
    <v-tour
      :name="tourName"
      :steps="tourSteps"
    >
     <template slot-scope="tour">
        <transition name="fade">
          <v-step
            v-if="tour.steps[tour.currentStep]"
            :step="tour.steps[tour.currentStep]"
            :key="tour.currentStep"
            :previous-step="tour.previousStep"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
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
      </template>
    </v-tour>

    <v-btn fab flat small @click="$tours[tourName].start()">
      <v-icon>mdi-help-circle</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  props: ['tourSteps', 'tourName']
};
</script>
