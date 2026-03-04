<script setup lang="ts">
    import {
        type Ref,
        ref
    } from 'vue';
    import {
        assignedFixationColor,
        heatMapMaxColor,
        heatMapMidColor,
        heatMapMinColor,
        machineAssignedFixationColor,
        selectedFixationColor,
        unassignedFixationColor
    } from '../config';
    import ColorOption from '@/components/settings/ColorOption.vue';
    import type {
        EditorPoint
    } from '../types/annotation';
    import {
        automatedColourMapper
    } from '../util/colour';

    const props = defineProps<{
        'show': boolean,
    }>();
    const isDragging = ref( false );
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
        }
    };

    const mouseUp = () => {
        isDragging.value = false;
    };

    const minHeatMapColor = automatedColourMapper( heatMapMinColor );
    const midHeatMapColor = automatedColourMapper( heatMapMidColor );
    const maxHeatMapColor = automatedColourMapper( heatMapMaxColor );
</script>

<template>
    <div
        v-if="props.show"
        id="tour-properties"
        class="legend"
        :style="`bottom: ${ pos.y }px; right: ${ pos.x }px;`"
        @mousemove="dragHandler"
        @mouseup="mouseUp"
    >
        <h2>Legend</h2>
        <div class="placeholder">
            <p>Fixation Colors</p>
            <ColorOption v-model="selectedFixationColor" text="Selected" />
            <ColorOption v-model="assignedFixationColor" text="User-assigned" />
            <ColorOption v-model="machineAssignedFixationColor" text="Algorithm-assigned" />
            <ColorOption v-model="unassignedFixationColor" text="Unassigned" />
            <ColorOption v-model="minHeatMapColor" text="Low Entropy" />
            <ColorOption v-model="midHeatMapColor" text="Medium Entropy" />
            <ColorOption v-model="maxHeatMapColor" text="High Entropy" />
        </div>
    </div>
</template>

<style scoped>

.legend {
    position: absolute;
    width: 15rem;
    height: 16rem;
    z-index: 1;
    box-shadow: 0px 0px 10px var(--theme-bg-1);

    user-select: none;

    >h2 {
        margin: 0px;
        padding-bottom: 1rem;
    }

    >div {
        background-color: var(--theme-bg-1);
        padding: 10px;

        >p {
            color: var(--theme-background-text-20);
            margin: 0px;
            padding-bottom: 1rem;
        }
    }

    background-color: var(--theme-bg-2);
    padding: 1rem;
    border-radius: 10px;
}
</style>
