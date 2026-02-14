<script
  setup
  lang="ts"
  generic="T extends readonly string[]"
>
    import {
        computed
    } from 'vue';

    const props = defineProps<{
        'text': string
        'options': T
    }>();
    const state = defineModel<T[number]>( {
        'required': true
    } ); // Maps the current state value to the slider index
    const sliderValue = computed( {
        'get': () => props.options.indexOf( state.value ),
        'set': ( i: number ) => {
            state.value = props.options[i]!;
        }
    } );

    const capitalize = ( text: string ) => {
        return text.charAt( 0 ).toUpperCase() + text.slice( 1 );
    };
</script>

<template>
    <div class="slider-option">
        <div class="option-text">
            <p class="option-label">
                {{ capitalize(props.text) }}
            </p>
            <p class="option-state">
                {{ capitalize(state) }}
            </p>
        </div>

        <!-- Slider input -->
        <input
            v-model="sliderValue"
            type="range"
            :min="0"
            :max="props.options.length - 1"
            step="1"
        >

        <!-- Labels below the slider -->
        <div class="slider-labels">
            <span
                v-for="(option, index) in props.options"
                :key="index"
                :class="{ active: option === state }"
            >
                {{ capitalize(option) }}
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.slider-option {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  .option-text {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;

    .option-label {
      font-size: 0.9rem;
      color: var(--theme-bg-3-20);
      margin: 0px;
    }

    .option-state {
      margin: 0px;
    }
  }

  p {
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input[type="range"] {
    appearance: none;
    width: 100%;
    height: 10px;
    margin-bottom: 0.25rem;
    background-color: var(--theme-bg-3);
    border-radius: 5px;
  }

  /** Chrome */
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    background: var(--theme-bg-5);
    width: 15px;
    height: 15px;
    border: none;
    border-radius: 10px;
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    background: var(--theme-bg-4-20);
    scale: 1.2;
  }

  input[type="range"]::-webkit-slider-thumb:active {
    background: var(--theme-bg-4);
    scale: 1.2;
  }

  /** Firefox */
  input[type="range"]::-moz-range-thumb {
    appearance: none;
    background: var(--theme-bg-5);
    width: 15px;
    height: 15px;
    border: none;
    border-radius: 10px;
    transition: background 0.1s;
    transition: scale 0.1s;
  }

  input[type="range"]::-moz-range-thumb:hover {
    background: var(--theme-bg-4-20);
    scale: 1.2;
  }

  input[type="range"]::-moz-range-thumb:active {
    background: var(--theme-bg-4);
    scale: 1.2;
  }

  .slider-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;

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
