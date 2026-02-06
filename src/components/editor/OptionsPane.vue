<script setup lang="ts">
    import {
        annotationLineColor,
        annotationPointColor,
        boundingBoxColor,
        boundingBoxOnHoverRadius,
        boundingBoxStrokeWidth,
        filterReader,
        lineWidth,
        pointRadius,
        showAdvancedOptions,
        showBoundingBoxes,
        showBoxesOnHover,
        showGazePoints,
        showHoveredBoundingBox,
        showLines,
        showNearbyBoundingBoxes,
        showOnlyPreviousPoints,
        showPointIndex
    } from '@/scripts/editor/data/config';
    import ColorOption from './ColorOption.vue';
    import Slider from '@vueform/slider';
    import SwitchOption from './SwitchOption.vue';
</script>

<template>
    <div class="options-pane">
        <div class="options-container">
            <!-- These could be made collapsible, if options pane gets too crowded -->
            <!-- Basic Options -->
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

            <div class="options-section advanced-toggle">
                <button class="advanced-button button secondary" @click="showAdvancedOptions = !showAdvancedOptions">
                    Advanced options
                    <span>{{ showAdvancedOptions ? '▲' : '▼' }}</span>
                </button>
            </div>
            <!-- Advanced Options -->
            <div v-if="showAdvancedOptions" class="options-section">
                <p> Advanced </p>
                <SwitchOption v-model="showNearbyBoundingBoxes" text="Show nearby boxes" />
                <SwitchOption v-model="showHoveredBoundingBox" text="Highlight hovered box" />
                <SwitchOption v-model="showBoxesOnHover" text="Show Boxes only on hover" />
                <SwitchOption v-model="showOnlyPreviousPoints" text="Show Only Previous Points" />

                <div class="options-section">
                    <p> Nearby Box Distance </p>
                    <input
                        v-model.number="boundingBoxOnHoverRadius"
                        type="text"
                        placeholder="Distance"
                        min="0"
                        step="10"
                    >
                </div>
                <div class="options-section">
                    <p>Colours</p>

                    <ColorOption
                        v-model="annotationLineColor"
                        text="Line color"
                    />

                    <ColorOption
                        v-model="boundingBoxColor"
                        text="Box color"
                    />

                    <ColorOption
                        v-model="annotationPointColor"
                        text="Point color"
                    />
                </div>

                <div class="options-section">
                    <p>Further display</p>

                    <div class="slider-option">
                        <p>Line width</p>
                        <Slider
                            v-model="lineWidth"
                            show-tooltip="drag"
                            :min="1"
                            :max="5"
                        />
                    </div>

                    <div class="slider-option">
                        <p>Box stroke</p>
                        <Slider
                            v-model="boundingBoxStrokeWidth"
                            show-tooltip="drag"
                            :min="1"
                            :max="5"
                        />
                    </div>

                    <div class="slider-option">
                        <p>Point radius</p>
                        <Slider
                            v-model="pointRadius"
                            show-tooltip="drag"
                            :min="1"
                            :max="10"
                        />
                    </div>
                </div>
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
