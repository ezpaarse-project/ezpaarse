<template>
  <v-tour name="myTour" :steps="steps">
    <template slot-scope="tour">
      <transition name="fade">
        <v-step v-if="tour.currentStep === index" v-for="(step, index) of tour.steps" :key="index" :step="step" :previous-step="tour.previousStep" :next-step="tour.nextStep" :stop="tour.stop" :isFirst="tour.isFirst" :isLast="tour.isLast">
          <template>
            <div slot="actions">
              <button @click="tour.stop" v-if="!tour.isLast" class="v-step__button">{{ $t('ui.tour.skip') }}</button>
              <button @click="tour.previousStep" v-if="!tour.isFirst" class="v-step__button">{{ $t('ui.tour.previous') }}</button>
              <button @click="tour.nextStep" v-if="!tour.isLast" class="v-step__button">{{ $t('ui.tour.next') }}</button>
              <button @click="tour.stop" v-if="tour.isLast" class="v-step__button">{{ $t('ui.tour.finish') }}</button>
            </div>
          </template>
        </v-step>
      </transition>
    </template>
  </v-tour>
</template>

<script>
export default {
  props: ['steps']
}
</script>

