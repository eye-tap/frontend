<script setup lang="ts">
    import '@globalhive/vuejs-tour/dist/style.css';
    import {
        type Ref,
        onMounted, onUnmounted, ref
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
    const scanpathCanvas: Ref<HTMLCanvasElement | null> = ref( null );
    const linesCanvas: Ref<HTMLCanvasElement | null> = ref( null );
    const fixationsCanvas: Ref<HTMLCanvasElement | null> = ref( null );
    const indicesCanvas: Ref<HTMLCanvasElement | null> = ref( null );
    const clickTarget: Ref<HTMLCanvasElement | null> = ref( null );
    const editorInstance = editor.start(
        textCanvas,
        boxesCanvas,
        scanpathCanvas,
        linesCanvas,
        fixationsCanvas,
        indicesCanvas,
        clickTarget
    );
    const status = useStatusStore();
    const loader = editorDataLoadingLocal( editorInstance.renderer.textImage, editorInstance.renderer.renderAll );
    const showAutoSaveSuccessMessage = ref( false );

    onMounted( () => {
        document.addEventListener( 'eyetap:autosave:success', handleAutoSaveNotification );
    } );

    onUnmounted( () => {
        document.removeEventListener( 'eyetap:autosave:success', handleAutoSaveNotification );
    } );

    const handleAutoSaveNotification = () => {
        showAutoSaveSuccessMessage.value = true;
        setTimeout( () => {
            showAutoSaveSuccessMessage.value = false;
        }, 5000 );
    };

    if ( status.devMode ) {
        loader.loadBBoxCSV();
    }

    editor.useAutoSave();
</script>

<template>
    <div class="editor">
        <div v-if="status.devMode">
            Image: <input type="file" accept="image/*" @change="e => loader.loadImage( e as InputEvent )">
            Points: <input type="file" accept=".csv" @change="e => loader.loadPointsCSV( e as InputEvent )">
        </div>
        <LegendPane
            :show="false"
        />
        <div class="canvas-wrapper">
            <canvas id="text" ref="textCanvas"></canvas>
            <canvas id="scanpath" ref="scanpathCanvas" class="canvas-layer"></canvas>
            <canvas id="boxes" ref="boxesCanvas" class="canvas-layer"></canvas>
            <canvas id="lines" ref="linesCanvas" class="canvas-layer"></canvas>
            <canvas id="fixations" ref="fixationsCanvas" class="canvas-layer"></canvas>
            <canvas id="indices" ref="indicesCanvas" class="canvas-layer"></canvas>
            <canvas id="click" ref="clickTarget" class="canvas-layer"></canvas>
        </div>
        <div :class="[ 'autosave-notification', showAutoSaveSuccessMessage ? 'shown' : '' ]">
            <div class="autosave-body">
                Progress saved
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .editor {
        position: relative;
        flex-direction: column;
    }

    .autosave-notification {
        position: fixed;
        background-color: var( --theme-bg-3 );
        padding: 20px;
        bottom: calc( -1rem - 50px );
        right: 15px;
        z-index: 1002;
        font-size: 1rem;
        line-height: 100%;
        transition: bottom 0.5s ease;
        border-radius: 5px;

        &.shown {
            bottom: 15px;
        }
    }

    .canvas-wrapper {
        background-color: white;
        height: min-content;
        width: 95%;
        max-height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
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
