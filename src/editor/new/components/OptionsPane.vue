<script setup lang="ts">

import {
        boxesDisplay,
        boxesDisplayOptions,
        linesDisplay,
        linesDisplayOptions,
        fixationDisplay,
        fixationDisplayOptions,
        fixationIndexDisplay,
        fixationIndexDisplayOptions,
    } from '../config';
import SliderOptions from '@/components/settings/SliderOptions.vue';
</script>

<template>
    <div class="options-pane">
        <div class="options-container">
            <div class="options-section">
                <p> Display </p>
                <SliderOptions
                    v-model="boxesDisplay"
                    :options="boxesDisplayOptions"
                    text="Boxes"
                />
                <SliderOptions
                     v-model="linesDisplay"
                     :options="linesDisplayOptions"
                     text="Lines"
                />
                <SliderOptions
                    v-model="fixationDisplay"
                    :options="fixationDisplayOptions"
                    text="Fixation"
                />
                <SliderOptions
                    v-model="fixationIndexDisplay"
                    :options="fixationIndexDisplayOptions"
                    text="Fixation Index"
                />
            </div>
        </div>
    </div>
</template>

<style src="@vueform/slider/themes/default.css"></style>
<style lang="scss" scoped>
@use '@/scss/util/_toggles.scss';

.options-pane {
    padding: 10px;
    background-color: var( --theme-bg-1 );
    user-select: none;

    .advanced-toggle {
        display: flex;
        align-items: center;
        justify-content: center;

        .advanced-button {
            font-size: 1rem;
            width: full;
            margin-top: 15px;
            margin-bottom: 10px;
        }
    }

    .options-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .options-section {

            .slider-option {
                width: 16rem;
                margin-left: 1rem;
                margin-bottom: 20px;

                >p {
                    color: var(--theme-background-text-20);
                    font-size: 1rem;
                }
            }

            >p {
                color: var( --theme-bg-3 );
                font-weight: 400;
                font-size: 1rem;
                margin-top: 10px;
                margin-bottom: 10px;
            }

            >input[type=text] {
                all: unset;
                background-color: var(--theme-bg-3);
                width: 15rem;
                padding: 8px;
                margin-bottom: 0.5rem;
                margin-left: 1rem;
                border-style: none;
            }
        }
    }
}
</style>
