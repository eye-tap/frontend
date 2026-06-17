<script setup lang="ts">
import { assignedFixationColor, heatMapMaxColor, heatMapMidColor, heatMapMinColor, selectedFixationColor } from '../config';
import { automatedColourMapper } from '../util/colour';
import ColorOption from '@/components/settings/ColorOption.vue';

    const dismiss = () => {
        show.value = false;
    };

    const keybindDescriptors = [
        {
            'keybind': 'Letters',
            'function': 'Assign the current fixation to the closest corresponding letter'
        },
        {
            'keybind': 'Shift + Letters',
            'function': 'Assign the current fixation to the second closest corresponding letter'
        },
        {
            'keybind': 'Backspace',
            'function': 'Delete annotation / move back'
        },
        {
            'keybind': 'Arrows',
            'function': 'Move to next / previous fixation'
        },
        {
            'keybind': 'Enter',
            'function': '(hold) Show assignments of all algorithms'
        },
        {
            'keybind': 'Shift + Backspace',
            'function': 'Mark fixation as invalid'
        },
        {
            'keybind': 'Shift + Delete',
            'function': 'Mark fixation as invalid'
        },
        {
            'keybind': 'CTRL + Z',
            'function': 'Undo'
        },
        {
            'keybind': 'CTRL + SHIFT + Z',
            'function': 'Redo'
        },
        {
            'keybind': 'CTRL + Y',
            'function': 'Redo'
        },
        {
            'keybind': 'CTRL + S',
            'function': 'Save'
        },
        {
            'keybind': 'CTRL + Drag',
            'function': 'Pan the view'
        },
        {
            'keybind': 'CTRL + Scroll',
            'function': 'Zoom'
        },
        {
            'keybind': 'CTRL + -',
            'function': 'Zoom out'
        },
        {
            'keybind': 'CTRL + +',
            'function': 'Zoom in'
        },
        {
            'keybind': 'CTRL + Arrows',
            'function': 'Pan the view'
        }
    ];
    const show = defineModel<boolean>();
    const minHeatMapColor = automatedColourMapper( heatMapMinColor );
    const midHeatMapColor = automatedColourMapper( heatMapMidColor );
    const maxHeatMapColor = automatedColourMapper( heatMapMaxColor );
</script>

<template>
    <div v-if="show" class="wrapper">
        <div class="box">
            <div class="top-bar">
                <h1>Editor Help</h1>
                <i class="fa-solid fa-close" @click="dismiss"></i>
            </div>
            <p class="desc">
                The editor provides several keybinds for quicker annotations. Colors can be modified by clicking on the icon.
            </p>
            <div>
                <div class="options-container">
                    <div class="options-section">
                        <p class="title">
                            Color Legend
                        </p>
                        <div class="color-options">
                            <p class="top">
                                Fixation Colors
                            </p>
                            <ColorOption v-model="selectedFixationColor" text="Selected" />
                            <ColorOption v-model="assignedFixationColor" text="User-assigned" />
                            <!-- <ColorOption v-model="machineAssignedFixationColor" text="Algorithm-assigned" />
                                <ColorOption v-model="unassignedFixationColor" text="Unassigned" /> -->
                            <p>
                                Entropy Heatmap
                            </p>
                            <ColorOption v-model="minHeatMapColor" text="Low Entropy" />
                            <ColorOption v-model="midHeatMapColor" text="Medium Entropy" />
                            <ColorOption v-model="maxHeatMapColor" text="High Entropy" />
                        </div>
                        <p class="title">Keybinds</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        Keybind
                                    </th>
                                    <th>
                                        Function
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="descriptor, index in keybindDescriptors"
                                    :key="index"
                                    class="keybinds"
                                >
                                    <td>
                                        <p class="keybind">
                                            {{ descriptor.keybind }}
                                        </p>
                                    </td>
                                    <td class="keybind-desc">
                                        {{ descriptor.function }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    position: fixed;
    top: 0;
    left: 0;
    background-color: var( --theme-overlay );
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    z-index: 100;     // To properly black out all of the Editor

    .desc {
        color: var(--theme-background-text-20);
        padding-bottom: 0.5rem;
    }

    >.box {
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

        width: 25vw;
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
            scrollbar-color: var( --theme-bg-4 ) var( --theme-bg-3 );


            .options-section {
                >p {
                    color: var( --theme-bg-3 );
                    font-weight: 400;
                    font-size: 1rem;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }

                .title  {
                    color: var(--theme-bg-4);
                    font-weight: 600;
                    font-size: 1.25rem;
                    margin-bottom: 1rem;
                }

                .color-options {
                    margin-bottom: 1rem;
                    margin-left: 1rem;
                    >p {
                        color: var( --theme-bg-3-20 );
                        font-weight: 600;
                        font-size: 1rem;
                        margin-top: 10px;
                        margin-bottom: 10px;
                    }
                }

                >table {
                    margin-left: 1rem;
                    >thead>tr>th {
                        padding-bottom: 1rem;
                        text-align: left;
                        color: var(--theme-bg-3-20);
                    }

                    >tbody>.keybinds {
                        margin-left: 1rem;
                        >td {

                            .keybind {
                                padding: 5px;
                                border-radius: 5px;

                                color: var(--theme-interactable-text);

                                background-color: var(--theme-bg-1-shade);

                                border-style: solid;
                                border-color: var(--theme-bg-1-shade);
                                border-width: 4px;

                                margin: 0px;
                                margin-right: 1rem;

                                width: fit-content;
                            }
                        }

                        >.keybind-desc {
                            color: var( --theme-bg-3-20 );
                            font-weight: 400;
                            font-size: 1rem;
                        }
                    }
                }
            }
        }
    }
}
</style>
