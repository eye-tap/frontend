<script setup lang="ts">
    import {
        assignedLineColor,
        cursorLineColor,
        boundingBoxColor,
        highlightedBoundingBoxColor,
        proximityBoundingBoxColor,
        selectedFixationColor,
        assignedFixationColor,
        unassignedFixationColor,
        machineAssignedFixationColor,
        fixationRadius,
        hoveredFixationRadius,
        selectedFixationRadius,
        boundingBoxStrokeWidth,
        lineWidth,
        boxesDisplay,
        boxesDisplayOptions,
        linesDisplay,
        linesDisplayOptions,
        fixationDisplay,
        fixationDisplayOptions,
        fixationIndexDisplay,
        fixationIndexDisplayOptions,
    } from '../config';
    import ColorOption from '@/components/settings/ColorOption.vue';
    import Slider from '@vueform/slider';
    import SwitchOption from '@/components/settings/SwitchOption.vue';
    import SliderOptions from '@/components/settings/SliderOptions.vue';

    const dismiss = () => {
        show.value = false;
    };

    const show = defineModel<boolean>();
    // TODO: Think about which options should go where
</script>

<template>
    <div v-if="show" class="preferences">
        <div class="preferences-box">
            <div class="top-bar">
                <h1>Preferences</h1>
                <i class="fa-solid fa-close" @click="dismiss"></i>
            </div>
            <div>
                <div class="options-container">
                    <div class="options-section">
                        <p>Advanced</p>
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

                    <div class="options-section">
                        <p> Nearby Box Distance </p>
                        <input
                            v-model.number="hoveredFixationRadius"
                            type="text"
                            placeholder="Distance"
                            min="0"
                            step="10"
                        >
                    </div>
                    <div class="options-section">
                        <p>Colours</p>

                        <ColorOption
                            v-model="assignedLineColor"
                            text="Line color"
                        />

                        <ColorOption
                            v-model="boundingBoxColor"
                            text="Box color"
                        />

                        <ColorOption
                            v-model="unassignedFixationColor"
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
                                v-model="fixationRadius"
                                show-tooltip="drag"
                                :min="1"
                                :max="10"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.preferences {
    position: fixed;
    top: 0;
    left: 0;
    background-color: var( --theme-overlay );
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    z-index: 1;     // To properly black out all of the Editor

    >.preferences-box {
        >.top-bar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            >i {
                color: var(--theme-foreground-text);
                font-size: 1.5rem;
                cursor: pointer;
            }

            >i:hover {
                color: var(--theme-bg-4-20);
            }

            >h1 {
                font-size: 2rem;
            }

        }

        width: 40vw;
        height: max-content;
        padding: 1px 1.5rem 1.5rem 1.5rem;
        position: relative;
        background-color: var( --theme-bg-2 );
        border-radius: 20px;

        .options-container {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            height: 60vh;
            padding: 1rem;
            background-color: var(--theme-bg-1);
            overflow-y: scroll;

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
}
</style>
