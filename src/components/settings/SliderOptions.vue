<script
  setup
  lang="ts"
  generic="T extends readonly string[]"
>
import { computed } from 'vue'

const props = defineProps<{
  text: string
  options: T
}>()

const state = defineModel<T[number]>({ required: true })

// Maps the current state value to the slider index
const sliderValue = computed({
  get: () => props.options.indexOf(state.value),
  set: (i: number) => {
    state.value = props.options[i]!
  }
})
</script>

<template>
  <div class="slider-option">
    <p>{{ props.text }}: {{ state }}</p>
    
    <!-- Slider input -->
    <input
      type="range"
      :min="0"
      :max="props.options.length - 1"
      step="1"
      v-model="sliderValue"
    />

    <!-- Labels below the slider -->
    <div class="slider-labels">
      <span
        v-for="(option, index) in props.options"
        :key="index"
        :class="{ active: option === state }"
      >
        {{ option }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider-option {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  p {
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input[type="range"] {
    width: 100%;
    margin-bottom: 0.25rem;
  }

  .slider-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;

    span {
      color: var(--theme-bg-3-20);
      &.active {
        font-weight: 600;
        color: var(--theme-bg-1);
      }
    }
  }
}
</style>
