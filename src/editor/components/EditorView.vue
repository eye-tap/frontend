<script setup lang="ts">
    import '@globalhive/vuejs-tour/dist/style.css';
    import {
        type Ref, ref
    } from 'vue';
    import LegendPane from './LegendPane.vue';
    import editor from '..';
    import {
        editorDataLoadingLocal
    } from '../loaders/local';
    import {
        useStatusStore
    } from '@/ts/stores/status';

    const textCanvas: Ref<HTMLCanvasElement | null> = ref( null );
    const boxesCanvas: Ref<HTMLCanvasElement | null> = ref( null );
    const linesCanvas: Ref<HTMLCanvasElement | null> = ref( null );
    const fixationsCanvas: Ref<HTMLCanvasElement | null> = ref( null );
    const indicesCanvas: Ref<HTMLCanvasElement | null> = ref( null );
    const clickTarget: Ref<HTMLCanvasElement | null> = ref( null );
    const editorInstance = editor.start(
        textCanvas,
        boxesCanvas,
        linesCanvas,
        fixationsCanvas,
        indicesCanvas,
        clickTarget
    );
    const status = useStatusStore();
    const loader = editorDataLoadingLocal( editorInstance.renderer.textImage, editorInstance.renderer.renderAll );

    if ( status.devMode ) {
        loader.loadBBoxCSV();
    }
</script>

<template>
    <div class="editor">
        <div v-if="status.devMode">
            Image: <input type="file" accept="image/*" @change="e => loader.loadImage( e as InputEvent )">
            Points: <input type="file" accept=".csv" @change="e => loader.loadPointsCSV( e as InputEvent )">
        </div>
        <LegendPane
            :show="true"
        />
        <div class="canvas-wrapper">
            <canvas id="text" ref="textCanvas"></canvas>
            <canvas id="boxes" ref="boxesCanvas" class="canvas-layer"></canvas>
            <canvas id="lines" ref="linesCanvas" class="canvas-layer"></canvas>
            <canvas id="fixations" ref="fixationsCanvas" class="canvas-layer"></canvas>
            <canvas id="indices" ref="indicesCanvas" class="canvas-layer"></canvas>
            <canvas id="click" ref="clickTarget" class="canvas-layer"></canvas>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .editor {
        position: relative;
        flex-direction: column;
    }

    .canvas-wrapper {
        background-color: white;
        height: min-content;
        width: 95%;
        max-height: 100%;
        overflow-y: scroll;
        position: relative;

        #text {
            position: unset;
        }

        >canvas {
            border: 1px solid #333;
            margin: 0;
            position: absolute;
            top: 0;
            left: 0;
        }

        .canvas-layer {
            background: transparent;
        }
    }
</style>
