<script setup lang="ts">
    import {
        assignedFixationColor, heatMapMaxColor, heatMapMidColor, heatMapMinColor, selectedFixationColor
    } from '../config';
    import ColorOption from '@/components/settings/ColorOption.vue';
    import {
        automatedColourMapper
    } from '../util/colour';
    import {
        configPreset
    } from '../config-presets';
    import {
        loadVideo
    } from '@/ts/util/video';
    import {
        useAnnotationSessionStore
    } from '@/ts/stores/annotationSessionStore';
    import {
        watch
    } from 'vue';

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
    const store = useAnnotationSessionStore();

    watch( show, () => addVideo() );

    const addVideo = () => {
        setTimeout( () => {
            loadVideo( document.getElementById( 'video-wrapper' )!, useAnnotationSessionStore().videoId );
        }, 500 );
    };
</script>

<template>
    <div v-if="show" class="wrapper">
        <div class="box">
            <div class="top-bar">
                <h1>Editor Help</h1>
                <i class="fa-solid fa-close" @click="dismiss"></i>
            </div>
            <div class="box-content">
                <div class="options-container">
                    <p class="title">
                        Survey Information
                    </p>
                    <div class="options-section">
                        <p class="subtitle">
                            Your Task
                        </p>
                        <p>
                            Please use EYE-TAP for the duration of the study. Your timer is visible above the editor.
                            Once the timer ends, please <strong>fill out the workload survey</strong> you are given.
                        </p>
                        <p v-if="store.videoId" class="subtitle">
                            Introduction Video
                        </p>
                        <p v-if="store.videoId">
                            Please watch the following video for a short introduction to EYE-TAP.
                        </p>
                        <div id="video-wrapper" class="video-wrapper"></div>
                    </div>
                </div>
                <div class="options-container">
                    <p class="title">
                        Editor Features
                    </p>
                    <div class="options-section">
                        <p v-if="configPreset !== 'basic'">
                            Whenever a character is assigned, the chronologically next one is selected.
                            Use <strong>Keybinds</strong> to annotate, and <strong>Arrow Keys</strong> to navigate.
                        </p>
                        <p v-else>
                            Whenever a character is assigned, the chronologically next one is selected.  
                        </p>
                        <p class="subtitle">
                            <strong>Fixation color</strong> shows annotation state
                        </p>
                        <p class="small">
                            See fixation colors for meaning.
                        </p>
                        <p class="subtitle">
                            <strong>Indices</strong> show chronology
                        </p>
                        <p class="small">
                            i.e. Fixation "3" was looked at right before Fixation "4".
                        </p>
                        <p class="subtitle">
                            <strong>Lines</strong> show annotations
                        </p>
                        <p class="small">
                            Annotated fixations are connected to the selected character.
                        </p>
                        <div v-if="configPreset === 'full' || configPreset === 'unrestricted'">
                            <p class="subtitle">
                                <strong>Boxes</strong> show annotation suggestions
                            </p>
                            <p class="small">
                                They show which characters an annotation algorithm would have chosen.
                            </p>
                        </div>
                        <div v-if="configPreset !== 'basic'">
                            <p class="subtitle">
                                <strong>Grey Lines</strong> show sight path
                            </p>
                            <p class="small">
                                The greyline connects fixations chronologically, so it shows the path the reader's eyes took.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="options-container">
                    <p class="title">
                        Fixation Colors
                    </p>
                    <div class="options-section">
                        <p v-if="configPreset === 'full' || configPreset === 'unrestricted'">
                            <strong>Entropy</strong> indicates how difficult algorithms consider a fixation to annotate. Intuitively,
                            higher entropy annotations should be more difficult, and vice versa.
                        </p>
                        <div class="color-options">
                            <p class="top">
                                Fixation Colors
                            </p>
                            <ColorOption v-model="selectedFixationColor" text="Selected" />
                            <ColorOption v-model="assignedFixationColor" text="User-assigned" />
                            <!-- <ColorOption v-model="machineAssignedFixationColor" text="Algorithm-assigned" />
                                <ColorOption v-model="unassignedFixationColor" text="Unassigned" /> -->
                            <div v-if="configPreset === 'full' || configPreset === 'unrestricted'">
                                <p>
                                    Entropy Heatmap
                                </p>
                                <ColorOption v-model="minHeatMapColor" text="Low Entropy" />
                                <ColorOption v-model="midHeatMapColor" text="Medium Entropy" />
                                <ColorOption v-model="maxHeatMapColor" text="High Entropy" />
                            </div>
                        </div>
                        <p v-if="configPreset === 'full' || configPreset === 'unrestricted'" class="small">
                            EYE-TAP uses multiple algorithms to suggest annotations for each fixation.
                            The more algorithms agree, the lower the entropy.
                        </p>
                    </div>
                </div>
                <div class="options-container" v-if="configPreset !== 'basic'">
                    <p class="title">
                        Keybinds
                    </p>
                    <div class="options-section">
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
        width: 90vw;
        height: 90vh;
        padding: 1px 1.5rem 1.5rem 1.5rem;
        position: relative;
        background-color: var( --theme-bg-2 );
        border-radius: 20px;
        scrollbar-color: var( --theme-bg-4 ) var( --theme-bg-3 );

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

        .box-content {
            height: 75vh;
            overflow-y: auto;
            scrollbar-color: var( --theme-bg-4 ) var( --theme-bg-3 );
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            .options-container {
                display: flex;
                flex-direction: column;

                width: max-content;
                max-width: 25rem;
                height: max-content;
                max-height: 35rem;
                padding: 1rem;
                margin: 1rem;

                background-color: var(--theme-bg-1);

                .title {
                    color: var(--theme-bg-4);
                    font-weight: 600;
                    font-size: 1.25rem;
                    margin-top: 0rem;
                }

                .options-section {
                    overflow-y: auto;
                    scrollbar-color: var( --theme-bg-4 ) var( --theme-bg-3 );
                    p {
                        color: var( --theme-bg-3-20 );
                        font-weight: 400;
                        font-size: 1rem;
                        margin-top: 10px;
                        margin-bottom: 10px;

                        &.subtitle {
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

                        &.small {
                            font-size: 0.85rem;
                            color: var(--theme-bg-3)
                        }

                        >strong {
                            color: var(--theme-interactable-text);
                        }
                    }

                    >ul {
                        >li {
                            color: var( --theme-bg-3-20 );
                            >strong {
                                color: var(--theme-interactable-text);
                            }
                        }
                    }

                    .color-options {
                        margin: 1rem;
                        p {
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
}
</style>
