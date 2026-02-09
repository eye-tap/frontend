<script setup lang="ts">
    import {
        filterReader,
        showBoundingBoxes,
        showGazePoints,
        showLines,
        showPointIndex
    } from '@/scripts/editor/data/config';
    import SwitchOption from './SwitchOption.vue';
</script>

<template>
    <div class="options-pane">
        <div class="options-container">
            <div class="options-section">
                <p> Display </p>
                <SwitchOption v-model="showGazePoints" text="Show Points" />
                <SwitchOption v-model="showPointIndex" text="Show Point Index" />
                <SwitchOption v-model="showLines" text="Show Lines" />
                <SwitchOption v-model="showBoundingBoxes" text="Show Boxes" />
            </div>

            <div class="options-section">
                <p>Filtering</p>
                <input
                    v-model.number="filterReader"
                    type="text"
                    placeholder="Filter reader"
                >
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
