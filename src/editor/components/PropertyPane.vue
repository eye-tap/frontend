<script setup lang="ts">
    import {
        type Ref,
        computed,
        ref
    } from 'vue';
    import {
        fixations,
        selectedFixation
    } from '../data';
    import type {
        EditorPoint
    } from '../types/annotation';
    import {
        useAnnotationSessionStore
    } from '@/ts/stores/annotationSessionStore';

    const props = defineProps<{
        'showPropertyPane': boolean,
    }>();
    // Minimum values to apply color change to Entropy property
    const entropyThresholds = {
        'high': 50,
        'mid': 25
    };
    const entropy = computed( () => {
        return 0;
    } );
    const isDragging = ref( false );
    const session = useAnnotationSessionStore();
    const pos: Ref<EditorPoint> = ref( {
        'x': 10,
        'y': 10
    } );

    let oldPos: EditorPoint = {
        'x': 0,
        'y': 0
    };

    const clickPos: EditorPoint = {
        'x': 0,
        'y': 0
    };

    const dragHandler = ( ev: MouseEvent ) => {
        if ( !isDragging.value && ev.buttons === 1 ) {
            isDragging.value = true;
            oldPos = {
                ...pos.value
            };
            clickPos.x = ev.x;
            clickPos.y = ev.y;
        } else if ( isDragging.value ) {
            pos.value = {
                'x': oldPos.x + ( clickPos.x - ev.x ),
                'y': oldPos.y + ( clickPos.y - ev.y )
            };
            console.log( pos.value );
        }
    };

    const mouseUp = () => {
        isDragging.value = false;
    };
</script>

<template>
    <div
        v-if="props.showPropertyPane"
        id="tour-properties"
        class="property-pane"
        :style="`bottom: ${ pos.y }px; right: ${ pos.x }px;`"
        @mousemove="dragHandler"
        @mouseup="mouseUp"
    >
        <h2>Properties</h2>

        <table v-if="selectedFixation > -1">
            <tbody>
                <tr>
                    <td>
                        <p class="title">
                            Assigned by
                        </p>
                        <p class="content">
                            {{ fixations[ selectedFixation ]!.assigned }}
                        </p>
                    </td>
                    <td>
                        <p class="title">
                            Fixation number
                        </p>
                        <p class="content">
                            {{ fixations[ selectedFixation ]!.id }}
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="title">
                            Entropy
                        </p>
                        <p
                            class="content"
                            :class="[
                                entropy > entropyThresholds.mid ?
                                    entropy > entropyThresholds.high ?
                                        'warning' : 'information' : 'success'
                            ]"
                        >
                            {{ entropy }}
                        </p>
                    </td>
                    <td>
                        <p class="title">
                            Reader
                        </p>
                        <p class="content">
                            {{ session.sessionIds[ session.sessionIdx ]!.reader }}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-else class="placeholder">
            <p> Please select a Fixation</p>
        </div>
    </div>
</template>

<style scoped>
.placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--theme-bg-1);
    height: 55%;
    padding: 10px;
}

.property-pane {
    position: absolute;
    width: 15rem;
    height: 13rem;
    z-index: 1;
    box-shadow: 0px 0px 10px var(--theme-bg-1);

    user-select: none;

    background-color: var(--theme-bg-2);
    padding: 1rem;
    border-radius: 10px;

    >h1 {
        color: var(--theme-foreground-text);
    }

    >table {
        margin-top: 20px;
        width: 100%;
        background-color: var( --theme-bg-1 );
        padding: 15px;
        margin-bottom: 5px;
        display: flex;
        flex-direction: column;

        > tbody > tr > td {
            width: 100%;
            >p {
                padding: 0;
                padding-left: 3px;
                padding-right: 2px;
                margin: 0;
                width: max-content;

                &.title {
                    color: var( --theme-background-text-20 );
                    font-size: 0.8rem;
                    padding-bottom: 5px;
                }

                &.content {
                    font-size: 1.25rem;
                }

                &.warning {
                    color: var(--theme-warning);
                }

                &.information {
                    color: var(--theme-information);
                }

                &.success {
                    color: var(--theme-success);
                }
            }
        }
    }
}
</style>
