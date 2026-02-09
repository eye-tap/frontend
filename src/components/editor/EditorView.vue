<script setup lang="ts">
    import '@globalhive/vuejs-tour/dist/style.css';
    import {
        type Ref, ref
    } from 'vue';
    import PropertyPane from './PropertyPane.vue';
    import {
        useEditor
    } from '@/scripts/editor';
    import {
        useStatusStore
    } from '@/stores/status';
    import {
        useTestingEditorLoading
    } from '@/scripts/editor/loadingForTesting';

    const canvas: Ref<HTMLCanvasElement | null> = ref( null );
    const editor = useEditor(
        canvas
    );
    const status = useStatusStore();
    const loader = useTestingEditorLoading( editor!.redraw );

    if ( status.devMode ) {
        loader.loadBBoxCSV();
    }
</script>

<template>
    <div>
        <div v-if="status.devMode">
            Image: <input type="file" accept="image/*" @change="e => loader.loadImage( e as InputEvent )">
            Points: <input type="file" accept=".csv" @change="e => loader.loadPointsCSV( e as InputEvent )">
        </div>
        <PropertyPane
            :show-property-pane="true"
            :point-selected="true"
            :metadata="{
                'assignedBy': 'User1',
                'entropy': 10,
                'pointID': 10,
                'readerID': 10
            }"
        />
        <div class="canvas-wrapper">
            <canvas id="canvas" ref="canvas" tabindex="0"></canvas>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .canvas-wrapper {
        background-color: white;
        width: 75vw;
        height: min-content;

        >canvas {
            border: 1px solid #333;
            margin: 0;
        }
    }
</style>
