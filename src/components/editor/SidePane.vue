<script setup lang="ts">
    import {
        redo,
        undo
    } from '@/scripts/editor/history/integratableUndoRedo';
    import {
        redoAvailable,
        undoAvailable
    } from '@/scripts/editor/history/history';
    import ExportOptions from './ExportOptions.vue';
    import OptionsPane from './OptionsPane.vue';
    import {
        ref
    } from 'vue';
    import {
        saveEditorChanges
    } from '@/scripts/editor/data/save';
    import tour from '@/scripts/tour/tour';

    const isSideBarCollapsed = ref( false );

    const toggleCollapse = () => {
        isSideBarCollapsed.value = !isSideBarCollapsed.value;
    };

    const historyBar = tour.assignTourClasses( 0, 'options-bar' );
</script>
<!-- TODO: The sidebar (un)collapse animation doesn't look good right now. Ideally: Content is hidden but sidebar height preserved. -->

<template>
    <div :class="[ 'side-pane', isSideBarCollapsed ? 'collapsed' : undefined ]">
        <!-- Non-collapsed -->
        <div :class="historyBar">
            <div v-if="!isSideBarCollapsed" class="options-bar-left">
                <span class="clickable-icon" @click="undo">
                    <i v-if="undoAvailable" class="fa-lg fa-solid fa-rotate-left"></i>
                    <i v-else class="fa-lg fa-solid fa-rotate-left unavailable"></i>
                </span>
                <span class="clickable-icon" @click="redo">
                    <i v-if="redoAvailable" class="fa-lg fa-solid fa-rotate-right"></i>
                    <i v-else class="fa-lg fa-solid fa-rotate-right unavailable"></i>
                </span>
                <span class="clickable-icon" @click="saveEditorChanges">
                    <i class="fa-xl fa-solid fa-floppy-disk"></i>
                </span>
            </div>
            <div class="options-bar-right">
                <span class="clickable-icon" @click="toggleCollapse()">
                    <i class="fa-lg fa-solid fa-bars"></i>
                </span>
            </div>
        </div>
        <!-- Collapsed -->
        <div v-if="isSideBarCollapsed" class="options-bar">
            <span class="clickable-icon" @click="undo">
                <i v-if="undoAvailable" class="fa-lg fa-solid fa-rotate-left"></i>
                <i v-else class="fa-lg fa-solid fa-rotate-left unavailable"></i>
            </span>
        </div>
        <div v-if="isSideBarCollapsed" class="options-bar">
            <span class="clickable-icon" @click="redo">
                <i v-if="redoAvailable" class="fa-lg fa-solid fa-rotate-right"></i>
                <i v-else class="fa-lg fa-solid fa-rotate-right unavailable"></i>
            </span>
        </div>
        <div v-if="isSideBarCollapsed" class="options-bar">
            <span class="clickable-icon" @click="saveEditorChanges">
                <i class="fa-xl fa-solid fa-floppy-disk"></i>
            </span>
        </div>
        <!-- Content -->
        <div v-if="!isSideBarCollapsed">
            <h2>Options</h2>
            <OptionsPane />
        </div>
        <div v-if="!isSideBarCollapsed">
            <h2>Export</h2>
            <ExportOptions />
        </div>
        <div v-if="!isSideBarCollapsed" class="bottom-buttons">
            <button class="button primary" @click="saveEditorChanges">
                Save
            </button>
            <RouterLink to="/app" class="button secondary">
                Back
            </RouterLink>
        </div>
    </div>
</template>


<style lang="scss" scoped>
@use '@/scss/components/page-tour.scss';

.side-pane {
    width: 22vw;
    min-width: 400px;
    max-width: 22vw;
    display: block;
    overflow-x: hidden;
    transition: width 0.5s, min-width 0.5s;

    .export-button {
        margin-top: 1rem;
    }

    .bottom-buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .options-bar {
        display: flex;
        align-items: center;
        justify-content: right;

        .clickable-icon {
            cursor: pointer;
        }

        .unavailable {
            color:  var(--theme-bg-3-20);
            cursor: not-allowed;
        }

        .options-bar-left {
            display: flex;
            align-items: center;
            justify-content: left;
            width: 100%;
        }

        .options-bar-right {
            display: flex;
            align-items: center;
        }
    }

    &.collapsed {
        width: 5vw;
        min-width: 0;
    }

    >div {
        background-color: var( --theme-bg-2 );
        margin-top: 10px;
        margin-left: 10px;
        margin-right: 20px;
        margin-bottom: 10px;
        padding: 20px;

        >h2 {
            margin: 0;
            margin-bottom: 10px;
        }
    }
}
</style>
